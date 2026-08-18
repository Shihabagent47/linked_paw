'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import PostCard from './PostCard'
import type { FeedPost, ReactionType, ReactionCounts } from '@/app/lib/types'

const PAGE_SIZE = 10

type Props = {
  initialPosts: FeedPost[]
  currentUserId: string | null
}

async function fetchPostBatch(cursor: string | null, currentUserId: string | null): Promise<{ posts: FeedPost[]; nextCursor: string | null }> {
  const supabase = createClient()

  let query = supabase
    .from('posts')
    .select(`id, author_id, content, image_url, view_count, created_at,
      author:profiles!author_id(id, display_name, username, title, avatar_url, species, is_alpha)`)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data: rawPosts } = await query
  if (!rawPosts?.length) return { posts: [], nextCursor: null }

  const postIds = rawPosts.map(p => p.id)

  const { data: reactions } = await supabase
    .from('reactions')
    .select('post_id, type, user_id')
    .in('post_id', postIds)

  const { data: commentRows } = await supabase
    .from('comments')
    .select('post_id')
    .in('post_id', postIds)

  const reactionsByPost = new Map<string, ReactionCounts>()
  const myReactionByPost = new Map<string, ReactionType>()
  const commentCountByPost = new Map<string, number>()

  for (const r of reactions ?? []) {
    const counts = reactionsByPost.get(r.post_id) ?? {}
    counts[r.type as ReactionType] = (counts[r.type as ReactionType] ?? 0) + 1
    reactionsByPost.set(r.post_id, counts)
    if (currentUserId && r.user_id === currentUserId) {
      myReactionByPost.set(r.post_id, r.type as ReactionType)
    }
  }

  for (const c of commentRows ?? []) {
    commentCountByPost.set(c.post_id, (commentCountByPost.get(c.post_id) ?? 0) + 1)
  }

  const posts: FeedPost[] = rawPosts.map(p => ({
    id: p.id,
    author_id: p.author_id,
    author: p.author as unknown as FeedPost['author'],
    content: p.content,
    image_url: p.image_url,
    view_count: p.view_count,
    reaction_counts: reactionsByPost.get(p.id) ?? {},
    comment_count: commentCountByPost.get(p.id) ?? 0,
    my_reaction: myReactionByPost.get(p.id) ?? null,
    created_at: p.created_at,
  }))

  const nextCursor = posts.length === PAGE_SIZE ? posts[posts.length - 1].created_at : null
  return { posts, nextCursor }
}

export default function Feed({ initialPosts, currentUserId }: Props) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPosts.length === PAGE_SIZE ? initialPosts[initialPosts.length - 1].created_at : null
  )
  const [loading, setLoading] = useState(false)
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set())

  const loadMore = useCallback(async () => {
    if (loading || !nextCursor) return
    setLoading(true)
    try {
      const { posts: more, nextCursor: next } = await fetchPostBatch(nextCursor, currentUserId)
      setPosts(prev => {
        const ids = new Set(prev.map(p => p.id))
        return [...prev, ...more.filter(p => !ids.has(p.id))]
      })
      setNextCursor(next)
    } finally {
      setLoading(false)
    }
  }, [loading, nextCursor, currentUserId])

  const prependPost = useCallback((post: FeedPost) => {
    setPosts(prev => {
      if (prev.some(p => p.id === post.id)) return prev
      return [post, ...prev]
    })
    setNewPostIds(ids => new Set([...ids, post.id]))
    setTimeout(() => {
      setNewPostIds(ids => {
        const next = new Set(ids)
        next.delete(post.id)
        return next
      })
    }, 3000)
  }, [])

  // Expose prependPost for the PostComposer via a custom event
  useEffect(() => {
    const handler = (e: CustomEvent<FeedPost>) => prependPost(e.detail)
    window.addEventListener('new-post', handler as EventListener)
    return () => window.removeEventListener('new-post', handler as EventListener)
  }, [prependPost])

  // Supabase Realtime — new posts from other users
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const raw = payload.new as { id: string; author_id: string; content: string; image_url: string | null; view_count: number; created_at: string }

        // Skip our own posts (already prepended by PostComposer callback)
        if (currentUserId && raw.author_id === currentUserId) return

        // Fetch author profile
        const { data: author } = await supabase
          .from('profiles')
          .select('id, display_name, username, title, avatar_url, species, is_alpha')
          .eq('id', raw.author_id)
          .single()

        if (!author) return

        const post: FeedPost = {
          id: raw.id,
          author_id: raw.author_id,
          author: author as FeedPost['author'],
          content: raw.content,
          image_url: raw.image_url,
          view_count: raw.view_count,
          reaction_counts: {},
          comment_count: 0,
          my_reaction: null,
          created_at: raw.created_at,
        }
        prependPost(post)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, prependPost])

  return (
    <div className="space-y-3">
      {posts.map(post => (
        <div
          key={post.id}
          className={newPostIds.has(post.id) ? 'ring-2 ring-[#0a66c2] ring-opacity-50 rounded-lg transition-all duration-1000' : ''}
        >
          <PostCard post={post} currentUserId={currentUserId} />
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
          No posts yet. Be the first to share something!
        </div>
      )}

      {!currentUserId && posts.length >= 100 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-8 text-center space-y-4">
          <div className="text-3xl">🐾</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            You&apos;ve explored 100 posts
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Join the pride to keep going — post, react, connect, and find your next opportunity.
          </p>
          <div className="flex gap-3 justify-center pt-1">
            <a
              href="/signup"
              className="px-5 py-2 rounded-full bg-[#0a66c2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors"
            >
              Join free
            </a>
            <a
              href="/login"
              className="px-5 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      ) : nextCursor ? (
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-6 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more posts'}
          </button>
        </div>
      ) : null}
    </div>
  )
}


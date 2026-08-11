import LeftSidebar from '@/app/components/LeftSidebar'
import RightSidebar from '@/app/components/RightSidebar'
import Feed from '@/app/components/Feed'
import PostComposer from '@/app/components/PostComposer'
import { getCurrentUser } from '@/app/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { FeedPost, ReactionType, ReactionCounts } from '@/app/lib/types'

const PAGE_SIZE = 10

async function getInitialPosts(currentUserId: string | null): Promise<{ posts: FeedPost[]; cursor: string | null }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { posts: [], cursor: null }

  const supabase = await createClient()

  const { data: rawPosts } = await supabase
    .from('posts')
    .select(`id, author_id, content, image_url, view_count, created_at,
      author:profiles!author_id(id, display_name, username, title, avatar_url, species, is_alpha)`)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (!rawPosts?.length) return { posts: [], cursor: null }

  const postIds = rawPosts.map(p => p.id)

  const [{ data: reactions }, { data: commentRows }] = await Promise.all([
    supabase.from('reactions').select('post_id, type, user_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
  ])

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

  const cursor = posts.length === PAGE_SIZE ? posts[posts.length - 1].created_at : null
  return { posts, cursor }
}

export default async function Home() {
  const user = await getCurrentUser()
  const { posts: initialPosts } = await getInitialPosts(user?.id ?? null)

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>

          {/* Center: Feed */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Post composer */}
            {user ? (
              <PostComposer currentUser={user} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                <a href="/login" className="text-[#0a66c2] font-semibold hover:underline">Sign in</a> to post, react, and comment.
              </div>
            )}

            {/* Sort bar */}
            <div className="flex items-center justify-between px-1">
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
              <button className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1 px-3 hover:text-black dark:hover:text-white transition-colors shrink-0">
                Sort: Top posts ▾
              </button>
            </div>

            {/* Feed */}
            <Feed initialPosts={initialPosts} currentUserId={user?.id ?? null} />
          </div>

          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}

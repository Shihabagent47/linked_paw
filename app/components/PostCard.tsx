'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { FeedPost, ReactionType, Comment } from '@/app/lib/types'

const REACTIONS: { type: ReactionType; emoji: string; label: string; activeClass: string }[] = [
  { type: 'like',      emoji: '👍', label: 'Like',      activeClass: 'text-[#0a66c2]' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate', activeClass: 'text-amber-500' },
  { type: 'paw',       emoji: '🐾', label: 'Paw',       activeClass: 'text-red-500'   },
  { type: 'roar',      emoji: '🦁', label: 'Roar',      activeClass: 'text-orange-500'},
  { type: 'curious',   emoji: '🤔', label: 'Curious',   activeClass: 'text-purple-500'},
  { type: 'support',   emoji: '🤝', label: 'Support',   activeClass: 'text-green-500' },
]

const CONTENT_LIMIT = 280

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`
  return `${Math.floor(diff / 2592000)}mo`
}

function PostContent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((token, i) =>
        token.startsWith('#') && token.length > 1
          ? <span key={i} className="text-[#0a66c2] font-medium">{token}</span>
          : <span key={i}>{token}</span>
      )}
    </>
  )
}

type Props = {
  post: FeedPost
  currentUserId: string | null
}

export default function PostCard({ post, currentUserId }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [myReaction, setMyReaction] = useState<ReactionType | null>(post.my_reaction)
  const [reactionCounts, setReactionCounts] = useState(post.reaction_counts)
  const [commentCount, setCommentCount] = useState(post.comment_count)
  const [showPicker, setShowPicker] = useState(false)
  const pickerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const author = post.author
  const isLong = post.content.length > CONTENT_LIMIT
  const displayText = isLong && !expanded ? post.content.slice(0, CONTENT_LIMIT) + '…' : post.content

  const topReactionTypes = [...new Set([
    ...(myReaction ? [myReaction] : []),
    ...Object.keys(reactionCounts) as ReactionType[],
  ])].slice(0, 3)

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0)
    + (myReaction && !reactionCounts[myReaction] ? 1 : 0)

  const activeReaction = REACTIONS.find(r => r.type === myReaction) ?? null

  async function react(type: ReactionType) {
    if (!currentUserId) return

    const prev = myReaction
    const prevCounts = { ...reactionCounts }

    // Optimistic update
    if (myReaction === type) {
      setMyReaction(null)
      setReactionCounts(c => {
        const next = { ...c }
        next[type] = Math.max(0, (next[type] ?? 1) - 1)
        if (next[type] === 0) delete next[type]
        return next
      })
    } else {
      if (myReaction) {
        setReactionCounts(c => {
          const next = { ...c }
          next[myReaction] = Math.max(0, (next[myReaction] ?? 1) - 1)
          if (next[myReaction] === 0) delete next[myReaction]
          return next
        })
      }
      setMyReaction(type)
      setReactionCounts(c => ({ ...c, [type]: (c[type] ?? 0) + 1 }))
    }
    setShowPicker(false)

    try {
      if (myReaction === type) {
        await fetch(`/api/posts/${post.id}/reactions`, { method: 'DELETE' })
      } else {
        await fetch(`/api/posts/${post.id}/reactions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        })
      }
    } catch {
      // Rollback on error
      setMyReaction(prev)
      setReactionCounts(prevCounts)
    }
  }

  async function loadComments() {
    if (commentsLoaded) return
    const res = await fetch(`/api/posts/${post.id}/comments`)
    if (res.ok) {
      const data = await res.json()
      setComments(data)
    }
    setCommentsLoaded(true)
  }

  async function toggleComments() {
    const next = !showComments
    setShowComments(next)
    if (next && !commentsLoaded) await loadComments()
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentInput.trim() || !currentUserId || submittingComment) return
    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentInput.trim() }),
      })
      if (res.ok) {
        const comment = await res.json()
        setComments(c => [...c, comment])
        setCommentCount(n => n + 1)
        setCommentInput('')
      }
    } finally {
      setSubmittingComment(false)
    }
  }

  function openPicker() {
    if (pickerTimeout.current) clearTimeout(pickerTimeout.current)
    pickerTimeout.current = setTimeout(() => setShowPicker(true), 350)
  }

  function closePicker() {
    if (pickerTimeout.current) clearTimeout(pickerTimeout.current)
    pickerTimeout.current = setTimeout(() => setShowPicker(false), 200)
  }

  function cancelClose() {
    if (pickerTimeout.current) clearTimeout(pickerTimeout.current)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700">

      {/* Author header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Link href={`/profile/${author.id}`} className="shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={author.display_name} fill className="object-cover" sizes="48px" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-500">
                {author.display_name[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href={`/profile/${author.id}`} className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:underline leading-tight">
              {author.display_name}
            </Link>
            {author.is_alpha && (
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-600 rounded px-1 leading-[1.4]">
                🐾 Alpha
              </span>
            )}
          </div>
          {author.title && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5 truncate">{author.title}</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(new Date(post.created_at))} · 🌍</p>
        </div>
      </div>

      {/* Post body */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
          <PostContent text={displayText} />
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-sm text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-700 dark:hover:text-gray-200 mt-0.5"
          >
            {expanded ? 'see less' : 'see more'}
          </button>
        )}
      </div>

      {/* Optional image */}
      {post.image_url && (
        <div className="relative w-full aspect-video overflow-hidden">
          <Image src={post.image_url} alt="post image" fill className="object-cover" />
        </div>
      )}

      {/* Alpha view count (own posts only, shown when currentUserId = author) */}
      {author.is_alpha && currentUserId === author.id && post.view_count > 0 && (
        <div className="px-4 pt-2 text-xs text-amber-600 dark:text-amber-500 font-medium">
          👁 {post.view_count.toLocaleString()} view{post.view_count !== 1 ? 's' : ''}
        </div>
      )}

      {/* Engagement stats */}
      {(totalReactions > 0 || commentCount > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            {topReactionTypes.length > 0 && (
              <div className="flex -space-x-0.5">
                {topReactionTypes.map(type => (
                  <span key={type} className="text-sm">
                    {REACTIONS.find(r => r.type === type)?.emoji ?? '👍'}
                  </span>
                ))}
              </div>
            )}
            {totalReactions > 0 && (
              <span className="ml-1 hover:text-[#0a66c2] hover:underline cursor-pointer">
                {totalReactions}
              </span>
            )}
          </div>
          {commentCount > 0 && (
            <button
              onClick={toggleComments}
              className="hover:text-[#0a66c2] hover:underline"
            >
              {commentCount} comment{commentCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-700 mx-4" />

      {/* Action bar */}
      <div className="flex px-2 py-1">
        {/* Like — with reaction picker */}
        <div
          className="flex-1 relative"
          onMouseEnter={openPicker}
          onMouseLeave={closePicker}
        >
          {showPicker && (
            <div
              className="absolute bottom-full left-2 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center px-2 py-1.5 gap-0.5 z-20"
              onMouseEnter={cancelClose}
              onMouseLeave={closePicker}
            >
              {REACTIONS.map(({ type, emoji, label }) => (
                <button
                  key={type}
                  onClick={() => react(type)}
                  title={label}
                  className={`text-2xl px-1 py-0.5 rounded-full hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform duration-100 ${myReaction === type ? 'scale-110' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => react(myReaction ?? 'like')}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded transition-colors ${
              activeReaction
                ? `${activeReaction.activeClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span className="text-sm">{activeReaction ? activeReaction.emoji : '👍'}</span>
            <span className="hidden sm:inline">{activeReaction ? activeReaction.label : 'Like'}</span>
          </button>
        </div>

        {/* Comment */}
        <button
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <span className="text-sm">💬</span>
          <span className="hidden sm:inline">Comment</span>
        </button>

        {/* Repost */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <span className="text-sm">🔁</span>
          <span className="hidden sm:inline">Repost</span>
        </button>

        {/* Send */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <span className="text-sm">📨</span>
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2.5">
              <Link href={`/profile/${comment.author.id}`} className="shrink-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                  {comment.author.avatar_url ? (
                    <Image src={comment.author.avatar_url} alt={comment.author.display_name} fill className="object-cover" sizes="32px" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-500">
                      {comment.author.display_name[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
                  <Link href={`/profile/${comment.author.id}`} className="text-xs font-semibold text-gray-900 dark:text-gray-100 hover:underline">
                    {comment.author.display_name}
                  </Link>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">{comment.content}</p>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">{timeAgo(new Date(comment.created_at))}</p>
              </div>
            </div>
          ))}

          {/* Comment input */}
          {currentUserId && (
            <form onSubmit={submitComment} className="flex gap-2 mt-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder="Add a comment…"
                  className="w-full text-xs border border-gray-200 dark:border-gray-600 rounded-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2] dark:focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!commentInput.trim() || submittingComment}
                className="text-xs font-semibold text-[#0a66c2] disabled:opacity-40 hover:text-blue-700 transition-colors"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

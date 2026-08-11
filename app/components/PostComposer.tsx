'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { CurrentUser, FeedPost, ReactionCounts } from '@/app/lib/types'

type Props = {
  currentUser: CurrentUser
}

export default function PostComposer({ currentUser }: Props) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function openModal() { setOpen(true) }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    openModal()
  }

  function removeImage() {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function close() {
    setOpen(false)
    setError(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('content', content.trim())
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await fetch('/api/posts', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to post')
        return
      }

      const feedPost: FeedPost = {
        ...json,
        author: json.author,
        reaction_counts: {} as ReactionCounts,
        comment_count: 0,
        my_reaction: null,
      }
      window.dispatchEvent(new CustomEvent('new-post', { detail: feedPost }))
      setContent('')
      removeImage()
      close()
    } catch {
      setError('Network error — please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Single hidden file input, always mounted */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImage}
      />

      {/* Trigger row */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-3">
        <div className="flex gap-3 items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
            {currentUser.avatar_url ? (
              <Image src={currentUser.avatar_url} alt={currentUser.display_name} fill className="object-cover" sizes="48px" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 dark:text-gray-300">
                {currentUser.display_name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <button
            onClick={openModal}
            className="flex-1 text-left text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Share your latest hunt, {currentUser.display_name?.split(' ')[0] ?? 'friend'}…
          </button>
        </div>
        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>📸</span>
            <span className="hidden sm:inline">Photo</span>
          </button>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>📝</span>
            <span className="hidden sm:inline">Article</span>
          </button>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>🦴</span>
            <span className="hidden sm:inline">Cringe Post</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 shrink-0">
                  {currentUser.avatar_url ? (
                    <Image src={currentUser.avatar_url} alt={currentUser.display_name} fill className="object-cover" sizes="40px" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-sm font-bold text-gray-500">
                      {currentUser.display_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentUser.display_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Post to anyone · 🌍</p>
                </div>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <form onSubmit={submit} className="p-5 space-y-4">
              <textarea
                autoFocus
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind? Share a hunt, a bark, a discovery…"
                rows={5}
                className="w-full text-sm text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none leading-relaxed"
              />

              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <Image src={imagePreview} alt="preview" width={500} height={300} className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-base"
                  title="Add photo"
                >
                  📸
                </button>

                <div className="flex items-center gap-3">
                  {!currentUser.is_alpha && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">5 posts/day limit</span>
                  )}
                  <button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    className="bg-[#0a66c2] text-white text-sm font-semibold rounded-full px-5 py-1.5 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

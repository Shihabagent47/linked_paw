'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { markAllNotificationsRead, markNotificationRead } from '@/app/lib/actions/notifications'

export type DbNotification = {
  id: string
  type: string
  entity_id: string | null
  read: boolean
  created_at: string
  actor: {
    id: string
    display_name: string
    username: string
    avatar_url: string | null
    species: string
    is_alpha: boolean
  } | null
}

type Filter = 'all' | 'unread' | 'connections' | 'reactions' | 'comments'

const TYPE_CONFIG: Record<string, {
  emoji: string; bg: string; color: string; verb: string
  link: (n: DbNotification) => string
}> = {
  connection_request: {
    emoji: '🤝', bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400',
    verb: 'wants to join your herd', link: () => '/network',
  },
  connection_accepted: {
    emoji: '🎉', bg: 'bg-green-100 dark:bg-green-900/40', color: 'text-green-600 dark:text-green-400',
    verb: 'accepted your connection request', link: (n) => n.actor ? `/profile/${n.actor.id}` : '/network',
  },
  reaction: {
    emoji: '👍', bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-600 dark:text-amber-400',
    verb: 'reacted to your post', link: () => '/',
  },
  comment: {
    emoji: '💬', bg: 'bg-purple-100 dark:bg-purple-900/40', color: 'text-purple-600 dark:text-purple-400',
    verb: 'commented on your post', link: () => '/',
  },
  job_application: {
    emoji: '💼', bg: 'bg-indigo-100 dark:bg-indigo-900/40', color: 'text-indigo-600 dark:text-indigo-400',
    verb: 'applied to your job listing', link: (n) => n.entity_id ? `/jobs/${n.entity_id}` : '/jobs',
  },
  profile_view: {
    emoji: '👁️', bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400',
    verb: 'viewed your profile', link: () => '/notifications',
  },
}

const FALLBACK_CONFIG = {
  emoji: '🔔', bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400',
  verb: 'sent you a notification', link: () => '/notifications' as string,
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 2592000)}mo ago`
}

const TABS: { key: Filter; label: string; types?: string[] }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'connections', label: 'Connections', types: ['connection_request', 'connection_accepted'] },
  { key: 'reactions', label: 'Reactions', types: ['reaction'] },
  { key: 'comments', label: 'Comments', types: ['comment'] },
]

function NotifRow({ n, onRead }: { n: DbNotification; onRead: (id: string) => void }) {
  const config = TYPE_CONFIG[n.type] ?? FALLBACK_CONFIG
  const href = config.link(n)

  return (
    <Link
      href={href}
      onClick={() => { if (!n.read) onRead(n.id) }}
      className={`flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
    >
      <div className="relative shrink-0">
        {n.actor?.avatar_url ? (
          <>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
              <Image src={n.actor.avatar_url} alt={n.actor.display_name} fill className="object-cover" sizes="48px" />
            </div>
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${config.bg}`}>
              {config.emoji}
            </span>
          </>
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${config.bg}`}>
            {config.emoji}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
          {n.actor
            ? <><span className="font-bold">{n.actor.display_name}</span> {config.verb}</>
            : config.verb}
        </p>
        <p className={`text-xs mt-1 ${!n.read ? 'text-[#0a66c2] font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>
          {timeAgo(n.created_at)}
        </p>
      </div>

      {!n.read && (
        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#0a66c2] mt-1.5" />
      )}
    </Link>
  )
}

export default function NotificationsClient({ notifications: initial }: { notifications: DbNotification[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState<Filter>('all')

  // Mark all as read on page visit
  useEffect(() => {
    if (initial.some(n => !n.read)) {
      markAllNotificationsRead().then(() => router.refresh())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleMarkRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await markNotificationRead(id)
  }

  async function handleMarkAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
    await markAllNotificationsRead()
    router.refresh()
  }

  const filtered = items.filter(n => {
    if (filter === 'unread') return !n.read
    const tab = TABS.find(t => t.key === filter)
    if (tab?.types) return tab.types.includes(n.type)
    return true
  })

  const unread = filtered.filter(n => !n.read)
  const read = filtered.filter(n => n.read)
  const totalUnread = items.filter(n => !n.read).length

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            {totalUnread > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{totalUnread} new</p>
            )}
          </div>
          {totalUnread > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs font-semibold text-[#0a66c2] hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 flex mb-4 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 min-w-fit text-xs font-semibold px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                filter === key
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {label}
              {key === 'unread' && totalUnread > 0 && (
                <span className="ml-1.5 bg-[#0a66c2] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                  {totalUnread}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nothing here.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">The savanna is quiet. For now.</p>
            </div>
          ) : (
            <>
              {unread.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">New</p>
                  </div>
                  {unread.map(n => <NotifRow key={n.id} n={n} onRead={handleMarkRead} />)}
                </>
              )}
              {read.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Earlier</p>
                  </div>
                  {read.map(n => <NotifRow key={n.id} n={n} onRead={handleMarkRead} />)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

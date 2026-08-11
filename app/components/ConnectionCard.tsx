'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { NetworkProfile, ConnectionStatus } from '@/app/lib/types'

const BANNERS = [
  'from-amber-400 to-orange-500',
  'from-blue-400 to-indigo-600',
  'from-green-400 to-teal-600',
  'from-purple-400 to-pink-600',
  'from-rose-400 to-red-600',
  'from-cyan-400 to-blue-600',
  'from-yellow-400 to-amber-600',
  'from-emerald-400 to-green-600',
  'from-violet-400 to-purple-600',
  'from-sky-400 to-cyan-600',
]

function hashId(id: string) {
  let n = 0
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff
  return n
}

type Props = {
  profile: NetworkProfile
  onStatusChange: (id: string, status: ConnectionStatus, connectionId: string | null) => void
}

export default function ConnectionCard({ profile, onStatusChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const banner = BANNERS[hashId(profile.id) % BANNERS.length]

  async function handleConnect() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: profile.id }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed'); return }
      onStatusChange(profile.id, 'pending_sent', json.id)
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdraw() {
    if (!profile.connection_id) return
    setLoading(true)
    setError(null)
    try {
      await fetch(`/api/connections/${profile.connection_id}`, { method: 'DELETE' })
      onStatusChange(profile.id, 'none', null)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept() {
    if (!profile.connection_id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/connections/${profile.connection_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (res.ok) onStatusChange(profile.id, 'connected', profile.connection_id)
    } finally {
      setLoading(false)
    }
  }

  async function handleDecline() {
    if (!profile.connection_id) return
    setLoading(true)
    try {
      await fetch(`/api/connections/${profile.connection_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' }),
      })
      onStatusChange(profile.id, 'none', null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className={`h-14 bg-gradient-to-r ${banner}`} />

      <div className="px-3 -mt-7 pb-3 flex flex-col flex-1">
        <Link href={`/profile/${profile.id}`} className="shrink-0 w-14 h-14 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden mb-2 bg-white dark:bg-gray-700 block relative">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.display_name} fill className="object-cover" sizes="56px" />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-500">
              {profile.display_name[0]?.toUpperCase()}
            </span>
          )}
        </Link>

        <Link
          href={`/profile/${profile.id}`}
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline leading-tight line-clamp-1"
        >
          {profile.display_name}
          {profile.is_alpha && <span className="ml-1 text-amber-600 dark:text-amber-400 text-[10px]">🐾</span>}
        </Link>
        {profile.title && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5 line-clamp-2">{profile.title}</p>
        )}
        {profile.location && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{profile.location}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{profile.species}</p>

        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}

        <div className="mt-auto pt-3 space-y-1.5">
          {profile.connection_status === 'none' && (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
            >
              {loading ? '…' : '+ Connect'}
            </button>
          )}

          {profile.connection_status === 'pending_sent' && (
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? '…' : 'Pending ▾'}
            </button>
          )}

          {profile.connection_status === 'pending_received' && (
            <div className="flex gap-1.5">
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 text-xs font-semibold text-white bg-[#0a66c2] rounded-full py-1.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                disabled={loading}
                className="flex-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Ignore
              </button>
            </div>
          )}

          {profile.connection_status === 'connected' && (
            <button className="w-full text-xs font-semibold text-white bg-[#057642] rounded-full py-1.5 cursor-default">
              ✓ Connected
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

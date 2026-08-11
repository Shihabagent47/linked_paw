'use client'

import { useState } from 'react'
import EditProfileModal from './EditProfileModal'
import type { Profile, ConnectionStatus } from '@/app/lib/types'

type Props = {
  profile: Profile
  isOwner: boolean
  connectionStatus?: ConnectionStatus
  connectionId?: string | null
}

export default function ProfileActions({ profile, isOwner, connectionStatus = 'none', connectionId = null }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus>(connectionStatus)
  const [connId, setConnId] = useState<string | null>(connectionId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setStatus('pending_sent')
      setConnId(json.id)
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdraw() {
    if (!connId) return
    setLoading(true)
    setError(null)
    try {
      await fetch(`/api/connections/${connId}`, { method: 'DELETE' })
      setStatus('none')
      setConnId(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept() {
    if (!connId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/connections/${connId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (res.ok) setStatus('connected')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 pb-1 flex-wrap">
        {isOwner ? (
          <button
            onClick={() => setEditOpen(true)}
            className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Edit profile
          </button>
        ) : (
          <>
            {status === 'none' && (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="text-sm font-semibold bg-[#0a66c2] text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '…' : 'Connect'}
              </button>
            )}
            {status === 'pending_sent' && (
              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="text-sm font-semibold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? '…' : 'Pending ▾'}
              </button>
            )}
            {status === 'pending_received' && (
              <button
                onClick={handleAccept}
                disabled={loading}
                className="text-sm font-semibold bg-[#0a66c2] text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '…' : 'Accept'}
              </button>
            )}
            {status === 'connected' && (
              <button className="text-sm font-semibold text-white bg-[#057642] rounded-full px-4 py-1.5 cursor-default">
                ✓ Connected
              </button>
            )}
            <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Message
            </button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {editOpen && <EditProfileModal profile={profile} onClose={() => setEditOpen(false)} />}
    </>
  )
}

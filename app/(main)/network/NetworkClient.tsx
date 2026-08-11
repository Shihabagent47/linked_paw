'use client'

import { useState } from 'react'
import ConnectionCard from '@/app/components/ConnectionCard'
import type { NetworkProfile, ConnectionStatus } from '@/app/lib/types'

type Tab = 'discover' | 'herd' | 'waiting'

type Props = {
  initialProfiles: NetworkProfile[]
  currentUserSpecies: string
  isAlpha: boolean
}

export default function NetworkClient({ initialProfiles, currentUserSpecies, isAlpha }: Props) {
  const [profiles, setProfiles] = useState<NetworkProfile[]>(initialProfiles)
  const [tab, setTab] = useState<Tab>('discover')
  const [speciesFilter, setSpeciesFilter] = useState('All')
  const [query, setQuery] = useState('')

  const allSpecies = ['All', ...Array.from(new Set(profiles.map(p => p.species))).sort()]

  function updateStatus(id: string, status: ConnectionStatus, connectionId: string | null) {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, connection_status: status, connection_id: connectionId } : p))
  }

  const connectedCount = profiles.filter(p => p.connection_status === 'connected').length
  const pendingReceivedCount = profiles.filter(p => p.connection_status === 'pending_received').length

  const filtered = profiles.filter(p => {
    const matchesTab =
      tab === 'discover' ? p.connection_status === 'none' || p.connection_status === 'pending_sent' :
      tab === 'herd' ? p.connection_status === 'connected' :
      p.connection_status === 'pending_received'

    const matchesSpecies = speciesFilter === 'All' || p.species === speciesFilter
    const matchesQuery =
      query.trim() === '' ||
      p.display_name.toLowerCase().includes(query.toLowerCase()) ||
      (p.title ?? '').toLowerCase().includes(query.toLowerCase()) ||
      p.species.toLowerCase().includes(query.toLowerCase())

    return matchesTab && matchesSpecies && matchesQuery
  })

  // Prioritize same species in discover tab
  const sorted = tab === 'discover'
    ? [...filtered].sort((a, b) => {
        const aSame = a.species === currentUserSpecies ? 0 : 1
        const bSame = b.species === currentUserSpecies ? 0 : 1
        return aSame - bSame
      })
    : filtered

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">My Herd</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {connectedCount} connected
              {pendingReceivedCount > 0 && ` · ${pendingReceivedCount} waiting`}
              {!isAlpha && <span className="text-amber-600 dark:text-amber-500"> · 50 connection limit</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 h-9 w-full sm:w-64 focus-within:border-[#0a66c2] transition-colors">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search animals..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-3 border-b border-gray-100 dark:border-gray-700">
          {([
            { key: 'discover', label: 'Discover' },
            { key: 'herd',     label: `My Herd${connectedCount > 0 ? ` (${connectedCount})` : ''}` },
            { key: 'waiting',  label: `Waiting${pendingReceivedCount > 0 ? ` (${pendingReceivedCount})` : ''}` },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                tab === key
                  ? 'text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Species filter */}
        <div className="flex gap-1.5 flex-wrap mt-3">
          {allSpecies.map(s => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                speciesFilter === s
                  ? 'bg-[#0a66c2] text-white border-[#0a66c2]'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#0a66c2] hover:text-[#0a66c2]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* Grid */}
        <div className="flex-1 min-w-0">
          {sorted.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-8 text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {tab === 'discover' ? 'No animals to discover.' : tab === 'herd' ? 'No connections yet.' : 'No pending requests.'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {tab === 'discover' ? 'Try a different species filter.' : 'Come back later!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sorted.map(p => (
                <ConnectionCard key={p.id} profile={p} onStatusChange={updateStatus} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-[240px] shrink-0 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Your network</p>
            <div className="space-y-3">
              {[
                { label: 'Total connections', value: connectedCount, color: 'text-[#0a66c2]' },
                { label: 'Pending requests', value: pendingReceivedCount, color: 'text-amber-600' },
                { label: 'Animals in network', value: profiles.length, color: 'text-gray-800 dark:text-gray-200' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Grow your herd</p>
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <p>Connect with animals from your species first — they roam the same territory.</p>
              <p>Animals with 5000+ connections get 10× more prey opportunities.</p>
            </div>
          </div>

          {!isAlpha && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">✨ Try Alpha Paw</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                Unlimited connections. Priority in the migration. Get the Alpha badge.
              </p>
              <a
                href="/upgrade"
                className="block w-full text-center text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-400 dark:border-amber-600 rounded-full py-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                Upgrade to Alpha Paw
              </a>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

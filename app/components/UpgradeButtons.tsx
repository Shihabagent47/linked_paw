'use client'

import { useState } from 'react'

export default function UpgradeButtons({ isAlpha }: { isAlpha: boolean }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  if (isAlpha) {
    return (
      <button
        onClick={handlePortal}
        disabled={loading === 'portal'}
        className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        {loading === 'portal' ? 'Loading…' : 'Manage Subscription'}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => handleCheckout('monthly')}
        disabled={!!loading}
        className="w-full py-2.5 px-4 bg-[#0a66c2] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        {loading === 'monthly' ? 'Loading…' : 'Upgrade Monthly — $8/mo'}
      </button>
      <button
        onClick={() => handleCheckout('yearly')}
        disabled={!!loading}
        className="w-full py-2.5 px-4 border border-[#0a66c2] text-[#0a66c2] dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        {loading === 'yearly' ? 'Loading…' : 'Upgrade Yearly — $72/yr'}
      </button>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500">Save 25% with annual billing</p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { applyToJob } from '@/app/lib/actions/jobs'

export default function ApplyButton({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const [applied, setApplied] = useState(hasApplied)
  const [loading, setLoading] = useState(false)

  async function handleApply() {
    if (applied || loading) return
    setLoading(true)
    const result = await applyToJob(jobId)
    if (result.ok || result.error === 'already_applied') setApplied(true)
    setLoading(false)
  }

  if (applied) {
    return (
      <div className="flex-1 sm:flex-none sm:px-8 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full py-2">
        ✓ Applied
      </div>
    )
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="flex-1 sm:flex-none sm:px-8 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-60 text-white text-sm font-semibold rounded-full py-2 transition-colors"
    >
      {loading ? 'Applying…' : 'Easy Apply'}
    </button>
  )
}

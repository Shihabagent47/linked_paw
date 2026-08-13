'use client'

import { useState } from 'react'
import Link from 'next/link'

export type DbJob = {
  id: string
  title: string
  company: string
  location: string
  species_tag: string | null
  created_at: string
  applicant_count: number
}

const LOGO_COLORS = ['#0a66c2', '#e66c00', '#057642', '#7c3aed', '#b91c1c', '#0891b2', '#be185d', '#92400e']
function logoColor(c: string) {
  return LOGO_COLORS[[...c].reduce((a, ch) => a + ch.charCodeAt(0), 0) % LOGO_COLORS.length]
}
function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  if (d < 2592000) return `${Math.floor(d / 86400)}d ago`
  return `${Math.floor(d / 2592000)}mo ago`
}

function JobRow({ job, compact = false }: { job: DbJob; compact?: boolean }) {
  const color = logoColor(job.company)
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 hover:shadow-md transition-shadow ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex gap-3">
        <div className="shrink-0 w-12 h-12 rounded flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: color }}>
          {job.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.id}`} className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:underline hover:text-[#0a66c2] leading-tight line-clamp-2 block">
            {job.title}
          </Link>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">{job.company}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{job.location}</p>
          {!compact && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {job.species_tag && (
                <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-2 py-0.5 font-medium">
                  {job.species_tag}
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {timeAgo(job.created_at)} · {job.applicant_count.toLocaleString()} applicants
              </span>
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <div className="flex gap-2 mt-3">
          <Link href={`/jobs/${job.id}`} className="flex-1 text-center text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-full py-1.5 transition-colors">
            Easy Apply
          </Link>
        </div>
      )}
      {compact && (
        <Link href={`/jobs/${job.id}`} className="block mt-2 text-center text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          View job
        </Link>
      )}
    </div>
  )
}

export default function JobsClient({ jobs, isAlpha }: { jobs: DbJob[]; isAlpha: boolean }) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  const allSpecies = ['All', ...Array.from(new Set(jobs.map(j => j.species_tag).filter(Boolean))).sort()] as string[]

  const filtered = jobs.filter(job => {
    const matchesSpecies = filter === 'All' || job.species_tag === filter
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)
    return matchesSpecies && matchesQuery
  })

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">

        {/* Search bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 mb-4">
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 h-10 focus-within:border-[#0a66c2] transition-colors">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Job title or company..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 bg-transparent"
              />
            </div>
            {isAlpha && (
              <Link
                href="/jobs/new"
                className="h-10 px-5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-colors shrink-0 flex items-center gap-1.5"
              >
                ✨ Post a Job
              </Link>
            )}
          </div>
        </div>

        {/* Species filter chips */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {allSpecies.map(species => (
            <button
              key={species}
              onClick={() => setFilter(species)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filter === species
                  ? 'bg-[#0a66c2] text-white border-[#0a66c2]'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#0a66c2] hover:text-[#0a66c2]'
              }`}
            >
              {species}
            </button>
          ))}
        </div>

        <div className="flex gap-5 items-start">
          {/* Job list */}
          <div className="flex-1 min-w-0 space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-8 text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No jobs found.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">The prey has moved on. Try different filters.</p>
              </div>
            ) : (
              filtered.map(job => <JobRow key={job.id} job={job} />)
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-[280px] shrink-0 space-y-3 hidden lg:block">
            {jobs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Jobs you may like</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-3">Based on your profile</p>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map(job => <JobRow key={job.id} job={job} compact />)}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">By the numbers</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Open positions</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{jobs.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total applicants</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {jobs.reduce((s, j) => s + j.applicant_count, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {!isAlpha && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">✨ Alpha Paw</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">Post job listings and find your next hire from the herd.</p>
                <Link href="/upgrade" className="block text-center text-xs font-semibold text-amber-700 border border-amber-400 rounded-full py-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                  Upgrade
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

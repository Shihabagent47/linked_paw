import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/app/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ApplyButton from '@/app/components/ApplyButton'

const LOGO_COLORS = ['#0a66c2', '#e66c00', '#057642', '#7c3aed', '#b91c1c', '#0891b2', '#be185d', '#92400e']
function logoColor(c: string) {
  return LOGO_COLORS[[...c].reduce((a, ch) => a + ch.charCodeAt(0), 0) % LOGO_COLORS.length]
}
function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  if (d < 2592000) return `${Math.floor(d / 86400)}d ago`
  return `${Math.floor(d / 2592000)}mo ago`
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('jobs').select('title, company, description').eq('id', id).single()
  if (!data) return { title: 'Job Not Found — LinkedPaw' }
  return {
    title: `${data.title} at ${data.company} | LinkedPaw Jobs`,
    description: (data.description ?? '').slice(0, 155),
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select(`
      id, title, company, location, description, requirements, salary, species_tag, created_at,
      poster:profiles!posted_by(id, display_name, username, avatar_url, title, species),
      job_applications(count)
    `)
    .eq('id', id)
    .single()

  if (!job) notFound()

  const applicantCount = Array.isArray(job.job_applications)
    ? (job.job_applications[0] as { count: number })?.count ?? 0
    : 0

  const poster = Array.isArray(job.poster) ? job.poster[0] ?? null : job.poster

  // Check if current user already applied
  const { data: existingApp } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const hasApplied = !!existingApp

  // Similar jobs
  const { data: similar } = await supabase
    .from('jobs')
    .select('id, title, company, location')
    .eq('species_tag', job.species_tag ?? '')
    .neq('id', id)
    .limit(3)

  const color = logoColor(job.company)

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-4">

            {/* Job header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: color }}>
                  {job.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{job.title}</h1>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {job.species_tag && (
                      <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-2 py-0.5 font-medium">
                        {job.species_tag}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {timeAgo(job.created_at)} · {applicantCount.toLocaleString()} applicants
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <ApplyButton jobId={id} hasApplied={hasApplied} />
              </div>
            </div>

            {/* About the role */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">About the role</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#0a66c2]" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {job.salary && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-0.5">Compensation</p>
                  <p className="text-sm text-amber-900 dark:text-amber-300">{job.salary}</p>
                </div>
              )}
            </div>

            {/* Posted by */}
            {poster && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Posted by</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0 bg-gray-100 dark:bg-gray-700">
                    {poster.avatar_url ? (
                      <Image src={poster.avatar_url} alt={poster.display_name} fill className="object-cover" sizes="40px" />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-sm font-bold text-gray-500">{poster.display_name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${poster.id}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline block truncate">
                      {poster.display_name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{poster.title ?? poster.species}</p>
                  </div>
                  <Link href={`/profile/${poster.id}`} className="text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0">
                    View profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-[280px] shrink-0 space-y-3 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {(similar?.length ?? 0) > 0 ? 'Similar roles' : 'Other open roles'}
              </h2>
              <div className="space-y-3">
                {(similar ?? []).map(j => (
                  <div key={j.id} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <Link href={`/jobs/${j.id}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline line-clamp-2">{j.title}</Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{j.company}</p>
                  </div>
                ))}
              </div>
              <Link href="/jobs" className="block mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs font-semibold text-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                See all jobs →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Job details</p>
              <div className="space-y-2.5 text-xs">
                {job.species_tag && (
                  <div><p className="text-gray-400 dark:text-gray-500">Species</p><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{job.species_tag}</p></div>
                )}
                <div><p className="text-gray-400 dark:text-gray-500">Location</p><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{job.location}</p></div>
                <div><p className="text-gray-400 dark:text-gray-500">Applicants</p><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{applicantCount.toLocaleString()}</p></div>
                {job.salary && (
                  <div><p className="text-gray-400 dark:text-gray-500">Compensation</p><p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">{job.salary}</p></div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

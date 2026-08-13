import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth'
import ProfileActions from './ProfileActions'
import type { Profile, Skill, Experience, Education, ConnectionStatus } from '@/app/lib/types'

const BANNER_GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-emerald-400 to-green-600',
  'from-teal-400 to-cyan-600',
  'from-lime-400 to-green-500',
  'from-sky-400 to-blue-500',
  'from-stone-500 to-gray-700',
  'from-yellow-400 to-amber-500',
  'from-green-400 to-emerald-600',
]

function hashId(id: string) {
  let n = 0
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff
  return n
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { title: 'Profile — LinkedPaw' }
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('display_name, title, bio')
    .eq('id', id)
    .single()
  if (!data) return { title: 'Profile Not Found — LinkedPaw' }
  return {
    title: `${data.display_name} — ${data.title ?? 'LinkedPaw Member'} | LinkedPaw`,
    description: (data.bio ?? '').slice(0, 155) || `${data.display_name} on LinkedPaw`,
  }
}

function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (!experience.length) return null
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Experience</h2>
      <div className="space-y-5">
        {experience.map((job, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 flex items-center justify-center text-lg">
              🏢
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{job.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{job.company}</p>
              {job.period && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.period}</p>}
              {job.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{job.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationSection({ education }: { education: Education[] }) {
  if (!education.length) return null
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Education</h2>
      <div className="space-y-5">
        {education.map((edu, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 flex items-center justify-center text-lg">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{edu.school}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{edu.degree}</p>
              {edu.field && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.field}</p>}
              {edu.year && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{edu.year}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="bg-blue-50 dark:bg-blue-900/20 text-[#0a66c2] text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800"
          >
            {skill.name}
            {skill.endorsements > 0 && (
              <span className="ml-1.5 text-blue-400">· {skill.endorsements}</span>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 text-gray-400 text-sm">
        Supabase not configured — add env vars to .env.local
      </main>
    )
  }

  const [supabase, currentUser] = await Promise.all([createClient(), getCurrentUser()])

  const { data: raw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!raw) notFound()

  const isOwner = currentUser?.id === raw.id

  // Track view — non-blocking
  if (currentUser && !isOwner) {
    supabase.from('profile_views').insert({
      profile_id: raw.id,
      viewer_id: currentUser.id,
    }).then(() => {})
  }

  // Connections count
  const { count: connectionsCount } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .or(`requester_id.eq.${raw.id},receiver_id.eq.${raw.id}`)
    .eq('status', 'connected')

  // Connection status between current user and this profile
  let connectionStatus: ConnectionStatus = 'none'
  let connectionId: string | null = null
  if (currentUser && !isOwner) {
    const { data: conn } = await supabase
      .from('connections')
      .select('id, requester_id, status')
      .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${raw.id}),and(requester_id.eq.${raw.id},receiver_id.eq.${currentUser.id})`)
      .maybeSingle()
    if (conn) {
      connectionId = conn.id
      if (conn.status === 'connected') connectionStatus = 'connected'
      else if (conn.requester_id === currentUser.id) connectionStatus = 'pending_sent'
      else connectionStatus = 'pending_received'
    }
  }

  // Alpha-only weekly view count
  let weeklyViews: number | null = null
  if (isOwner && raw.is_alpha) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', raw.id)
      .gte('viewed_at', weekAgo)
    weeklyViews = count ?? 0
  }

  // Owner-only: job posts + applications
  let myJobs: { id: string; title: string; company: string; location: string; applicant_count: number; created_at: string }[] = []
  let myApplications: { id: string; created_at: string; job: { id: string; title: string; company: string; location: string } | null }[] = []
  if (isOwner) {
    const [{ data: jobsData }, { data: appsData }] = await Promise.all([
      supabase
        .from('jobs')
        .select('id, title, company, location, created_at, job_applications(count)')
        .eq('posted_by', raw.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('job_applications')
        .select('id, created_at, job:jobs(id, title, company, location)')
        .eq('user_id', raw.id)
        .order('created_at', { ascending: false }),
    ])
    myJobs = (jobsData ?? []).map(j => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      created_at: j.created_at,
      applicant_count: Array.isArray(j.job_applications) ? (j.job_applications[0] as { count: number })?.count ?? 0 : 0,
    }))
    myApplications = (appsData ?? []).map(a => ({
      id: a.id,
      created_at: a.created_at,
      job: Array.isArray(a.job) ? (a.job[0] ?? null) : a.job,
    }))
  }

  // Sidebar: other profiles
  const { data: others } = await supabase
    .from('profiles')
    .select('id, display_name, title, species, avatar_url')
    .neq('id', raw.id)
    .limit(4)

  const skills: Skill[] = raw.skills ?? []
  const experience: Experience[] = raw.experience ?? []
  const education: Education[] = raw.education ?? []
  const count = connectionsCount ?? 0

  const profile: Profile = {
    ...raw,
    skills,
    experience,
    education,
    connections_count: count,
  }

  const bannerClass = BANNER_GRADIENTS[hashId(profile.id) % BANNER_GRADIENTS.length]

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 overflow-hidden">
              {/* Banner */}
              <div className={`relative h-32 bg-gradient-to-r ${bannerClass}`}>
                {profile.banner_url && (
                  <Image src={profile.banner_url} alt="Banner" fill className="object-cover" />
                )}
              </div>

              {/* Avatar + actions */}
              <div className="px-5 pb-5">
                <div className="flex items-end justify-between -mt-12 mb-3">
                  <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shrink-0 shadow bg-gray-200 dark:bg-gray-700">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-3xl font-bold text-gray-500">
                        {profile.display_name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <ProfileActions
                    profile={profile}
                    isOwner={isOwner}
                    connectionStatus={connectionStatus}
                    connectionId={connectionId}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {profile.display_name}
                    </h1>
                    {profile.is_alpha && (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-2 py-0.5">
                        🐾 Alpha
                      </span>
                    )}
                  </div>
                  {profile.title && (
                    <p className="text-base text-gray-800 dark:text-gray-200 mt-0.5">{profile.title}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {[profile.company, profile.location].filter(Boolean).join(' · ')}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#0a66c2]">
                      {count >= 500 ? '500+' : count} connections
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium">
                      {profile.species}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alpha weekly views card */}
            {weeklyViews !== null && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 flex items-center gap-3">
                <span className="text-2xl">👁️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {weeklyViews} {weeklyViews === 1 ? 'animal' : 'animals'} viewed your profile this week
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Exclusive Alpha Paw insight</p>
                </div>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">About</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </section>
            )}

            <ExperienceSection experience={experience} />
            <EducationSection education={education} />
            <SkillsSection skills={skills} />

            {/* My Job Posts (owner + alpha only) */}
            {isOwner && profile.is_alpha && myJobs.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">My Job Posts</h2>
                  <Link href="/jobs/new" className="text-xs font-semibold text-[#0a66c2] hover:underline">+ Post new</Link>
                </div>
                <div className="space-y-3">
                  {myJobs.map(j => (
                    <Link key={j.id} href={`/jobs/${j.id}`} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{j.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{j.company} · {j.location}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-[#0a66c2] bg-blue-50 dark:bg-blue-900/20 rounded-full px-2.5 py-1">
                        {j.applicant_count} applicant{j.applicant_count !== 1 ? 's' : ''}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* My Applications (owner only) */}
            {isOwner && myApplications.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">My Applications</h2>
                <div className="space-y-3">
                  {myApplications.map(a => a.job && (
                    <Link key={a.id} href={`/jobs/${a.job.id}`} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{a.job.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.job.company} · {a.job.location}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full px-2.5 py-1">Applied</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 space-y-2">
            {others && others.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Animals also viewed
                </h2>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {others.map((p) => (
                    <Link
                      key={p.id}
                      href={`/profile/${p.id}`}
                      className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-1 px-1 rounded transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                        {p.avatar_url ? (
                          <Image src={p.avatar_url} alt={p.display_name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-sm font-bold text-gray-500">
                            {p.display_name[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate hover:underline text-gray-900 dark:text-gray-100">
                          {p.display_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                          {p.title ?? p.species}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Alpha upsell (own profile, not alpha) */}
            {isOwner && !profile.is_alpha && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">✨ Try Alpha Paw</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  See who&apos;s been sniffing your profile. Post jobs. Get the Alpha badge.
                </p>
                <Link
                  href="/upgrade"
                  className="mt-2 block text-center text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-400 dark:border-amber-600 rounded-full py-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  Upgrade — it&apos;s only a gazelle
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/auth'
import { createClient } from '@/lib/supabase/server'
import JobsClient from '@/app/components/JobsClient'
import type { DbJob } from '@/app/components/JobsClient'

export default async function JobsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('id, title, company, location, species_tag, created_at, job_applications(count)')
    .order('created_at', { ascending: false })

  const jobs: DbJob[] = (data ?? []).map(j => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    species_tag: j.species_tag,
    created_at: j.created_at,
    applicant_count: Array.isArray(j.job_applications) ? (j.job_applications[0] as { count: number })?.count ?? 0 : 0,
  }))

  return <JobsClient jobs={jobs} isAlpha={user.is_alpha ?? false} />
}

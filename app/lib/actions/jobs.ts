'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function applyToJob(jobId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('job_applications')
    .insert({ job_id: jobId, user_id: user.id })

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'already_applied' }
    return { ok: false, error: error.message }
  }

  // Notify the job poster (non-blocking)
  supabase.from('jobs').select('posted_by').eq('id', jobId).single().then(({ data: job }) => {
    if (job?.posted_by && job.posted_by !== user.id) {
      supabase.from('notifications').insert({
        user_id: job.posted_by, actor_id: user.id, type: 'job_application', entity_id: jobId,
      }).then(() => {})
    }
  })

  return { ok: true }
}

export async function postJob(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_alpha').eq('id', user.id).single()
  if (!profile?.is_alpha) redirect('/upgrade')

  const title = (formData.get('title') as string)?.trim()
  const company = (formData.get('company') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const requirementsRaw = (formData.get('requirements') as string) ?? ''
  const requirements = requirementsRaw.split('\n').map(r => r.trim()).filter(Boolean)
  const salary = (formData.get('salary') as string)?.trim() || null
  const species_tag = (formData.get('species_tag') as string)?.trim() || null

  if (!title || !company || !location || !description) return

  const { data, error } = await supabase
    .from('jobs')
    .insert({ posted_by: user.id, title, company, location, description, requirements, salary, species_tag })
    .select('id')
    .single()

  if (error || !data) return

  redirect(`/jobs/${data.id}`)
}

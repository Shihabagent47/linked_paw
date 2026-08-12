import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/auth'
import { createClient } from '@/lib/supabase/server'
import NotificationsClient from '@/app/components/NotificationsClient'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data } = await supabase
    .from('notifications')
    .select(`
      id, type, entity_id, read, created_at,
      actor:profiles!actor_id(id, display_name, username, avatar_url, species, is_alpha)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Supabase returns relations as arrays without generated types — normalize to singular
  const notifications = (data ?? []).map(n => ({
    ...n,
    actor: Array.isArray(n.actor) ? (n.actor[0] ?? null) : n.actor,
  }))

  return <NotificationsClient notifications={notifications} />
}

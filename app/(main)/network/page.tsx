import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth'
import NetworkClient from './NetworkClient'
import type { NetworkProfile, ConnectionStatus } from '@/app/lib/types'

export default async function NetworkPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 text-gray-400 text-sm">
        Supabase not configured
      </main>
    )
  }

  const supabase = await createClient()

  const [{ data: allProfiles }, { data: myConnections }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, username, title, avatar_url, species, location, is_alpha')
      .neq('id', user.id)
      .limit(100),
    supabase
      .from('connections')
      .select('id, requester_id, receiver_id, status')
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
  ])

  const connectionMap = new Map<string, { id: string; status: ConnectionStatus }>()
  for (const c of myConnections ?? []) {
    const otherId = c.requester_id === user.id ? c.receiver_id : c.requester_id
    let status: ConnectionStatus = 'none'
    if (c.status === 'connected') status = 'connected'
    else if (c.requester_id === user.id) status = 'pending_sent'
    else status = 'pending_received'
    connectionMap.set(otherId, { id: c.id, status })
  }

  const profiles: NetworkProfile[] = (allProfiles ?? []).map(p => {
    const conn = connectionMap.get(p.id)
    return {
      id: p.id,
      display_name: p.display_name,
      username: p.username,
      title: p.title,
      avatar_url: p.avatar_url,
      species: p.species,
      location: p.location,
      is_alpha: p.is_alpha,
      connection_status: conn?.status ?? 'none',
      connection_id: conn?.id ?? null,
    }
  })

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <NetworkClient
          initialProfiles={profiles}
          currentUserSpecies={user.species}
          isAlpha={user.is_alpha}
        />
      </div>
    </main>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiver_id } = await req.json()
  if (!receiver_id || receiver_id === user.id) {
    return NextResponse.json({ error: 'Invalid receiver' }, { status: 400 })
  }

  // Fetch requester profile for alpha check + cap
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_alpha')
    .eq('id', user.id)
    .single()

  if (!profile?.is_alpha) {
    const { count } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq('status', 'connected')
    if ((count ?? 0) >= 50) {
      return NextResponse.json({ error: 'Connection limit reached (50 for Cub accounts)' }, { status: 429 })
    }
  }

  const { data: conn, error } = await supabase
    .from('connections')
    .insert({ requester_id: user.id, receiver_id, status: 'pending' })
    .select('id, requester_id, receiver_id, status')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Connection already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Notify receiver (non-blocking)
  supabase.from('notifications').insert({
    user_id: receiver_id,
    actor_id: user.id,
    type: 'connection_request',
    entity_id: conn.id,
  }).then(() => {})

  return NextResponse.json(conn)
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ConnectionSchema } from '@/lib/validations'
import { rateLimit, getIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  if (!rateLimit(`connect:${getIp(req)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = ConnectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid receiver ID' }, { status: 400 })
  }
  const { receiver_id } = parsed.data

  if (receiver_id === user.id) {
    return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 })
  }

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

  supabase.from('notifications').insert({
    user_id: receiver_id,
    actor_id: user.id,
    type: 'connection_request',
    entity_id: conn.id,
  }).then(() => {})

  return NextResponse.json(conn)
}

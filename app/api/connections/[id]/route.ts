import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json() // 'accept' | 'decline'

  const { data: conn } = await supabase
    .from('connections')
    .select('id, requester_id, receiver_id, status')
    .eq('id', id)
    .single()

  if (!conn) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (conn.receiver_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (conn.status !== 'pending') return NextResponse.json({ error: 'Not pending' }, { status: 400 })

  if (action === 'decline') {
    await supabase.from('connections').delete().eq('id', id)
    return NextResponse.json({ ok: true, status: 'declined' })
  }

  if (action === 'accept') {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'connected' })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notify requester (non-blocking)
    supabase.from('notifications').insert({
      user_id: conn.requester_id,
      actor_id: user.id,
      type: 'connection_accepted',
      entity_id: conn.id,
    }).then(() => {})

    return NextResponse.json({ ok: true, status: 'connected' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: conn } = await supabase
    .from('connections')
    .select('requester_id, receiver_id')
    .eq('id', id)
    .single()

  if (!conn) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Only requester can withdraw; either party can remove a connected relationship
  const isMember = conn.requester_id === user.id || conn.receiver_id === user.id
  if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await supabase.from('connections').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}

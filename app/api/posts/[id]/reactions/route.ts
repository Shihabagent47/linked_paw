import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id: post_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await req.json()
  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 })

  const { error } = await supabase
    .from('reactions')
    .upsert({ post_id, user_id: user.id, type }, { onConflict: 'post_id,user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify post author (non-blocking, skip own posts)
  supabase.from('posts').select('author_id').eq('id', post_id).single().then(({ data: post }) => {
    if (post && post.author_id !== user.id) {
      supabase.from('notifications').insert({
        user_id: post.author_id, actor_id: user.id, type: 'reaction', entity_id: post_id,
      }).then(() => {})
    }
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id: post_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('post_id', post_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

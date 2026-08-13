import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CommentSchema } from '@/lib/validations'
import { rateLimit, getIp } from '@/lib/rate-limit'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { id: post_id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('comments')
    .select(`id, post_id, author_id, content, created_at,
      author:profiles!author_id(id, display_name, username, avatar_url, species, is_alpha, title)`)
    .eq('post_id', post_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(`comment:${getIp(req)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { id: post_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = CommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id, author_id: user.id, content: parsed.data.content })
    .select(`id, post_id, author_id, content, created_at,
      author:profiles!author_id(id, display_name, username, avatar_url, species, is_alpha, title)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  supabase.from('posts').select('author_id').eq('id', post_id).single().then(({ data: post }) => {
    if (post && post.author_id !== user.id) {
      supabase.from('notifications').insert({
        user_id: post.author_id, actor_id: user.id, type: 'comment', entity_id: post_id,
      }).then(() => {})
    }
  })

  return NextResponse.json(data)
}

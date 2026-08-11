import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  const { id: post_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id, author_id: user.id, content: content.trim() })
    .select(`id, post_id, author_id, content, created_at,
      author:profiles!author_id(id, display_name, username, avatar_url, species, is_alpha, title)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

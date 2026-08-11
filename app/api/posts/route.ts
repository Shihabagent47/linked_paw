import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_alpha')
    .eq('id', user.id)
    .single()

  if (!profile?.is_alpha) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id)
      .gte('created_at', today.toISOString())
    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: 'Daily post limit reached (5/day for Cub accounts)' }, { status: 429 })
    }
  }

  const formData = await req.formData()
  const content = formData.get('content') as string
  const imageFile = formData.get('image') as File | null

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  let image_url: string | null = null
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, imageFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path)
      image_url = publicUrl
    }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({ author_id: user.id, content: content.trim(), image_url })
    .select(`id, author_id, content, image_url, view_count, created_at,
      author:profiles!author_id(id, display_name, username, title, avatar_url, species, is_alpha)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(post)
}

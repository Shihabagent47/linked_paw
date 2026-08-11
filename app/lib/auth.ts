import { cache } from 'react'
import type { CurrentUser } from '@/app/lib/types'

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return null

  return {
    ...profile,
    email: user.email ?? '',
    subscription: null,
  }
})

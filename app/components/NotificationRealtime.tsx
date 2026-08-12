'use client'

import { useEffect, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Toast = { id: string; message: string }

const TYPE_VERB: Record<string, string> = {
  connection_request: 'wants to join your herd',
  connection_accepted: 'accepted your connection',
  reaction: 'reacted to your post',
  comment: 'commented on your post',
  job_application: 'applied to your job listing',
  profile_view: 'viewed your profile',
}

export default function NotificationRealtime({ userId }: { userId: string }) {
  const router = useRouter()
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`notif:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, async (payload) => {
        const notif = payload.new as { type: string; actor_id: string | null }
        const verb = TYPE_VERB[notif.type] ?? 'sent you a notification'
        let message = `🐾 ${verb}`

        if (notif.actor_id) {
          const { data: actor } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', notif.actor_id)
            .single()
          if (actor) message = `🐾 ${actor.display_name} ${verb}`
        }

        addToast(message)
        router.refresh()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, addToast, router])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 max-w-xs"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

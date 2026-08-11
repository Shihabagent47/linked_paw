'use client'

import { useState } from 'react'
import EditProfileModal from './EditProfileModal'
import type { Profile } from '@/app/lib/types'

export default function ProfileActions({ profile, isOwner }: { profile: Profile; isOwner: boolean }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2 pb-1">
        {isOwner ? (
          <button
            onClick={() => setEditOpen(true)}
            className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Edit profile
          </button>
        ) : (
          <>
            <button className="text-sm font-semibold bg-[#0a66c2] text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors">
              Connect
            </button>
            <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Message
            </button>
          </>
        )}
      </div>
      {editOpen && <EditProfileModal profile={profile} onClose={() => setEditOpen(false)} />}
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const SPECIES = [
  'Lion', 'Falcon', 'Elephant', 'Sloth', 'Octopus',
  'Chameleon', 'Seagull', 'Mole', 'Tortoise', 'Mantis Shrimp', 'Other',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [species, setSpecies] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!displayName.trim() || !username.trim() || !species) {
      setError('Display name, username, and species are required.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    let avatarUrl: string | null = null

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError(`Avatar upload failed: ${uploadError.message}`)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      avatarUrl = publicUrl
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      username: username.trim().toLowerCase(),
      display_name: displayName.trim(),
      species,
      title: title.trim() || null,
      location: location.trim() || null,
      avatar_url: avatarUrl,
      is_alpha: false,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('That username is already taken. Pick another one.')
      } else {
        setError(insertError.message)
      }
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#e0dfdc] dark:border-gray-700 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Set up your profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tell the savanna who you are</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shrink-0">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl">🐾</div>
              )}
            </div>
            <div>
              <label className="cursor-pointer text-sm font-semibold text-[#0a66c2] hover:underline">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Optional · JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Leonard Mane"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_-]/gi, '').toLowerCase())}
                required
                placeholder="leonardmane"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Species <span className="text-red-500">*</span>
            </label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
            >
              <option value="">Select your species…</option>
              {SPECIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chief Napping Officer @ Savanna Dynamics"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Savanna, Africa"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a66c2] hover:bg-[#0856ab] disabled:opacity-60 text-white rounded-full py-2.5 text-sm font-semibold transition-colors"
          >
            {loading ? 'Joining the pride...' : 'Join the pride'}
          </button>
        </form>
      </div>
    </div>
  )
}

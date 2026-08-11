'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Skill, Experience, Education } from '@/app/lib/types'

const SPECIES = [
  'Lion', 'Falcon', 'Elephant', 'Sloth', 'Octopus',
  'Chameleon', 'Seagull', 'Mole', 'Tortoise', 'Mantis Shrimp', 'Other',
]

type Props = {
  profile: Profile
  onClose: () => void
}

export default function EditProfileModal({ profile, onClose }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // Basic fields
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [species, setSpecies] = useState(profile.species)
  const [title, setTitle] = useState(profile.title ?? '')
  const [company, setCompany] = useState(profile.company ?? '')
  const [location, setLocation] = useState(profile.location ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')

  // Avatar / banner
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner_url)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Skills
  const [skills, setSkills] = useState<Skill[]>(profile.skills ?? [])
  const [newSkill, setNewSkill] = useState('')

  // Experience
  const [experience, setExperience] = useState<Experience[]>(profile.experience ?? [])
  const [newExp, setNewExp] = useState<Partial<Experience>>({})
  const [addingExp, setAddingExp] = useState(false)

  // Education
  const [education, setEducation] = useState<Education[]>(profile.education ?? [])
  const [newEdu, setNewEdu] = useState<Partial<Education>>({})
  const [addingEdu, setAddingEdu] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  function addSkill() {
    const name = newSkill.trim()
    if (!name || skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return
    setSkills((prev) => [...prev, { name, endorsements: 0 }])
    setNewSkill('')
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((s) => s.name !== name))
  }

  function addExperience() {
    if (!newExp.title || !newExp.company) return
    setExperience((prev) => [
      ...prev,
      {
        title: newExp.title!,
        company: newExp.company!,
        period: newExp.period ?? '',
        description: newExp.description ?? '',
      },
    ])
    setNewExp({})
    setAddingExp(false)
  }

  function addEducation() {
    if (!newEdu.school || !newEdu.degree) return
    setEducation((prev) => [
      ...prev,
      {
        school: newEdu.school!,
        degree: newEdu.degree!,
        field: newEdu.field ?? '',
        year: newEdu.year ?? '',
      },
    ])
    setNewEdu({})
    setAddingEdu(false)
  }

  async function handleSave() {
    if (!displayName.trim()) {
      setError('Display name is required.')
      return
    }
    setSaving(true)
    setError(null)

    let avatarUrl = profile.avatar_url
    let bannerUrl = profile.banner_url

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${profile.id}/avatar.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })
      if (uploadErr) { setError(uploadErr.message); setSaving(false); return }
      avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    }

    if (bannerFile) {
      const ext = bannerFile.name.split('.').pop()
      const path = `${profile.id}/banner.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('banners')
        .upload(path, bannerFile, { upsert: true })
      if (uploadErr) { setError(uploadErr.message); setSaving(false); return }
      bannerUrl = supabase.storage.from('banners').getPublicUrl(path).data.publicUrl
    }

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        species,
        title: title.trim() || null,
        company: company.trim() || null,
        location: location.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        skills,
        experience,
        education,
      })
      .eq('id', profile.id)

    if (updateErr) {
      setError(updateErr.message)
      setSaving(false)
      return
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Banner */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banner</p>
            <div
              className="relative h-28 rounded-lg overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 cursor-pointer group"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerPreview && (
                <Image src={bannerPreview} alt="Banner" fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-sm font-semibold">Change banner</span>
              </div>
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 cursor-pointer group shrink-0"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl">
                  {displayName[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                <span className="text-white text-xs font-semibold">Edit</span>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Profile photo</p>
              <p className="text-xs text-gray-400 mt-0.5">Click to upload · JPG or PNG</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display name <span className="text-red-500">*</span>
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              >
                {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Savanna, Africa"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chief Napping Officer"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Savanna Dynamics"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell the savanna about yourself..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((s) => (
                <span
                  key={s.name}
                  className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#0a66c2] text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700"
                >
                  {s.name}
                  <button
                    onClick={() => removeSkill(s.name)}
                    className="text-blue-400 hover:text-red-500 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill…"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
              />
              <button
                onClick={addSkill}
                className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-lg px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</p>
              <button
                onClick={() => setAddingExp(true)}
                className="text-xs font-semibold text-[#0a66c2] hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i} className="flex gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exp.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{exp.company} · {exp.period}</p>
                  </div>
                  <button
                    onClick={() => setExperience((prev) => prev.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
              {addingExp && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Job title *"
                      value={newExp.title ?? ''}
                      onChange={(e) => setNewExp((p) => ({ ...p, title: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Company *"
                      value={newExp.company ?? ''}
                      onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Period (e.g. 2020–Present)"
                      value={newExp.period ?? ''}
                      onChange={(e) => setNewExp((p) => ({ ...p, period: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Description"
                      value={newExp.description ?? ''}
                      onChange={(e) => setNewExp((p) => ({ ...p, description: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addExperience} className="text-xs font-semibold bg-[#0a66c2] text-white rounded px-3 py-1.5 hover:bg-blue-700 transition-colors">
                      Save
                    </button>
                    <button onClick={() => { setAddingExp(false); setNewExp({}) }} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Education</p>
              <button
                onClick={() => setAddingEdu(true)}
                className="text-xs font-semibold text-[#0a66c2] hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{edu.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{edu.degree} · {edu.field} · {edu.year}</p>
                  </div>
                  <button
                    onClick={() => setEducation((prev) => prev.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
              {addingEdu && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="School *"
                      value={newEdu.school ?? ''}
                      onChange={(e) => setNewEdu((p) => ({ ...p, school: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Degree *"
                      value={newEdu.degree ?? ''}
                      onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Field of study"
                      value={newEdu.field ?? ''}
                      onChange={(e) => setNewEdu((p) => ({ ...p, field: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                    <input
                      placeholder="Year (e.g. 2018)"
                      value={newEdu.year ?? ''}
                      onChange={(e) => setNewEdu((p) => ({ ...p, year: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addEducation} className="text-xs font-semibold bg-[#0a66c2] text-white rounded px-3 py-1.5 hover:bg-blue-700 transition-colors">
                      Save
                    </button>
                    <button onClick={() => { setAddingEdu(false); setNewEdu({}) }} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full px-5 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-semibold bg-[#0a66c2] hover:bg-[#0856ab] disabled:opacity-60 text-white rounded-full px-5 py-2 transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useTransition } from 'react'
import { postJob } from '@/app/lib/actions/jobs'

const SPECIES = ['Lion', 'Peregrine Falcon', 'Sloth', 'Meerkat', 'Dolphin', 'Elephant', 'Octopus', 'Chameleon', 'Penguin', 'Wolf', 'Other']

export default function PostJobForm() {
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => { await postJob(formData) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Job Title *</label>
          <input name="title" required placeholder="e.g. Chief Prey Officer" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Company *</label>
          <input name="company" required placeholder="e.g. Savanna Dynamics LLC" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Location *</label>
          <input name="location" required placeholder="e.g. Serengeti, Tanzania" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Species Tag</label>
          <select name="species_tag" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#0a66c2]">
            <option value="">Any species</option>
            {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
        <textarea name="description" required rows={5} placeholder="Describe the role, culture, and why any self-respecting animal would want to work here..." className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2] resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Requirements</label>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">One per line</p>
        <textarea name="requirements" rows={4} placeholder="5+ years hunting experience&#10;Comfortable with open-plan environments (the savanna)&#10;Sprint speed of 80km/h minimum" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2] resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Compensation</label>
        <input name="salary" placeholder="e.g. 340kg wildebeest/month + territory equity" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0a66c2]" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-8 py-2.5 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-60 text-white font-semibold text-sm rounded-full transition-colors"
      >
        {pending ? 'Posting…' : 'Post Job'}
      </button>
    </form>
  )
}

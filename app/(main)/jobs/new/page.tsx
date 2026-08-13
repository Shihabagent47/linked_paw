import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/app/lib/auth'
import PostJobForm from '@/app/components/PostJobForm'

export const metadata = { title: 'Post a Job — LinkedPaw' }

export default async function PostJobPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.is_alpha) redirect('/upgrade')

  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/jobs" className="text-xs text-gray-500 dark:text-gray-400 hover:underline">← Back to jobs</Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">Post a Job</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the den details. Only Alpha Paw members can post listings.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-6">
          <PostJobForm />
        </div>
      </div>
    </main>
  )
}

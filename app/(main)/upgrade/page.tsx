import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCurrentUser } from '@/app/lib/auth'
import UpgradeButtons from '@/app/components/UpgradeButtons'

export const metadata: Metadata = { title: 'Upgrade to Alpha Paw — LinkedPaw' }

const FEATURES = [
  { label: 'Profile + avatar/banner upload', cub: '✓', alpha: '✓' },
  { label: 'Post to feed', cub: '5/day', alpha: 'Unlimited' },
  { label: 'React & comment', cub: '✓', alpha: '✓' },
  { label: 'Connect with others', cub: '50 cap', alpha: 'Unlimited' },
  { label: 'Browse job listings', cub: '✓', alpha: '✓' },
  { label: 'Apply to jobs', cub: '✓', alpha: '✓' },
  { label: 'Post a job listing', cub: '—', alpha: '✓' },
  { label: 'See who viewed your profile', cub: '—', alpha: '✓' },
  { label: 'Post analytics (views, reach)', cub: '—', alpha: '✓' },
  { label: 'Alpha badge on profile', cub: '—', alpha: '✓' },
  { label: 'Boosted placement in search', cub: '—', alpha: '✓' },
]

type Props = { searchParams: Promise<{ success?: string; canceled?: string }> }

export default async function UpgradePage({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { success, canceled } = await searchParams

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300 text-sm font-medium">
            🐾 Welcome to Alpha Paw! Your upgrade is active — go claim your territory.
          </div>
        )}
        {canceled && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-sm font-medium">
            No worries — your Cub account is still waiting at the watering hole.
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">Run the Pride</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Unlock every feature. No paw prints held back.</p>
        </div>

        {user.is_alpha ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-400 dark:border-amber-500 shadow-sm p-8 text-center">
            <div className="text-5xl mb-3">🐾⭐</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">You&apos;re Alpha Paw</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
              All features unlocked. You&apos;re running the pride.
              {user.subscription?.current_period_end && (
                <span className="block mt-1">
                  Renews {new Date(user.subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </p>
            <UpgradeButtons isAlpha={true} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Cub */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cub</h2>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-2">
                  $0<span className="text-base font-medium text-gray-400">/mo</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-5">Sniff around the savannah</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium py-2.5 px-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                  Your current plan
                </div>
              </div>

              {/* Alpha Paw */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-400 dark:border-amber-500 p-6 relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Alpha Paw ⭐</h2>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-2">
                  $8<span className="text-base font-medium text-gray-400">/mo</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-5">Run the pride · or $72/yr (save 25%)</p>
                <UpgradeButtons isAlpha={false} />
              </div>
            </div>

            {/* Feature comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Feature</th>
                    <th className="px-5 py-3 text-gray-500 dark:text-gray-400 font-medium text-center">Cub</th>
                    <th className="px-5 py-3 text-amber-600 dark:text-amber-400 font-semibold text-center">Alpha Paw ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f) => (
                    <tr key={f.label} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{f.label}</td>
                      <td className="px-5 py-3 text-center text-gray-400 dark:text-gray-500">{f.cub}</td>
                      <td className="px-5 py-3 text-center font-medium text-gray-800 dark:text-gray-200">{f.alpha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

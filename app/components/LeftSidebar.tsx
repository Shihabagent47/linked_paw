import Image from 'next/image'
import Link from 'next/link'
import { getCurrentUser } from '@/app/lib/auth'

export default async function LeftSidebar() {
  const user = await getCurrentUser()

  return (
    <aside className="w-[225px] shrink-0 space-y-2">
      {/* Mini profile card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-amber-400 to-orange-500" />
        <div className="px-4 -mt-8 pb-4">
          <div className="relative w-14 h-14 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
            {user?.avatar_url ? (
              <Image src={user.avatar_url} alt={user.display_name} fill className="object-cover" sizes="56px" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-600 dark:text-gray-300">
                {user?.display_name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Link
              href={user ? `/profile/${user.id}` : '/login'}
              className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:underline block leading-snug"
            >
              {user?.display_name ?? 'Loading...'}
            </Link>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">{user?.title ?? user?.species ?? ''}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">Connections</span>
              <span className="text-[#0a66c2] font-semibold">{(user?.connections_count ?? 0).toLocaleString()}</span>
            </div>
          </div>
          <Link
            href={user ? `/profile/${user.id}` : '/login'}
            className="mt-3 block text-center text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            View full profile
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-3">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent activity</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
          &quot;Excited to share I&apos;ve been asked to lead the Q3 strategic napping initiative. Humbled and grateful.&quot;
        </p>
        <Link href="#" className="text-xs text-[#0a66c2] mt-2 block hover:underline">
          See all activity →
        </Link>
      </div>

      {/* PawPremium upsell */}
      {!user?.is_alpha && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-3">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">✨ Try PawPremium</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            See who&apos;s been sniffing your profile. Unlock exclusive watering hole access.
          </p>
          <button className="mt-2 w-full text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-400 dark:border-amber-600 rounded-full py-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
            Upgrade — it&apos;s only a gazelle
          </button>
        </div>
      )}
    </aside>
  )
}

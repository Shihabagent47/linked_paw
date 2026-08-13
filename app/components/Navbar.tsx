'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from '@/app/components/ThemeToggle'
import type { CurrentUser } from '@/app/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function NavItem({ href, label, badge, children }: { href: string; label: string; badge?: number; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 px-3 h-full border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors min-w-[72px]"
    >
      <div className="relative">
        {children}
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  )
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 18.4 3 18.4z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function Navbar({ user, pendingCount = 0, unreadNotifCount = 0 }: { user: CurrentUser | null; pendingCount?: number; unreadNotifCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function handlePortal() {
    setMenuOpen(false)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json() as { url?: string }
    if (data.url) window.location.href = data.url
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-[#e0dfdc] dark:border-gray-700 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-xl font-black text-[#0a66c2] shrink-0 tracking-tight">
          🐾 LinkedPaw
        </Link>

        <div className="flex items-center bg-[#eef3f8] dark:bg-gray-800 rounded-md px-3 h-9 gap-2 flex-1 max-w-xs sm:flex-none sm:w-64">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search animals, jobs, or carrion..."
            className="bg-transparent text-sm outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex-1" />

        <ThemeToggle />

        <nav className="hidden md:flex items-stretch h-14">
          <NavItem href="/" label="Home">
            <HomeIcon />
          </NavItem>
          <NavItem href="/network" label="My Herd" badge={pendingCount}>
            <UsersIcon />
          </NavItem>
          <NavItem href="/jobs" label="Jobs">
            <BriefcaseIcon />
          </NavItem>
          <NavItem href="/notifications" label="Alerts" badge={unreadNotifCount}>
            <BellIcon />
          </NavItem>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-colors min-w-[72px]"
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.display_name} fill className="object-cover" sizes="24px" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-600 dark:text-gray-300">
                      {user.display_name[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs">Me ▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.display_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.title ?? user.species}</p>
                  </div>
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    View profile
                  </Link>
                  {user.is_alpha && (
                    <button
                      onClick={handlePortal}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Manage subscription
                    </button>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

          <div className="w-px bg-gray-200 dark:bg-gray-700 my-3 mx-1" />

          <Link
            href="/upgrade"
            className="flex flex-col items-center justify-center gap-0.5 px-3 border-b-2 border-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            <span className="text-base leading-none">✨</span>
            <span className="text-xs text-amber-600 font-semibold whitespace-nowrap">PawPremium</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

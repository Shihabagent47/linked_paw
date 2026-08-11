import Navbar from '@/app/components/Navbar'
import MobileNav from '@/app/components/MobileNav'
import { getCurrentUser } from '@/app/lib/auth'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col min-h-screen pb-14 md:pb-0">
      <Navbar user={user} />
      {children}
      <footer className="mt-auto py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">🐾 LinkedPaw</span>
          <a href="/about" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">About</a>
          <a href="#" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">Accessibility</a>
          <a href="#" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">Help Centre (Watering Hole)</a>
          <a href="#" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">Privacy & Territory Terms</a>
          <a href="#" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">Cookie Policy</a>
          <a href="#" className="hover:underline hover:text-gray-800 dark:hover:text-gray-200">Advertise to Prey</a>
          <span className="ml-auto">LinkedPaw Corporation © 2025</span>
        </div>
      </footer>
      <MobileNav />
    </div>
  )
}

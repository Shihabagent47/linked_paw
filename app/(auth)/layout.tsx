import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2ef] dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-[#e0dfdc] dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-xl font-black text-[#0a66c2] tracking-tight">
            🐾 LinkedPaw
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}

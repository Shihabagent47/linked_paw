import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <div className="text-center max-w-md px-4">
        <p className="text-7xl mb-6">🐾</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          This animal has left the pride.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          The profile you&apos;re looking for has migrated to greener pastures — or possibly been eaten.
          Either way, we can&apos;t find it.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#0a66c2] text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-[#004182] transition-colors"
          >
            Return to the savanna
          </Link>
          <Link
            href="/network"
            className="border border-[#0a66c2] text-[#0a66c2] text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Browse animals
          </Link>
        </div>
      </div>
    </main>
  );
}

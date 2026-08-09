function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 space-y-3 animate-pulse">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-7 bg-gray-100 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <aside className="w-[225px] shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 animate-pulse overflow-hidden">
              <div className="h-16 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-3 animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>

          <aside className="w-[300px] shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

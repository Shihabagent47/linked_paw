function SkeletonConnectionCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-14 bg-gray-200 dark:bg-gray-700" />
      <div className="px-3 -mt-7 pb-3">
        <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 mb-2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="h-7 bg-gray-100 dark:bg-gray-700 rounded-full mt-3" />
      </div>
    </div>
  );
}

export default function NetworkLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 mb-4 animate-pulse">
          <div className="flex justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            </div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-64" />
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonConnectionCard key={i} />)}
            </div>
          </div>
          <aside className="w-[240px] shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

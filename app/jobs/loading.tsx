function SkeletonJobCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-16 h-7 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

export default function JobsLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 mb-4 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <SkeletonJobCard key={i} />)}
          </div>
          <aside className="w-[280px] shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
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

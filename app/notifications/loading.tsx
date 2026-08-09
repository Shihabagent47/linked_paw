function SkeletonRow() {
  return (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  );
}

export default function NotificationsLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 flex mb-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 h-10 border-b-2 border-transparent" />
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonRow key={i} />)}
        </div>
      </div>
    </main>
  );
}

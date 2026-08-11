import Image from 'next/image';
import LeftSidebar from '@/app/components/LeftSidebar';
import RightSidebar from '@/app/components/RightSidebar';
import { getCurrentUser } from '@/app/lib/auth';
import PostCard from "@/app/components/PostCard";
import {posts} from "@/app/data/post";

const COMPOSER_ACTIONS = [
  { emoji: '📸', label: 'Photo' },
  { emoji: '📝', label: 'Article' },
  { emoji: '🦴', label: 'Cringe Post' },
  { emoji: '📊', label: 'Metrics' },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>

          {/* Center: Feed */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Post composer */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-3">
              <div className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                  {user?.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.display_name} fill className="object-cover" sizes="48px" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 dark:text-gray-300">
                      {user?.display_name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  )}
                </div>
                <button className="flex-1 text-left text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  Share your latest hunt, {user?.display_name?.split(' ')[0] ?? 'friend'}...
                </button>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                {COMPOSER_ACTIONS.map(({ emoji, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>{emoji}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between px-1">
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
              <button className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1 px-3 hover:text-black dark:hover:text-white transition-colors shrink-0">
                Sort: Top posts ▾
              </button>
            </div>

            {/* Feed */}
            {[...posts].reverse().map(post => (
                <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}

import Image from 'next/image';
import LeftSidebar from '@/app/components/LeftSidebar';
import RightSidebar from '@/app/components/RightSidebar';
import { ME } from '@/app/lib/constants';

const COMPOSER_ACTIONS = [
  { emoji: '📸', label: 'Photo' },
  { emoji: '📝', label: 'Article' },
  { emoji: '🦴', label: 'Cringe Post' },
  { emoji: '📊', label: 'Metrics' },
];

export default function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <LeftSidebar />

          {/* Center: Feed */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Post composer */}
            <div className="bg-white rounded-lg border border-[#e0dfdc] p-3">
              <div className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <Image src={ME.photo} alt={ME.name} fill className="object-cover" sizes="48px" />
                </div>
                <button className="flex-1 text-left text-sm text-gray-500 border border-gray-300 rounded-full px-4 py-2.5 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                  Share your latest hunt, {ME.name.split(' ')[0]}...
                </button>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                {COMPOSER_ACTIONS.map(({ emoji, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between px-1">
              <div className="h-px flex-1 bg-gray-300" />
              <button className="text-xs font-semibold text-gray-600 flex items-center gap-1 px-3 hover:text-black transition-colors shrink-0">
                Sort: Top posts ▾
              </button>
            </div>

            {/* Feed placeholder */}
            <div className="bg-white rounded-lg border border-[#e0dfdc] p-12 text-center">
              <p className="text-5xl mb-4">🐾</p>
              <p className="text-sm font-semibold text-gray-700">
                The pack is still writing their thought leadership content.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                The feed awakens in Phase 3. Strategic patience is a skill.
              </p>
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </main>
  );
}

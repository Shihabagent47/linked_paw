import Image from 'next/image';
import Link from 'next/link';
import { ME } from '@/app/lib/constants';

export default function LeftSidebar() {
  return (
    <aside className="w-[225px] shrink-0 space-y-2">
      {/* Mini profile card */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-amber-400 to-orange-500" />
        <div className="px-4 -mt-8 pb-4">
          <div className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden">
            <Image src={ME.photo} alt={ME.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="mt-2">
            <Link href={`/profile/${ME.id}`} className="font-semibold text-sm text-gray-500 hover:underline block leading-snug">
              {ME.name}
            </Link>
            <p className="text-xs text-gray-600 mt-0.5 leading-snug">{ME.title}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Connections</span>
              <span className="text-[#0a66c2] font-semibold">{ME.connections.toLocaleString()}</span>
            </div>
          </div>
          <Link
            href={`/profile/${ME.id}`}
            className="mt-3 block text-center text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1 hover:bg-blue-50 transition-colors"
          >
            View full profile
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">Recent activity</p>
        <p className="text-xs text-gray-500 italic leading-relaxed">
          &quot;Excited to share I&apos;ve been asked to lead the Q3 strategic napping initiative. Humbled and grateful.&quot;
        </p>
        <Link href="#" className="text-xs text-[#0a66c2] mt-2 block hover:underline">
          See all activity →
        </Link>
      </div>

      {/* PawPremium upsell */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">✨ Try PawPremium</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          See who&apos;s been sniffing your profile. Unlock exclusive watering hole access.
        </p>
        <button className="mt-2 w-full text-xs font-semibold text-amber-700 border border-amber-400 rounded-full py-1 hover:bg-amber-50 transition-colors">
          Upgrade — it&apos;s only a gazelle
        </button>
      </div>
    </aside>
  );
}

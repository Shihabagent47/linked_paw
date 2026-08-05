import Image from 'next/image';
import { animals } from '@/app/data/animals';
import { ME } from '@/app/lib/constants';

const NEWS = [
  { headline: 'Migration Season Disrupts Remote Work Arrangements', time: '2h ago' },
  { headline: 'Watering Hole Startup Raises $4M Seed Round, Promises Disruption', time: '4h ago' },
  { headline: "Is 'Strategic Stillness' Just Napping? Experts Weigh In", time: '6h ago' },
];

export default function RightSidebar() {
  const suggestions = animals.filter((a) => a.id !== ME.id);

  return (
    <aside className="w-[300px] shrink-0 space-y-2">
      {/* People you may know */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
        <h2 className="text-sm font-semibold text-gray-900">Animals you may know</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-3">From your territory</p>

        <div className="divide-y divide-gray-100">
          {suggestions.map((animal) => (
            <div key={animal.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <Image src={animal.photo} alt={animal.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{animal.name}</p>
                <p className="text-xs text-gray-500 leading-snug truncate">{animal.title}</p>
                <p className="text-xs text-gray-400 truncate">{animal.species}</p>
                <button className="mt-1.5 text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-3 py-0.5 hover:bg-blue-50 transition-colors">
                  + Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-3 pt-3 border-t border-gray-100 w-full text-xs font-semibold text-gray-500 hover:text-black transition-colors text-center">
          Show all suggestions →
        </button>
      </div>

      {/* Savanna News */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Savanna News</h2>
        <div className="space-y-3">
          {NEWS.map((item) => (
            <div key={item.headline}>
              <p className="text-xs font-semibold text-gray-800 leading-snug hover:underline cursor-pointer">
                {item.headline}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.time} · Top story</p>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs text-gray-500 hover:text-black hover:underline transition-colors">
          Show more →
        </button>
      </div>
    </aside>
  );
}

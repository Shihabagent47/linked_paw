import Image from 'next/image';
import Link from 'next/link';
import { Animal } from '@/app/data/animals';

export type ConnectionStatus = 'none' | 'pending' | 'connected';

const BANNERS = [
    'from-amber-400 to-orange-500',
    'from-blue-400 to-indigo-600',
    'from-green-400 to-teal-600',
    'from-purple-400 to-pink-600',
    'from-rose-400 to-red-600',
    'from-cyan-400 to-blue-600',
    'from-yellow-400 to-amber-600',
    'from-emerald-400 to-green-600',
    'from-violet-400 to-purple-600',
    'from-sky-400 to-cyan-600',
];

function mutualCount(id: number): number {
    return (id * 3 + 1) % 6 + 1;
}

type Props = {
    animal: Animal;
    status: ConnectionStatus;
    onConnect: () => void;
};

export default function ConnectionCard({ animal, status, onConnect }: Props) {
    const banner = BANNERS[animal.id % BANNERS.length];

    return (
        <div className="bg-white rounded-lg border border-[#e0dfdc] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* Banner */}
            <div className={`h-14 bg-gradient-to-r ${banner}`} />

            {/* Avatar (overlaps banner) */}
            <div className="px-3 -mt-7 pb-3 flex flex-col flex-1">
                <div className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden mb-2 bg-white">
                    <Image src={animal.photo} alt={animal.name} fill className="object-cover" sizes="56px" />
                </div>

                <Link
                    href={`/profile/${animal.id}`}
                    className="text-sm font-semibold text-gray-900 hover:underline leading-tight line-clamp-1"
                >
                    {animal.name}
                </Link>
                <p className="text-xs text-gray-500 leading-snug mt-0.5 line-clamp-2">{animal.title}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{animal.location}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    <span className="text-[#0a66c2] font-medium">{mutualCount(animal.id)}</span> mutual connections
                </p>

                <div className="mt-auto pt-3">
                    {status === 'none' && (
                        <button
                            onClick={onConnect}
                            className="w-full text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1.5 hover:bg-blue-50 transition-colors"
                        >
                            + Connect
                        </button>
                    )}
                    {status === 'pending' && (
                        <button
                            onClick={onConnect}
                            className="w-full text-xs font-semibold text-gray-500 border border-gray-300 rounded-full py-1.5 hover:bg-gray-50 transition-colors"
                        >
                            Pending ▾
                        </button>
                    )}
                    {status === 'connected' && (
                        <button className="w-full text-xs font-semibold text-white bg-[#057642] rounded-full py-1.5 cursor-default">
                            ✓ Connected
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

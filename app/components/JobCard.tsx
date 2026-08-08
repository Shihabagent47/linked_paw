import Link from 'next/link';
import { Job } from '@/app/data/jobs';

const LOGO_COLORS = ['#0a66c2', '#e66c00', '#057642', '#7c3aed', '#b91c1c', '#0891b2', '#be185d', '#92400e'];

function logoColor(company: string): string {
    const hash = [...company].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return LOGO_COLORS[hash % LOGO_COLORS.length];
}

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 2592000)}mo ago`;
}

type Props = { job: Job; compact?: boolean };

export default function JobCard({ job, compact = false }: Props) {
    const color = logoColor(job.company);

    return (
        <div className={`bg-white rounded-lg border border-[#e0dfdc] hover:shadow-md transition-shadow ${compact ? 'p-3' : 'p-4'}`}>
            <div className="flex gap-3">
                {/* Company logo */}
                <div
                    className="shrink-0 w-12 h-12 rounded flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: color }}
                >
                    {job.company[0]}
                </div>

                <div className="flex-1 min-w-0">
                    <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-sm text-gray-900 hover:underline hover:text-[#0a66c2] leading-tight line-clamp-2 block"
                    >
                        {job.title}
                    </Link>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{job.company}</p>
                    <p className="text-xs text-gray-400 truncate">{job.location}</p>

                    {!compact && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                                {job.species}
                            </span>
                            <span className="text-xs text-gray-400">
                                {timeAgo(job.postedAt)} · {job.applicants.toLocaleString()} applicants
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {!compact && (
                <div className="flex gap-2 mt-3">
                    <Link
                        href={`/jobs/${job.id}`}
                        className="flex-1 text-center text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-full py-1.5 transition-colors"
                    >
                        Easy Apply
                    </Link>
                    <button className="px-4 text-xs font-semibold text-gray-600 border border-gray-300 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors">
                        Save
                    </button>
                </div>
            )}

            {compact && (
                <Link
                    href={`/jobs/${job.id}`}
                    className="block mt-2 text-center text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1 hover:bg-blue-50 transition-colors"
                >
                    View job
                </Link>
            )}
        </div>
    );
}

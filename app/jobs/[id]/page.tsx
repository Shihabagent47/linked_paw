import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { jobs } from '@/app/data/jobs';
import { animals } from '@/app/data/animals';
import JobCard from '@/app/components/JobCard';

const LOGO_COLORS = ['#0a66c2', '#e66c00', '#057642', '#7c3aed', '#b91c1c', '#0891b2', '#be185d', '#92400e'];

function logoColor(company: string): string {
    const hash = [...company].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return LOGO_COLORS[hash % LOGO_COLORS.length];
}

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 2592000)}mo ago`;
}

type Props = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Props) {
    const { id } = await params;
    const job = jobs.find(j => j.id === Number(id));
    if (!job) notFound();

    const poster = animals.find(a => a.id === job.postedBy);
    const color = logoColor(job.company);

    const similar = jobs
        .filter(j => j.id !== job.id && j.species === job.species)
        .slice(0, 3);

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-5">
                <div className="flex gap-5 items-start">

                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Job header card */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-6">
                            <div className="flex gap-4">
                                <div
                                    className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                                    style={{ backgroundColor: color }}
                                >
                                    {job.company[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                                    <p className="text-sm text-gray-700 mt-0.5">{job.company}</p>
                                    <p className="text-sm text-gray-500">{job.location}</p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                                            {job.species}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {timeAgo(job.postedAt)} · {job.applicants.toLocaleString()} applicants
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-5">
                                <button className="flex-1 sm:flex-none sm:px-8 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold rounded-full py-2 transition-colors">
                                    Easy Apply
                                </button>
                                <button className="flex-1 sm:flex-none sm:px-8 border border-gray-400 text-gray-700 text-sm font-semibold rounded-full py-2 hover:border-gray-600 hover:bg-gray-50 transition-colors">
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* About the role */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-3">About the role</h2>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>

                            <h2 className="text-base font-semibold text-gray-900 mt-6 mb-3">Requirements</h2>
                            <ul className="space-y-2">
                                {job.requirements.map((req, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                                        <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#0a66c2]" />
                                        {req}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-xs font-semibold text-amber-800 mb-0.5">Compensation</p>
                                <p className="text-sm text-amber-900">{job.salary}</p>
                            </div>
                        </div>

                        {/* Posted by */}
                        {poster && (
                            <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Posted by</p>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                        <Image src={poster.photo} alt={poster.name} fill className="object-cover" sizes="40px" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/profile/${poster.id}`} className="text-sm font-semibold text-gray-900 hover:underline block truncate">
                                            {poster.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 truncate">{poster.title}</p>
                                    </div>
                                    <Link
                                        href={`/profile/${poster.id}`}
                                        className="text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-3 py-1 hover:bg-blue-50 transition-colors shrink-0"
                                    >
                                        View profile
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-[280px] shrink-0 space-y-3">

                        {/* Similar jobs */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                            <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                {similar.length > 0 ? 'Similar roles' : 'Other open roles'}
                            </h2>
                            <div className="space-y-3">
                                {(similar.length > 0 ? similar : jobs.filter(j => j.id !== job.id).slice(0, 3)).map(j => (
                                    <JobCard key={j.id} job={j} compact />
                                ))}
                            </div>
                            <Link
                                href="/jobs"
                                className="block mt-3 pt-3 border-t border-gray-100 text-xs font-semibold text-center text-gray-500 hover:text-black transition-colors"
                            >
                                See all jobs →
                            </Link>
                        </div>

                        {/* Job details widget */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Job details</p>
                            <div className="space-y-2.5 text-xs">
                                <div>
                                    <p className="text-gray-400">Species</p>
                                    <p className="font-medium text-gray-800 mt-0.5">{job.species}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Location</p>
                                    <p className="font-medium text-gray-800 mt-0.5">{job.location}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Applicants</p>
                                    <p className="font-medium text-gray-800 mt-0.5">{job.applicants.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Compensation</p>
                                    <p className="font-medium text-gray-800 mt-0.5 leading-snug">{job.salary}</p>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </main>
    );
}

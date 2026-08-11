'use client';

import { useState } from 'react';
import { jobs } from '@/app/data/jobs';
import JobCard from '@/app/components/JobCard';

const ALL_SPECIES = ['All', ...Array.from(new Set(jobs.map(j => j.species))).sort()];

export default function JobsPage() {
    const [filter, setFilter] = useState('All');
    const [query, setQuery] = useState('');

    const filtered = jobs.filter(job => {
        const matchesSpecies = filter === 'All' || job.species === filter;
        const matchesQuery =
            query.trim() === '' ||
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.company.toLowerCase().includes(query.toLowerCase());
        return matchesSpecies && matchesQuery;
    });

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-5">

                {/* Search bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4 mb-4">
                    <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 h-10 focus-within:border-[#0a66c2] transition-colors">
                            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Job title or company..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="flex-1 text-sm outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 h-10 w-full sm:w-48">
                            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Location..."
                                className="flex-1 text-sm outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
                            />
                        </div>
                        <button className="h-10 px-5 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold rounded-full transition-colors shrink-0">
                            Search
                        </button>
                    </div>
                </div>

                {/* Species filter chips */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {ALL_SPECIES.map(species => (
                        <button
                            key={species}
                            onClick={() => setFilter(species)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                                filter === species
                                    ? 'bg-[#0a66c2] text-white border-[#0a66c2]'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#0a66c2] hover:text-[#0a66c2]'
                            }`}
                        >
                            {species}
                        </button>
                    ))}
                </div>

                <div className="flex gap-5 items-start">

                    {/* Main: job list */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {filtered.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-8 text-center">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No jobs found.</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">The prey has moved on. Try different filters.</p>
                            </div>
                        ) : (
                            filtered.map(job => <JobCard key={job.id} job={job} />)
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-[280px] shrink-0 space-y-3 hidden lg:block">

                        {/* Jobs you may like */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Jobs you may like</h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-3">Based on your profile</p>
                            <div className="space-y-3">
                                {jobs.slice(0, 3).map(job => (
                                    <JobCard key={job.id} job={job} compact />
                                ))}
                            </div>
                        </div>

                        {/* Job alert widget */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Set up a job alert</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                                Get notified when new prey — uh, positions — match your profile.
                            </p>
                            <button className="w-full text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                Create alert
                            </button>
                        </div>

                        {/* Stats widget */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">By the numbers</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Open positions</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{jobs.length}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Total applicants</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {jobs.reduce((s, j) => s + j.applicants, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Most competitive</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate ml-2 text-right">
                                        {jobs.sort((a, b) => b.applicants - a.applicants)[0].title.split(' ').slice(0, 2).join(' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </main>
    );
}

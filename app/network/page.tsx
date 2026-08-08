'use client';

import { useState } from 'react';
import { animals } from '@/app/data/animals';
import { ME } from '@/app/lib/constants';
import ConnectionCard, { ConnectionStatus } from '@/app/components/ConnectionCard';

const others = animals.filter(a => a.id !== ME.id);
const ALL_SPECIES = ['All', ...Array.from(new Set(others.map(a => a.species))).sort()];
const ALL_LOCATIONS = ['Anywhere', ...Array.from(new Set(others.map(a => a.location.split(',')[1]?.trim() ?? a.location))).sort()];

type StatusMap = Record<number, ConnectionStatus>;

export default function NetworkPage() {
    const [statuses, setStatuses] = useState<StatusMap>(() =>
        Object.fromEntries(others.map(a => [a.id, 'none' as ConnectionStatus]))
    );
    const [speciesFilter, setSpeciesFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('Anywhere');
    const [query, setQuery] = useState('');

    function handleConnect(id: number) {
        setStatuses(prev => {
            const next = prev[id] === 'none' ? 'pending' : prev[id] === 'pending' ? 'connected' : 'none';
            return { ...prev, [id]: next };
        });
    }

    const filtered = others.filter(a => {
        const matchesSpecies = speciesFilter === 'All' || a.species === speciesFilter;
        const matchesLocation = locationFilter === 'Anywhere' || a.location.includes(locationFilter);
        const matchesQuery =
            query.trim() === '' ||
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.species.toLowerCase().includes(query.toLowerCase());
        return matchesSpecies && matchesLocation && matchesQuery;
    });

    const connectedCount = Object.values(statuses).filter(s => s === 'connected').length;
    const pendingCount = Object.values(statuses).filter(s => s === 'pending').length;

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-5">

                {/* Header */}
                <div className="bg-white rounded-lg border border-[#e0dfdc] p-4 mb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-base font-bold text-gray-900">My Herd</h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {connectedCount} connected
                                {pendingCount > 0 && ` · ${pendingCount} pending`}
                                {' '}· {ME.connections.toLocaleString()} total connections
                            </p>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 h-9 w-full sm:w-64 focus-within:border-[#0a66c2] transition-colors">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search animals..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mt-3 flex-wrap items-center">
                        <div className="flex gap-1.5 flex-wrap">
                            {ALL_SPECIES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSpeciesFilter(s)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                                        speciesFilter === s
                                            ? 'bg-[#0a66c2] text-white border-[#0a66c2]'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#0a66c2] hover:text-[#0a66c2]'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <select
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                            className="ml-auto text-xs border border-gray-300 rounded-md px-2 py-1.5 text-gray-600 outline-none focus:border-[#0a66c2] transition-colors"
                        >
                            {ALL_LOCATIONS.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-5 items-start">

                    {/* Connection grid */}
                    <div className="flex-1 min-w-0">
                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-lg border border-[#e0dfdc] p-8 text-center">
                                <p className="text-sm font-semibold text-gray-700">No animals found.</p>
                                <p className="text-xs text-gray-400 mt-1">Try different filters — they may be in a different biome.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {filtered.map(animal => (
                                    <ConnectionCard
                                        key={animal.id}
                                        animal={animal}
                                        status={statuses[animal.id]}
                                        onConnect={() => handleConnect(animal.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-[240px] shrink-0 space-y-3">

                        {/* Network stats */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your network</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-600">Total connections</p>
                                    <p className="text-sm font-bold text-[#0a66c2]">{ME.connections.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-600">Connected here</p>
                                    <p className="text-sm font-bold text-[#057642]">{connectedCount}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-600">Pending requests</p>
                                    <p className="text-sm font-bold text-amber-600">{pendingCount}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-600">Animals in network</p>
                                    <p className="text-sm font-bold text-gray-800">{others.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Grow your herd tips */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Grow your herd</p>
                            <div className="space-y-3">
                                {[
                                    { tip: 'Connect with animals from your species', action: 'Filter by species' },
                                    { tip: 'Message connections you haven\'t spoken to in 3–200 years', action: 'View connections' },
                                    { tip: 'Animals with 5000+ connections get 10x more prey opportunities', action: 'Get tips' },
                                ].map(({ tip, action }) => (
                                    <div key={tip} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                        <p className="text-xs text-gray-600 leading-snug">{tip}</p>
                                        <button className="text-xs text-[#0a66c2] font-semibold mt-1 hover:underline">{action} →</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PawPremium upsell */}
                        <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
                            <p className="text-xs font-semibold text-amber-700 mb-1">✨ PawPremium</p>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                See who viewed your profile. Send unlimited InPaw messages. Priority in the migration.
                            </p>
                            <button className="w-full text-xs font-semibold text-amber-700 border border-amber-400 rounded-full py-1.5 hover:bg-amber-50 transition-colors">
                                Try free for 1 moon
                            </button>
                        </div>

                    </aside>
                </div>
            </div>
        </main>
    );
}

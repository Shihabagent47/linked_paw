'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notifications as seedData, Notification, NotificationType } from '@/app/data/notifications';
import { animals } from '@/app/data/animals';

type Filter = 'all' | 'unread' | 'jobs' | 'mentions' | 'endorsements';

const TYPE_ICON: Record<NotificationType, { emoji: string; bg: string; color: string }> = {
    like:         { emoji: '👍', bg: 'bg-blue-100 dark:bg-blue-900/40',   color: 'text-blue-600 dark:text-blue-400'   },
    comment:      { emoji: '💬', bg: 'bg-green-100 dark:bg-green-900/40',  color: 'text-green-600 dark:text-green-400'  },
    endorsement:  { emoji: '⭐', bg: 'bg-amber-100 dark:bg-amber-900/40',  color: 'text-amber-600 dark:text-amber-400'  },
    connection:   { emoji: '🤝', bg: 'bg-blue-100 dark:bg-blue-900/40',   color: 'text-blue-600 dark:text-blue-400'   },
    profile_view: { emoji: '👁️', bg: 'bg-gray-100 dark:bg-gray-700',   color: 'text-gray-600 dark:text-gray-400'   },
    job_alert:    { emoji: '💼', bg: 'bg-indigo-100 dark:bg-indigo-900/40', color: 'text-indigo-600 dark:text-indigo-400' },
    repost:       { emoji: '🔁', bg: 'bg-green-100 dark:bg-green-900/40',  color: 'text-green-600 dark:text-green-400'  },
    mention:      { emoji: '🗣️', bg: 'bg-purple-100 dark:bg-purple-900/40', color: 'text-purple-600 dark:text-purple-400' },
    anniversary:  { emoji: '🎉', bg: 'bg-amber-100 dark:bg-amber-900/40',  color: 'text-amber-600 dark:text-amber-400'  },
};

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 2592000)}mo ago`;
}

function NotificationRow({ n, onRead }: { n: Notification; onRead: (id: number) => void }) {
    const animal = n.animalId ? animals.find(a => a.id === n.animalId) : null;
    const icon = TYPE_ICON[n.type];

    return (
        <Link
            href={n.link ?? '#'}
            onClick={() => onRead(n.id)}
            className={`flex gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${!n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
        >
            {/* Avatar or icon */}
            <div className="relative shrink-0">
                {animal ? (
                    <>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                            <Image src={animal.photo} alt={animal.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${icon.bg}`}>
                            {icon.emoji}
                        </span>
                    </>
                ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${icon.bg}`}>
                        {icon.emoji}
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
                    {n.message}
                </p>
                {n.subtext && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic leading-snug line-clamp-2">{n.subtext}</p>
                )}
                <p className={`text-xs mt-1 ${!n.read ? 'text-[#0a66c2] font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>
                    {timeAgo(n.timestamp)}
                </p>
            </div>

            {/* Unread dot */}
            {!n.read && (
                <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#0a66c2] mt-1.5" />
            )}
        </Link>
    );
}

const TABS: { key: Filter; label: string }[] = [
    { key: 'all',          label: 'All'          },
    { key: 'unread',       label: 'Unread'       },
    { key: 'jobs',         label: 'Jobs'         },
    { key: 'mentions',     label: 'Mentions'     },
    { key: 'endorsements', label: 'Endorsements' },
];

export default function NotificationsPage() {
    const [items, setItems] = useState<Notification[]>(seedData);
    const [filter, setFilter] = useState<Filter>('all');

    function markRead(id: number) {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }

    function markAllRead() {
        setItems(prev => prev.map(n => ({ ...n, read: true })));
    }

    const filtered = items.filter(n => {
        if (filter === 'unread')       return !n.read;
        if (filter === 'jobs')         return n.type === 'job_alert';
        if (filter === 'mentions')     return n.type === 'mention';
        if (filter === 'endorsements') return n.type === 'endorsement';
        return true;
    });

    const unread  = filtered.filter(n => !n.read);
    const read    = filtered.filter(n => n.read);
    const unreadCount = items.filter(n => !n.read).length;

    return (
        <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 py-5">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-semibold text-[#0a66c2] hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 flex mb-4 overflow-x-auto">
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex-1 min-w-fit text-xs font-semibold px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                                filter === key
                                    ? 'border-black dark:border-white text-black dark:text-white'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            {label}
                            {key === 'unread' && unreadCount > 0 && (
                                <span className="ml-1.5 bg-[#0a66c2] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nothing here.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">The savanna is quiet. For now.</p>
                        </div>
                    ) : (
                        <>
                            {unread.length > 0 && (
                                <>
                                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">New</p>
                                    </div>
                                    {unread.map(n => (
                                        <NotificationRow key={n.id} n={n} onRead={markRead} />
                                    ))}
                                </>
                            )}
                            {read.length > 0 && (
                                <>
                                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Earlier</p>
                                    </div>
                                    {read.map(n => (
                                        <NotificationRow key={n.id} n={n} onRead={markRead} />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

'use client';

import React, { useState } from 'react';
import { Post } from '@/app/data/post';
import Image from 'next/image';
import Link from 'next/link';
import { animals } from '@/app/data/animals';

const REACTION_EMOJI: Record<string, string> = {
    LIKE: '👍',
    LOVE: '🐾',
    HAHA: '😄',
    WOW: '😮',
    SAD: '😢',
    ANGRY: '😠',
};

const CONTENT_LIMIT = 280;

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 2592000)}mo`;
}

function PostContent({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\s+)/).map((token, i) =>
                token.startsWith('#') && token.length > 1
                    ? <span key={i} className="text-[#0a66c2] font-medium">{token}</span>
                    : <span key={i}>{token}</span>
            )}
        </>
    );
}

type Props = { post: Post };

export default function PostCard({ post }: Props) {
    const [expanded, setExpanded] = useState(false);

    const author = animals.find(a => a.id === post.authorId)!;
    const isLong = post.content.length > CONTENT_LIMIT;
    const displayText = isLong && !expanded ? post.content.slice(0, CONTENT_LIMIT) + '…' : post.content;

    const topReactionTypes = [...new Set(post.reaction.map(r => r.reactionType))].slice(0, 3);

    return (
        <div className="bg-white rounded-lg border border-[#e0dfdc] overflow-hidden">

            {/* Author header */}
            <div className="flex items-start gap-3 p-4 pb-3">
                <Link href={`/profile/${author.id}`} className="shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                        <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="48px" />
                    </div>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/profile/${author.id}`} className="font-semibold text-sm text-gray-900 hover:underline leading-tight">
                            {author.name}
                        </Link>
                        <span className="text-[10px] text-[#0a66c2] font-semibold border border-[#0a66c2] rounded px-1 leading-[1.4]">
                            1st
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug mt-0.5 truncate">{author.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.timestamp)} · 🌍</p>
                </div>

                <button className="text-xs font-semibold text-[#0a66c2] hover:bg-blue-50 px-3 py-1 rounded-full border border-[#0a66c2] transition-colors shrink-0 mt-0.5">
                    + Follow
                </button>
            </div>

            {/* Post body */}
            <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    <PostContent text={displayText} />
                </p>
                {isLong && (
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-sm text-gray-500 font-semibold hover:text-gray-700 mt-0.5"
                    >
                        {expanded ? 'see less' : 'see more'}
                    </button>
                )}
            </div>

            {/* Optional image */}
            {post.imageUrl && (
                <div className="relative w-full aspect-video">
                    <Image src={post.imageUrl} alt="post image" fill className="object-cover" />
                </div>
            )}

            {/* Engagement stats */}
            {(post.reaction.length > 0 || post.comments.length > 0 || post.shares > 0) && (
                <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-0.5">
                            {topReactionTypes.map(type => (
                                <span key={type} className="text-sm">{REACTION_EMOJI[type]}</span>
                            ))}
                        </div>
                        {post.reaction.length > 0 && (
                            <span className="ml-1 hover:text-[#0a66c2] hover:underline cursor-pointer">
                                {post.reaction.length}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {post.comments.length > 0 && (
                            <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">
                                {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                            </span>
                        )}
                        {post.shares > 0 && (
                            <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">
                                {post.shares.toLocaleString()} reposts
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-4" />

            {/* Action bar */}
            <div className="flex px-2 py-1">
                {[
                    { emoji: '👍', label: 'Like' },
                    { emoji: '💬', label: 'Comment' },
                    { emoji: '🔁', label: 'Repost' },
                    { emoji: '📨', label: 'Send' },
                ].map(({ emoji, label }) => (
                    <button
                        key={label}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 rounded hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    >
                        <span className="text-sm">{emoji}</span>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

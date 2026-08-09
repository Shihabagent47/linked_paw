'use client';

import React, { useState, useRef } from 'react';
import { Post } from '@/app/data/post';
import Image from 'next/image';
import Link from 'next/link';
import { animals } from '@/app/data/animals';

const REACTIONS = [
    { type: 'LIKE',  emoji: '👍', label: 'Like',  activeClass: 'text-[#0a66c2]' },
    { type: 'LOVE',  emoji: '🐾', label: 'Love',  activeClass: 'text-red-500'   },
    { type: 'HAHA',  emoji: '😄', label: 'Haha',  activeClass: 'text-amber-500' },
    { type: 'WOW',   emoji: '😮', label: 'Wow',   activeClass: 'text-amber-500' },
    { type: 'SAD',   emoji: '😢', label: 'Sad',   activeClass: 'text-amber-500' },
    { type: 'ANGRY', emoji: '😠', label: 'Angry', activeClass: 'text-orange-500'},
] as const;

type ReactionType = typeof REACTIONS[number]['type'];

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
    const [showComments, setShowComments] = useState(false);
    const [myReaction, setMyReaction] = useState<ReactionType | null>(null);
    const [reactionCount, setReactionCount] = useState(post.reaction.length);
    const [showPicker, setShowPicker] = useState(false);
    const pickerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const author = animals.find(a => a.id === post.authorId)!;
    const isLong = post.content.length > CONTENT_LIMIT;
    const displayText = isLong && !expanded ? post.content.slice(0, CONTENT_LIMIT) + '…' : post.content;

    const seedTypes = post.reaction.map(r => r.reactionType as ReactionType);
    const allTypes = myReaction ? [myReaction, ...seedTypes] : seedTypes;
    const topReactionTypes = [...new Set(allTypes)].slice(0, 3);

    const activeReaction = REACTIONS.find(r => r.type === myReaction) ?? null;

    function react(type: ReactionType) {
        if (myReaction === type) {
            setMyReaction(null);
            setReactionCount(c => c - 1);
        } else {
            if (!myReaction) setReactionCount(c => c + 1);
            setMyReaction(type);
        }
        setShowPicker(false);
    }

    function openPicker() {
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        pickerTimeout.current = setTimeout(() => setShowPicker(true), 350);
    }

    function closePicker() {
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        pickerTimeout.current = setTimeout(() => setShowPicker(false), 200);
    }

    function cancelClose() {
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700">

            {/* Author header */}
            <div className="flex items-start gap-3 p-4 pb-3">
                <Link href={`/profile/${author.id}`} className="shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                        <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="48px" />
                    </div>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/profile/${author.id}`} className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:underline leading-tight">
                            {author.name}
                        </Link>
                        <span className="text-[10px] text-[#0a66c2] font-semibold border border-[#0a66c2] rounded px-1 leading-[1.4]">
                            1st
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5 truncate">{author.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(post.timestamp)} · 🌍</p>
                </div>

                <button className="text-xs font-semibold text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-full border border-[#0a66c2] transition-colors shrink-0 mt-0.5">
                    + Follow
                </button>
            </div>

            {/* Post body */}
            <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    <PostContent text={displayText} />
                </p>
                {isLong && (
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-sm text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-700 dark:hover:text-gray-200 mt-0.5"
                    >
                        {expanded ? 'see less' : 'see more'}
                    </button>
                )}
            </div>

            {/* Optional image */}
            {post.imageUrl && (
                <div className="relative w-full aspect-video overflow-hidden">
                    <Image src={post.imageUrl} alt="post image" fill className="object-cover" />
                </div>
            )}

            {/* Engagement stats */}
            {(reactionCount > 0 || post.comments.length > 0 || post.shares > 0) && (
                <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-0.5">
                            {topReactionTypes.map(type => (
                                <span key={type} className="text-sm">
                                    {REACTIONS.find(r => r.type === type)?.emoji ?? '👍'}
                                </span>
                            ))}
                        </div>
                        {reactionCount > 0 && (
                            <span className="ml-1 hover:text-[#0a66c2] hover:underline cursor-pointer">
                                {reactionCount}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {post.comments.length > 0 && (
                            <button
                                onClick={() => setShowComments(v => !v)}
                                className="hover:text-[#0a66c2] hover:underline"
                            >
                                {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                            </button>
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
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-4" />

            {/* Action bar */}
            <div className="flex px-2 py-1">
                {/* Like — with reaction picker */}
                <div
                    className="flex-1 relative"
                    onMouseEnter={openPicker}
                    onMouseLeave={closePicker}
                >
                    {/* Reaction picker */}
                    {showPicker && (
                        <div
                            className="absolute bottom-full left-2 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center px-2 py-1.5 gap-0.5 z-20"
                            onMouseEnter={cancelClose}
                            onMouseLeave={closePicker}
                        >
                            {REACTIONS.map(({ type, emoji, label }) => (
                                <button
                                    key={type}
                                    onClick={() => react(type)}
                                    title={label}
                                    className={`text-2xl px-1 py-0.5 rounded-full hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform duration-100 ${myReaction === type ? 'scale-110' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => react(myReaction ?? 'LIKE')}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded transition-colors ${
                            activeReaction
                                ? `${activeReaction.activeClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <span className="text-sm">{activeReaction ? activeReaction.emoji : '👍'}</span>
                        <span className="hidden sm:inline">{activeReaction ? activeReaction.label : 'Like'}</span>
                    </button>
                </div>

                {/* Comment */}
                <button
                    onClick={() => setShowComments(v => !v)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    <span className="text-sm">💬</span>
                    <span className="hidden sm:inline">Comment</span>
                </button>

                {/* Repost */}
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                    <span className="text-sm">🔁</span>
                    <span className="hidden sm:inline">Repost</span>
                </button>

                {/* Send */}
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                    <span className="text-sm">📨</span>
                    <span className="hidden sm:inline">Send</span>
                </button>
            </div>

            {/* Comments section */}
            {showComments && post.comments.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 space-y-3">
                    {post.comments.map(comment => {
                        const commenter = animals.find(a => a.id === comment.animalId);
                        if (!commenter) return null;
                        return (
                            <div key={comment.id} className="flex gap-2.5">
                                <Link href={`/profile/${commenter.id}`} className="shrink-0">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                                        <Image src={commenter.photo} alt={commenter.name} fill className="object-cover" sizes="32px" />
                                    </div>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
                                        <Link href={`/profile/${commenter.id}`} className="text-xs font-semibold text-gray-900 dark:text-gray-100 hover:underline">
                                            {commenter.name}
                                        </Link>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">{comment.comment}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">👍 Like · Reply</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

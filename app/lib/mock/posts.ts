import { posts as rawPosts } from '@/app/data/post';
import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Post, Comment, ReactionCounts, ReactionType } from '@/app/lib/types';

// Map old string-enum values → new ReactionType
const REACTION_MAP: Record<string, ReactionType> = {
  LIKE:  'like',
  LOVE:  'celebrate',
  HAHA:  'roar',
  WOW:   'curious',
  SAD:   'support',
  ANGRY: 'paw',
};

export const mockPosts: Post[] = rawPosts.map((raw) => {
  const author = mockProfiles.find((p) => p.id === String(raw.authorId))!;

  const reaction_counts: ReactionCounts = {};
  for (const r of raw.reaction) {
    const type = REACTION_MAP[r.reactionType as unknown as string];
    if (type) reaction_counts[type] = (reaction_counts[type] ?? 0) + 1;
  }

  const comments: Comment[] = raw.comments.map((c, i) => ({
    id: `comment-${raw.id}-${i + 1}`,
    post_id: String(raw.id),
    author_id: String(c.animalId),
    author: mockProfiles.find((p) => p.id === String(c.animalId))!,
    content: c.comment,
    created_at: new Date(raw.timestamp.getTime() + i * 3_600_000).toISOString(),
  }));

  return {
    id: String(raw.id),
    author_id: String(raw.authorId),
    author,
    content: raw.content,
    image_url: raw.imageUrl ?? null,
    view_count: raw.shares * 4 + raw.id * 23,
    reaction_counts,
    comments,
    share_count: raw.shares,
    created_at: raw.timestamp.toISOString(),
  };
});

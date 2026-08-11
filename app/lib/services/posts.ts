import { mockPosts } from '@/app/lib/mock/posts';
import { userReactions } from '@/app/lib/mock/state';
import type { Post, Comment, ReactionType } from '@/app/lib/types';
import { mockProfiles } from '@/app/lib/mock/profiles';

const PAGE_SIZE = 10;

export async function getPosts(cursor?: string): Promise<{ posts: Post[]; nextCursor: string | null }> {
  const sorted = [...mockPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const startIdx = cursor ? sorted.findIndex((p) => p.id === cursor) + 1 : 0;
  const page = sorted.slice(startIdx, startIdx + PAGE_SIZE);
  const nextCursor = page.length === PAGE_SIZE ? page[page.length - 1].id : null;
  return { posts: page, nextCursor };
}

export async function getPost(id: string): Promise<Post | null> {
  return mockPosts.find((p) => p.id === id) ?? null;
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  return mockPosts
    .filter((p) => p.author_id === authorId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createPost(authorId: string, content: string, imageUrl?: string): Promise<Post> {
  const author = mockProfiles.find((p) => p.id === authorId)!;
  const post: Post = {
    id: String(mockPosts.length + 100),
    author_id: authorId,
    author,
    content,
    image_url: imageUrl ?? null,
    view_count: 0,
    reaction_counts: {},
    comments: [],
    share_count: 0,
    created_at: new Date().toISOString(),
  };
  mockPosts.unshift(post);
  return post;
}

export async function getUserReaction(postId: string, userId: string): Promise<ReactionType | null> {
  return userReactions.find((r) => r.post_id === postId && r.user_id === userId)?.type ?? null;
}

export async function reactToPost(postId: string, userId: string, type: ReactionType): Promise<void> {
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) return;

  const existing = userReactions.find((r) => r.post_id === postId && r.user_id === userId);
  if (existing) {
    // Remove old reaction count
    const old = existing.type;
    post.reaction_counts[old] = Math.max(0, (post.reaction_counts[old] ?? 1) - 1);
    existing.type = type;
  } else {
    userReactions.push({ post_id: postId, user_id: userId, type });
  }
  post.reaction_counts[type] = (post.reaction_counts[type] ?? 0) + 1;
}

export async function removeReaction(postId: string, userId: string): Promise<void> {
  const post = mockPosts.find((p) => p.id === postId);
  const idx = userReactions.findIndex((r) => r.post_id === postId && r.user_id === userId);
  if (idx === -1 || !post) return;

  const type = userReactions[idx].type;
  post.reaction_counts[type] = Math.max(0, (post.reaction_counts[type] ?? 1) - 1);
  userReactions.splice(idx, 1);
}

export async function addComment(postId: string, authorId: string, content: string): Promise<Comment> {
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found`);

  const author = mockProfiles.find((p) => p.id === authorId)!;
  const comment: Comment = {
    id: `comment-${postId}-${Date.now()}`,
    post_id: postId,
    author_id: authorId,
    author,
    content,
    created_at: new Date().toISOString(),
  };
  post.comments.push(comment);
  return comment;
}

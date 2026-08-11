import type { ReactionType, Connection } from '@/app/lib/types';
import { mockConnections } from '@/app/lib/mock/connections';

// In-memory mutable state — simulates DB writes during development.
// Resets on server restart (same as a real DB in a test environment).

export type UserReaction = { post_id: string; user_id: string; type: ReactionType };
export type JobApplication = { job_id: string; user_id: string; applied_at: string };

export const userReactions: UserReaction[] = [];

export const jobApplications: JobApplication[] = [];

// Connections are seeded from the mock file; mutations go here so originals stay clean.
export const connections: Connection[] = [...mockConnections];

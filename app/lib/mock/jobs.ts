import { jobs as rawJobs } from '@/app/data/jobs';
import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Job } from '@/app/lib/types';

export const mockJobs: Job[] = rawJobs.map((raw) => ({
  id: String(raw.id),
  posted_by: String(raw.postedBy),
  poster: mockProfiles.find((p) => p.id === String(raw.postedBy))!,
  title: raw.title,
  company: raw.company,
  location: raw.location,
  description: raw.description,
  requirements: raw.requirements,
  salary: raw.salary,
  species_tag: raw.species ?? null,
  applicants_count: raw.applicants,
  created_at: raw.postedAt.toISOString(),
}));

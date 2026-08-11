import { mockJobs } from '@/app/lib/mock/jobs';
import { jobApplications } from '@/app/lib/mock/state';
import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Job } from '@/app/lib/types';

export async function getJobs(filters?: { species?: string; query?: string }): Promise<Job[]> {
  let results = [...mockJobs];
  if (filters?.species) {
    results = results.filter((j) => j.species_tag === filters.species);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
    );
  }
  return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getJob(id: string): Promise<Job | null> {
  return mockJobs.find((j) => j.id === id) ?? null;
}

export async function getJobsByPoster(posterId: string): Promise<Job[]> {
  return mockJobs.filter((j) => j.posted_by === posterId);
}

export async function applyToJob(jobId: string, userId: string): Promise<void> {
  if (jobApplications.some((a) => a.job_id === jobId && a.user_id === userId)) return;
  jobApplications.push({ job_id: jobId, user_id: userId, applied_at: new Date().toISOString() });
  const job = mockJobs.find((j) => j.id === jobId);
  if (job) job.applicants_count += 1;
}

export async function hasApplied(jobId: string, userId: string): Promise<boolean> {
  return jobApplications.some((a) => a.job_id === jobId && a.user_id === userId);
}

export async function getUserApplications(userId: string): Promise<Job[]> {
  const appliedIds = new Set(
    jobApplications.filter((a) => a.user_id === userId).map((a) => a.job_id),
  );
  return mockJobs.filter((j) => appliedIds.has(j.id));
}

export async function createJob(
  posterId: string,
  data: Pick<Job, 'title' | 'company' | 'location' | 'description' | 'requirements' | 'salary' | 'species_tag'>,
): Promise<Job> {
  const poster = mockProfiles.find((p) => p.id === posterId)!;
  const job: Job = {
    id: String(mockJobs.length + 100),
    posted_by: posterId,
    poster,
    ...data,
    applicants_count: 0,
    created_at: new Date().toISOString(),
  };
  mockJobs.unshift(job);
  return job;
}

import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Profile } from '@/app/lib/types';

export async function getProfile(id: string): Promise<Profile | null> {
  return mockProfiles.find((p) => p.id === id) ?? null;
}

export async function getProfiles(): Promise<Profile[]> {
  return mockProfiles;
}

export async function searchProfiles(query: string, species?: string): Promise<Profile[]> {
  const q = query.toLowerCase();
  return mockProfiles.filter((p) => {
    const matchesQuery =
      !q ||
      p.display_name.toLowerCase().includes(q) ||
      (p.title ?? '').toLowerCase().includes(q) ||
      (p.company ?? '').toLowerCase().includes(q);
    const matchesSpecies = !species || p.species === species;
    return matchesQuery && matchesSpecies;
  });
}

export async function updateProfile(id: string, updates: Partial<Pick<Profile, 'display_name' | 'title' | 'company' | 'location' | 'bio' | 'avatar_url' | 'banner_url' | 'skills' | 'experience' | 'education'>>): Promise<Profile> {
  const idx = mockProfiles.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Profile ${id} not found`);
  Object.assign(mockProfiles[idx], updates);
  return mockProfiles[idx];
}

// Returns the last 5 distinct profiles who viewed profileId (Alpha feature)
export async function getProfileViewers(profileId: string): Promise<Array<{ viewer: Profile; viewed_at: string }>> {
  // Stub — returns mock viewers for testing the Alpha gate UI
  return mockProfiles
    .filter((p) => p.id !== profileId)
    .slice(0, 5)
    .map((viewer, i) => ({
      viewer,
      viewed_at: new Date(Date.now() - i * 3_600_000 * 8).toISOString(),
    }));
}

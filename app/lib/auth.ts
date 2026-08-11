import type { CurrentUser } from '@/app/lib/types';
import { mockProfiles } from '@/app/lib/mock/profiles';

export const MOCK_USER_ID = '1';

export function getCurrentUser(): CurrentUser {
  const profile = mockProfiles.find((p) => p.id === MOCK_USER_ID)!;
  return {
    ...profile,
    email: 'leonard@savannadynamics.com',
    subscription: null,
  };
}

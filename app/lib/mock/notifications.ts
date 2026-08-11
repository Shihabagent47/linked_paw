import { notifications as rawNotifs } from '@/app/data/notifications';
import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Notification, NotificationType } from '@/app/lib/types';

const TYPE_MAP: Record<string, NotificationType> = {
  like:          'reaction',
  comment:       'comment',
  endorsement:   'endorsement',
  connection:    'connection_accepted',
  profile_view:  'profile_view',
  job_alert:     'job_alert',
  repost:        'repost',
  mention:       'mention',
  anniversary:   'anniversary',
};

export const mockNotifications: Notification[] = rawNotifs.map((raw) => ({
  id: String(raw.id),
  user_id: '1',
  actor_id: raw.animalId ? String(raw.animalId) : null,
  actor: raw.animalId ? (mockProfiles.find((p) => p.id === String(raw.animalId)) ?? null) : null,
  type: TYPE_MAP[raw.type] ?? 'reaction',
  entity_id: null,
  message: raw.message,
  subtext: raw.subtext ?? null,
  read: raw.read,
  link: raw.link ?? null,
  created_at: raw.timestamp.toISOString(),
}));

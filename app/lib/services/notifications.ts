import { mockNotifications } from '@/app/lib/mock/notifications';
import type { Notification } from '@/app/lib/types';

export async function getNotifications(userId: string): Promise<Notification[]> {
  return mockNotifications
    .filter((n) => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getUnreadCount(userId: string): Promise<number> {
  return mockNotifications.filter((n) => n.user_id === userId && !n.read).length;
}

export async function markAsRead(notificationId: string): Promise<void> {
  const n = mockNotifications.find((n) => n.id === notificationId);
  if (n) n.read = true;
}

export async function markAllAsRead(userId: string): Promise<void> {
  mockNotifications.forEach((n) => {
    if (n.user_id === userId) n.read = true;
  });
}

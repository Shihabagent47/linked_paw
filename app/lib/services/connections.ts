import { connections } from '@/app/lib/mock/state';
import { mockProfiles } from '@/app/lib/mock/profiles';
import type { Profile, Connection, ConnectionStatus } from '@/app/lib/types';

export async function getConnectionStatus(userId: string, otherId: string): Promise<ConnectionStatus> {
  const conn = connections.find(
    (c) =>
      (c.requester_id === userId && c.receiver_id === otherId) ||
      (c.requester_id === otherId && c.receiver_id === userId),
  );
  if (!conn) return 'none';
  if (conn.status === 'connected') return 'connected';
  if (conn.status === 'pending') {
    return conn.requester_id === userId ? 'pending_sent' : 'pending_received';
  }
  return 'none';
}

export async function getConnections(userId: string): Promise<Profile[]> {
  return connections
    .filter(
      (c) =>
        c.status === 'connected' &&
        (c.requester_id === userId || c.receiver_id === userId),
    )
    .map((c) => {
      const otherId = c.requester_id === userId ? c.receiver_id : c.requester_id;
      return mockProfiles.find((p) => p.id === otherId)!;
    })
    .filter(Boolean);
}

export async function getConnectionsCount(userId: string): Promise<number> {
  return connections.filter(
    (c) =>
      c.status === 'connected' &&
      (c.requester_id === userId || c.receiver_id === userId),
  ).length;
}

export async function getPendingReceived(userId: string): Promise<Connection[]> {
  return connections
    .filter((c) => c.receiver_id === userId && c.status === 'pending')
    .map((c) => ({
      ...c,
      requester: mockProfiles.find((p) => p.id === c.requester_id),
      receiver: mockProfiles.find((p) => p.id === c.receiver_id),
    }));
}

export async function sendConnectionRequest(requesterId: string, receiverId: string): Promise<void> {
  const existing = connections.find(
    (c) =>
      (c.requester_id === requesterId && c.receiver_id === receiverId) ||
      (c.requester_id === receiverId && c.receiver_id === requesterId),
  );
  if (existing) return;
  connections.push({
    id: `conn-${Date.now()}`,
    requester_id: requesterId,
    receiver_id: receiverId,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
}

export async function acceptConnection(connectionId: string): Promise<void> {
  const conn = connections.find((c) => c.id === connectionId);
  if (conn) conn.status = 'connected';
}

export async function declineConnection(connectionId: string): Promise<void> {
  const idx = connections.findIndex((c) => c.id === connectionId);
  if (idx !== -1) connections.splice(idx, 1);
}

export async function removeConnection(userId: string, otherId: string): Promise<void> {
  const idx = connections.findIndex(
    (c) =>
      (c.requester_id === userId && c.receiver_id === otherId) ||
      (c.requester_id === otherId && c.receiver_id === userId),
  );
  if (idx !== -1) connections.splice(idx, 1);
}

export async function getSuggestedConnections(userId: string, species: string): Promise<Profile[]> {
  const connectedIds = new Set(
    connections
      .filter(
        (c) =>
          (c.requester_id === userId || c.receiver_id === userId),
      )
      .map((c) => (c.requester_id === userId ? c.receiver_id : c.requester_id)),
  );
  connectedIds.add(userId);

  return mockProfiles
    .filter((p) => !connectedIds.has(p.id))
    .sort((a, b) => {
      // Same species first
      const aMatch = a.species === species ? 0 : 1;
      const bMatch = b.species === species ? 0 : 1;
      return aMatch - bMatch || b.connections_count - a.connections_count;
    })
    .slice(0, 8);
}

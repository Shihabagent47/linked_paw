import type { Connection } from '@/app/lib/types';

// Seed connections — all from the perspective of the real DB.
// Leonard (1) is the mock logged-in user.
export const mockConnections: Connection[] = [
  { id: 'conn-1', requester_id: '1', receiver_id: '2', status: 'connected',  created_at: '2025-03-10T00:00:00Z' }, // Leonard ↔ Perry
  { id: 'conn-2', requester_id: '3', receiver_id: '1', status: 'connected',  created_at: '2025-02-14T00:00:00Z' }, // Olivia ↔ Leonard
  { id: 'conn-3', requester_id: '1', receiver_id: '7', status: 'connected',  created_at: '2025-06-01T00:00:00Z' }, // Leonard ↔ Sandra
  { id: 'conn-4', requester_id: '1', receiver_id: '10', status: 'pending',   created_at: '2026-08-08T00:00:00Z' }, // Leonard → Fiona (awaiting)
  { id: 'conn-5', requester_id: '9', receiver_id: '1',  status: 'pending',   created_at: '2026-08-09T00:00:00Z' }, // Gary → Leonard (incoming)
  // Connections between other animals (makes network feel populated)
  { id: 'conn-6', requester_id: '2', receiver_id: '3', status: 'connected',  created_at: '2025-01-20T00:00:00Z' },
  { id: 'conn-7', requester_id: '4', receiver_id: '5', status: 'connected',  created_at: '2025-04-05T00:00:00Z' },
  { id: 'conn-8', requester_id: '6', receiver_id: '7', status: 'connected',  created_at: '2025-05-17T00:00:00Z' },
  { id: 'conn-9', requester_id: '8', receiver_id: '9', status: 'connected',  created_at: '2025-07-22T00:00:00Z' },
  { id: 'conn-10', requester_id: '3', receiver_id: '7', status: 'connected', created_at: '2024-11-11T00:00:00Z' },
];

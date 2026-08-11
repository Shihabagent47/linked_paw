import { animals } from '@/app/data/animals';
import type { Profile } from '@/app/lib/types';

const ALPHA_IDS = new Set(['3', '7']); // Olivia Trunk, Sandra Gull

const BANNERS: Record<string, string> = {
  Lion:                  'https://loremflickr.com/1000/300/savanna,sunset/all?lock=1',
  'Peregrine Falcon':    'https://loremflickr.com/1000/300/sky,cliff/all?lock=2',
  Elephant:              'https://loremflickr.com/1000/300/grassland,nature/all?lock=3',
  'Three-toed Sloth':    'https://loremflickr.com/1000/300/rainforest,trees/all?lock=4',
  'Common Octopus':      'https://loremflickr.com/1000/300/ocean,underwater/all?lock=5',
  'Veiled Chameleon':    'https://loremflickr.com/1000/300/jungle,tropical/all?lock=6',
  'Herring Gull':        'https://loremflickr.com/1000/300/coast,sea/all?lock=7',
  'Star-nosed Mole':     'https://loremflickr.com/1000/300/forest,earth/all?lock=8',
  'Aldabra Giant Tortoise': 'https://loremflickr.com/1000/300/beach,island/all?lock=9',
  'Praying Mantis':      'https://loremflickr.com/1000/300/garden,leaves/all?lock=10',
};

export const mockProfiles: Profile[] = animals.map((a) => ({
  id: String(a.id),
  username: a.name.toLowerCase().replace(/\s+/g, '-'),
  display_name: a.name,
  species: a.species,
  title: a.title,
  company: a.company,
  location: a.location,
  bio: a.about,
  avatar_url: a.photo,
  banner_url: BANNERS[a.species] ?? 'https://loremflickr.com/1000/300/nature/all?lock=99',
  is_alpha: ALPHA_IDS.has(String(a.id)),
  skills: a.skills,
  experience: a.experience,
  education: a.education,
  connections_count: a.connections,
  created_at: '2024-01-01T00:00:00Z',
}));

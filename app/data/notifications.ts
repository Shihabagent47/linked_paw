export type NotificationType =
    | 'like'
    | 'comment'
    | 'endorsement'
    | 'connection'
    | 'profile_view'
    | 'job_alert'
    | 'repost'
    | 'mention'
    | 'anniversary';

export type Notification = {
    id: number;
    type: NotificationType;
    animalId?: number;
    message: string;
    subtext?: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

export const notifications: Notification[] = [
    {
        id: 1,
        type: 'like',
        animalId: 2,
        message: 'Perry Grine and 14 others liked your post.',
        subtext: '"5 things I learned taking a 14-hour nap…"',
        timestamp: new Date('2026-08-06T08:00:00'),
        read: false,
        link: '/',
    },
    {
        id: 2,
        type: 'endorsement',
        animalId: 3,
        message: 'Olivia Trunk endorsed you for Napping.',
        subtext: 'Olivia wrote: "Unprecedented proficiency. 428 endorsements and counting."',
        timestamp: new Date('2026-08-06T06:30:00'),
        read: false,
        link: '/profile/1',
    },
    {
        id: 3,
        type: 'job_alert',
        message: 'New job alert: Chief Prey Officer at Savanna Dynamics matches your profile.',
        subtext: '12 applicants so far. You are overqualified. Apply anyway.',
        timestamp: new Date('2026-08-06T05:00:00'),
        read: false,
        link: '/jobs/1',
    },
    {
        id: 4,
        type: 'repost',
        animalId: 10,
        message: 'Fiona Mantis reposted your post.',
        subtext: '"Failure is just success that hasn\'t decided to comply yet."',
        timestamp: new Date('2026-08-05T18:00:00'),
        read: false,
        link: '/',
    },
    {
        id: 5,
        type: 'connection',
        animalId: 7,
        message: 'Sandra Gull accepted your connection request.',
        subtext: 'You now have access to Sandra\'s 8,743-connection network. She has already eaten your lunch.',
        timestamp: new Date('2026-08-05T14:20:00'),
        read: false,
        link: '/profile/7',
    },
    {
        id: 6,
        type: 'mention',
        animalId: 2,
        message: 'Perry Grine mentioned you in a post.',
        subtext: '"Leonard Mane once told me rest is strategy. I disagreed. I still disagree. But I respect it."',
        timestamp: new Date('2026-08-05T11:00:00'),
        read: false,
        link: '/',
    },
    {
        id: 7,
        type: 'comment',
        animalId: 4,
        message: 'Barry Sloth commented on your post.',
        subtext: '"Taking a mindful pause to say: same. This is everything."',
        timestamp: new Date('2026-08-04T20:00:00'),
        read: true,
        link: '/',
    },
    {
        id: 8,
        type: 'profile_view',
        animalId: 9,
        message: 'Gary Torto viewed your profile.',
        subtext: 'Gary has been in the industry since 1780. This is a significant endorsement.',
        timestamp: new Date('2026-08-04T09:00:00'),
        read: true,
        link: '/profile/9',
    },
    {
        id: 9,
        type: 'endorsement',
        animalId: 5,
        message: 'Dot Octavia endorsed you for Strategic Ambushing.',
        subtext: 'Dot added: "Could use more arms but the commitment is there."',
        timestamp: new Date('2026-08-03T16:00:00'),
        read: true,
        link: '/profile/1',
    },
    {
        id: 10,
        type: 'anniversary',
        message: 'Celebrate your 7-year work anniversary at Savanna Dynamics LLC!',
        subtext: 'Your connections are notified. Several have already posted congratulations they don\'t mean.',
        timestamp: new Date('2026-08-03T07:00:00'),
        read: true,
        link: '/profile/1',
    },
    {
        id: 11,
        type: 'job_alert',
        message: 'New job alert: Apex Predator (IC) at Wildlife Inc. — 134 applicants.',
        subtext: 'Based on your profile. $0 base + 100% commission. Territory equity at 5 years.',
        timestamp: new Date('2026-08-02T12:00:00'),
        read: true,
        link: '/jobs/15',
    },
    {
        id: 12,
        type: 'like',
        animalId: 3,
        message: 'Olivia Trunk and 6 others liked your post.',
        subtext: '"I was rejected 3 times before I became the Apex Predator of this region…"',
        timestamp: new Date('2026-08-01T10:00:00'),
        read: true,
        link: '/',
    },
    {
        id: 13,
        type: 'profile_view',
        animalId: 8,
        message: 'Marcus Mole viewed your profile.',
        subtext: 'Marcus rarely surfaces. This is meaningful. He will not respond to your message.',
        timestamp: new Date('2026-07-30T15:00:00'),
        read: true,
        link: '/profile/8',
    },
    {
        id: 14,
        type: 'endorsement',
        animalId: 6,
        message: 'Kevin Camelo endorsed you for Intimidation.',
        subtext: 'Kevin also endorsed the competing skill "Gentle Persuasion" this week. He\'s pivoting.',
        timestamp: new Date('2026-07-28T11:00:00'),
        read: true,
        link: '/profile/1',
    },
    {
        id: 15,
        type: 'comment',
        animalId: 1,
        message: 'You commented on your own post.',
        subtext: '"Genuinely one of the most insightful things I\'ve ever written. Sharing again."',
        timestamp: new Date('2026-07-25T09:00:00'),
        read: true,
        link: '/',
    },
];

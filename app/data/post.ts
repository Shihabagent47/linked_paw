enum ReactionType {
    LIKE = 'LIKE',
    LOVE = 'LOVE',
    HAHA = 'HAHA',
    WOW = 'WOW',
    SAD = 'SAD',
    ANGRY = 'ANGRY'
}

export type Post = {
    id: number;
    authorId: number;
    content: string;
    comments: Comment[];
    timestamp: Date;
    imageUrl: string | undefined;
    reaction: Reactions[];
    shares: number;
}

export type Comment = {
    id: number;
    animalId: number;
    comment: string;
}

export type Reactions = {
    id: number;
    reactionType: ReactionType;
}

let reactionCounter = 1;
const r = (type: ReactionType): Reactions => ({ id: reactionCounter++, reactionType: type });

let commentCounter = 1;
const c = (animalId: number, comment: string): Comment => ({ id: commentCounter++, animalId, comment });

export const posts: Post[] = [
    // ── Leonard Mane (1) ─────────────────────────────────────────────
    {
        id: 1,
        authorId: 1,
        content: `Thrilled to announce that I have accepted an offer to remain CEO of myself.\n\nAfter reviewing 7 competing offers (all internal), I chose the role that best aligned with my personal brand and territorial ambitions. The negotiation was brief. The outcome was never in doubt.\n\nTo everyone who believed in me: I remembered you.\nTo everyone who didn't: I also remembered you.\n\n#Leadership #NewRole #Apex #GrowthMindset`,
        comments: [
            c(3, "Congratulations Leonard! Truly inspiring. We never doubted you."),
            c(7, "So well-deserved. Let's connect at the Savanna Summit next quarter!"),
            c(5, "Eight simultaneous standing ovations from me. One per arm."),
        ],
        timestamp: new Date('2026-08-05'),
        imageUrl: 'https://loremflickr.com/800/450/lion,savanna/all?lock=101',
        reaction: [r(ReactionType.LIKE), r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.WOW)],
        shares: 47,
    },
    {
        id: 2,
        authorId: 1,
        content: `A cub approached me this morning and asked: "How do you lead a pride?"\n\nI told them what my father told me, and his father before him:\n\n"You don't lead a pride. You ARE the pride."\n\nThey stared at me for 40 seconds and walked away. That's mentorship.\n\n#Leadership #WisdomUnderTheSun #MentorshipMatters`,
        comments: [
            c(9, "240 years of leadership experience tells me you are correct."),
        ],
        timestamp: new Date('2026-07-28'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.LIKE), r(ReactionType.HAHA)],
        shares: 312,
    },
    {
        id: 3,
        authorId: 1,
        content: `5 things I learned taking a 14-hour nap:\n\n1. Rest is not weakness. It is strategy.\n2. The prey will still be there when you wake up.\n3. Delegation is just sleeping while others work.\n4. Nobody ever disrupted an industry by being awake.\n5. I am the most productive animal in this savanna.\n\nSave this post. Share it with someone who needs to hear it.\n\n#ApexLeadership #ProductivityHacks #MondayMotivation`,
        comments: [
            c(4, "Finally someone saying what we're all thinking."),
            c(2, "Respectfully disagree on point 4 but the rest tracks."),
            c(7, "Screenshotting this. Point 3 is going directly into my keynote."),
        ],
        timestamp: new Date('2026-07-14'),
        imageUrl: 'https://loremflickr.com/800/450/savanna,sunset/all?lock=202',
        reaction: [r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.HAHA)],
        shares: 891,
    },

    // ── Perry Grine (2) ──────────────────────────────────────────────
    {
        id: 4,
        authorId: 2,
        content: `Just hit 242mph on my morning commute.\n\nNot a brag. A data point.\n\nWhile you were hitting snooze, I was already at altitude. While you were checking emails, I had already processed 14 thermal columns and made a $0 decision that will 10x my Q4.\n\nHustle culture? I didn't invent hustle culture. I invented velocity culture. There's a difference. (I will explain in my upcoming course.)\n\n#VelocityFirst #Disruption #FalconMindset`,
        comments: [
            c(8, "Honestly impressive but this post took me longer to read than your commute."),
            c(5, "Simultaneously inspired and exhausted by this."),
        ],
        timestamp: new Date('2026-08-04'),
        imageUrl: undefined,
        reaction: [r(ReactionType.WOW), r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LIKE)],
        shares: 203,
    },
    {
        id: 5,
        authorId: 2,
        content: `Hot take: slow is just fast people waiting for you.\n\nI don't have hot takes. I have terminal velocity takes.\n\nExcited to announce I'll be speaking at PredatorCon 2026 on "From 0 to 240: Building a Velocity-First Culture in Uncertain Thermal Conditions." Tickets going fast. (Like me.)\n\n#Speaker #PredatorCon #FalconEconomy #GoFaster`,
        comments: [],
        timestamp: new Date('2026-07-21'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.LIKE)],
        shares: 128,
    },

    // ── Olivia Trunk (3) ─────────────────────────────────────────────
    {
        id: 6,
        authorId: 3,
        content: `Humbled and grateful to announce that our watering hole is up 300% year-over-year.\n\nI don't share this to impress you. I share this because someone out there needs to hear that patience, memory, and 47 years of relationship building can outperform any venture-backed disruption.\n\nI remember every one of you. Yes, even that one. Especially that one.\n\n#Gratitude #Humbled #HerdLeadership #NeverForget`,
        comments: [
            c(9, "300% is remarkable. I saw similar numbers in 1987."),
            c(1, "Congrats Olivia. The watering hole initiative was partly my idea as you may recall."),
            c(7, "The 47-year relationship building comment landed. Forwarding to my entire flock."),
        ],
        timestamp: new Date('2026-08-03'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.WOW)],
        shares: 567,
    },
    {
        id: 7,
        authorId: 3,
        content: `Twenty years ago a young calf told me she'd never be a matriarch.\n\nI remembered that.\n\nToday she leads a herd of 400.\n\nI remembered that too.\n\nMentorship isn't about what you say. It's about what you remember saying later so you can post about it.\n\n#Mentorship #WomenInWildlife #HerdLeader #LongGameWins`,
        comments: [
            c(10, "This made me emotional. I made a swift decision to cry."),
        ],
        timestamp: new Date('2026-07-17'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.LOVE)],
        shares: 1203,
    },

    // ── Barry Sloth (4) ──────────────────────────────────────────────
    {
        id: 8,
        authorId: 4,
        content: `Taking a mindful pause.\n\nIt's not laziness — it's strategic stillness.\n\nI've been hanging from the same branch for 7 months. Some might call that stagnation. I call it deep roots. The branch hasn't complained. The branch understands me.\n\nExcited to announce I'm 11% through my TEDx draft. ETA: 14 months (revised from 18 — growth mindset).\n\n#Mindfulness #StrategicPause #SlowIsSmooth #Wellness`,
        comments: [
            c(8, "Slow and deliberate. Respect the process."),
            c(2, "...11%? In 7 months?"),
        ],
        timestamp: new Date('2026-08-01'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.LOVE)],
        shares: 88,
    },
    {
        id: 9,
        authorId: 4,
        content: `Unpopular opinion: the most productive thing you can do today is nothing.\n\nI do nothing professionally. I have a waitlist.\n\nNew course dropping (eventually): "Strategic Stillness: The Art of Not Moving While the World Burns Around You." Presale price: whatever. I'll announce it when I get to it.\n\nDM me. I will respond in 3–6 weeks.\n\n#CourseCreator #Wellness #DeepRest #SlowLeadership`,
        comments: [
            c(3, "Barry I sent you a DM in February, just checking in again."),
            c(9, "I replied to a message in 2019. Still waiting on the response. Solidarity."),
        ],
        timestamp: new Date('2026-07-09'),
        imageUrl: undefined,
        reaction: [r(ReactionType.HAHA), r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA)],
        shares: 441,
    },

    // ── Dot Octavia (5) ──────────────────────────────────────────────
    {
        id: 10,
        authorId: 5,
        content: `While you were managing one inbox, I was managing eight.\n\nArm 1: emails. Arm 2: Slack. Arm 3: quarterly report. Arm 4: camouflage. Arm 5: existential dread. Arm 6: investor deck. Arm 7: snack. Arm 8: this post.\n\nThrilled to announce my new online course: "The Octopus Framework: 8 Arms, 8 Revenue Streams." Launching next week. All 8 of them.\n\n#Productivity #Multitasking #OceanLeader #8xROI`,
        comments: [
            c(2, "I respect the throughput but have you considered doing one thing really fast?"),
            c(6, "I pivoted to an 8-stream model last month. Different 8 streams than last week's."),
            c(9, "I built seven revenue streams over 200 years. You did eight simultaneously. The future is here."),
        ],
        timestamp: new Date('2026-08-05'),
        imageUrl: 'https://loremflickr.com/800/450/ocean,underwater/all?lock=303',
        reaction: [r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.WOW)],
        shares: 734,
    },
    {
        id: 11,
        authorId: 5,
        content: `Story time.\n\nIn 2021 a VC told me I'd never scale with 8 arms.\n\nToday I have 8 product lines, 8 revenue streams, and 8 separate therapy subscriptions.\n\nOne for each arm.\n\nThey said it couldn't be done. I did it with arms to spare.\n\n#FounderStory #OceanStartup #Rejection #GlowUp`,
        comments: [
            c(1, "Incredible. I would have fired that VC on the spot."),
        ],
        timestamp: new Date('2026-07-25'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.WOW)],
        shares: 388,
    },

    // ── Kevin Camelo (6) ─────────────────────────────────────────────
    {
        id: 12,
        authorId: 6,
        content: `Excited to announce I've pivoted.\n\nLast week I was all-in on AI. This week I'm a "data-skeptic pragmatist." By Thursday I expect to be a blockchain apologist again.\n\nThis isn't inconsistency. This is Radical Adaptability™.\n\nIf your strategy doesn't change color to match its environment, it's not a strategy. It's a liability.\n\nDM me for my consulting rates. They also change color.\n\n#RadicalAdaptability #Pivot #FutureOfWork #ChromaShift`,
        comments: [
            c(3, "Kevin I need to flag that you endorsed blockchain to me in January and told me to short it in March."),
            c(5, "We stan a serial pivoter. What colour are we this week?"),
        ],
        timestamp: new Date('2026-08-04'),
        imageUrl: undefined,
        reaction: [r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.WOW)],
        shares: 156,
    },
    {
        id: 13,
        authorId: 6,
        content: `I was an early adopter of AI before anyone called it AI.\n\nI was also an early skeptic of AI before anyone called it a bubble.\n\nAnd I was early to the "actually AI is fine" camp before the correction.\n\nPattern recognition? No. Pattern creation. There's a difference and I'll explain it in a framework I'm developing called C.H.A.N.G.E. (Completely Honest About Nothing, Generally Evolving).\n\nPre-register below.\n\n#ThoughtLeader #Visionary #EarlyAdopter #Consultant`,
        comments: [],
        timestamp: new Date('2026-07-11'),
        imageUrl: undefined,
        reaction: [r(ReactionType.HAHA), r(ReactionType.HAHA), r(ReactionType.LIKE)],
        shares: 74,
    },

    // ── Sandra Gull (7) ──────────────────────────────────────────────
    {
        id: 14,
        authorId: 7,
        content: `Just got back from the Coastal Leaders Forum.\n\nAmazing connections. Incredible energy. Also incredible chips.\n\nI want to specifically thank the attendee in the blue lanyard whose lunch I relocated to expand my network. You modelled generosity beautifully.\n\nIf you're reading this: your sandwich was exceptional and your LinkedIn is impressive too.\n\nLet's connect.\n\n#Networking #CoastalLeaders #Community #Gratitude`,
        comments: [
            c(1, "Sandra your networking energy is unmatched. Truly."),
            c(9, "I attended this forum in 1994. Also good chips then."),
        ],
        timestamp: new Date('2026-08-03'),
        imageUrl: 'https://loremflickr.com/800/450/seagull,coast/all?lock=404',
        reaction: [r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA)],
        shares: 319,
    },
    {
        id: 15,
        authorId: 7,
        content: `Thrilled to be recognised as a LinkedPaw Top Voice in Swooping for the 3rd consecutive year.\n\nI didn't get here by waiting for opportunity. I spotted it from 60 meters, assessed trajectory, and committed.\n\nMost animals wait for the fish to come to them. I have never waited for anything in my life, including this award, which I nominated myself for.\n\nDM me for my keynote rates.\n\n#TopVoice #LinkedPaw #Swooping #NetworkingQueen`,
        comments: [
            c(2, "Fully deserved. Commitment at 60m is a skill set."),
        ],
        timestamp: new Date('2026-07-19'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.WOW)],
        shares: 211,
    },

    // ── Marcus Mole (8) ──────────────────────────────────────────────
    {
        id: 16,
        authorId: 8,
        content: `I have not attended a meeting above ground since Q2 2019.\n\nIn that time:\n— Published 3 papers\n— Built 2 proprietary models\n— Identified 14,000 earthworms by tactile signature alone\n— Completed a 400-page treatise on soil composition\n— Responded to 0 Slack messages\n\nDeep work is not a productivity hack. It is a lifestyle. A dark, damp, silent lifestyle. You are not ready.\n\n#DeepWork #NoDistraction #Underground #Focus`,
        comments: [
            c(4, "The silence part speaks to me on a spiritual level."),
            c(7, "I've sent you 11 connection requests. Still pending."),
            c(6, "I've pivoted 6 times since you last replied to anyone. The underground has its advantages."),
        ],
        timestamp: new Date('2026-08-02'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.WOW)],
        shares: 662,
    },
    {
        id: 17,
        authorId: 8,
        content: `Hot take: your open-plan office is the single greatest threat to civilisation since the last ice age.\n\nI built a tunnel system in 2019. Productivity up 400%. Collaboration down 100%. Net result: positive.\n\nYou cannot deep-work in a glass box surrounded by people who say "circling back." I have never circled back. I only go forward. Through dirt.\n\nDMs closed. Tunnel open. (Invitation only.)\n\n#DeepWork #AntiDistraction #FocusFirst #OfficeIsOver`,
        comments: [
            c(1, "The glass box comment is aggressive but I felt it."),
            c(2, "Tried your tunnel model. Too slow for me. Respect the outcome though."),
        ],
        timestamp: new Date('2026-07-06'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.LIKE)],
        shares: 504,
    },

    // ── Gary Torto (9) ───────────────────────────────────────────────
    {
        id: 18,
        authorId: 9,
        content: `I've been asked what the secret to a 200-year career is.\n\nI say: show up. Slowly. Every day. For 200 years.\n\nI have outlasted 14 CEOs, 6 empires, 3 monetary systems, and whatever NFTs were. I'm still here. Still in the original shell.\n\nThe market always corrects. I do not correct. I was already right.\n\n#LongTermThinking #Resilience #CareerAdvice #StillHere`,
        comments: [
            c(3, "Gary your perspective on time is genuinely humbling. We have so much to learn."),
            c(1, "14 CEOs and still going. Respect the tenure."),
        ],
        timestamp: new Date('2026-08-04'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LOVE), r(ReactionType.WOW)],
        shares: 2341,
    },
    {
        id: 19,
        authorId: 9,
        content: `Everyone is talking about 5-year plans.\n\nCute.\n\nI'm on my 7th career. My current 50-year plan began in 1987 and is proceeding exactly on schedule.\n\nPatience isn't a virtue. It's a competitive advantage that 99% of animals physically cannot replicate because they don't live long enough.\n\nI do.\n\nOpen to advisory roles with a minimum 30-year engagement.\n\n#Advisory #LongGame #200YearCareer #Sustainable`,
        comments: [
            c(6, "A 50-year plan? I can barely commit to a strategy for 50 minutes."),
        ],
        timestamp: new Date('2026-07-22'),
        imageUrl: 'https://loremflickr.com/800/450/tortoise,nature/all?lock=505',
        reaction: [r(ReactionType.WOW), r(ReactionType.LOVE), r(ReactionType.WOW), r(ReactionType.LIKE)],
        shares: 1876,
    },

    // ── Fiona Mantis (10) ────────────────────────────────────────────
    {
        id: 20,
        authorId: 10,
        content: `I don't make hard decisions. I make fast ones.\n\nThere's a difference.\n\nHard implies the outcome is uncertain. Nothing is uncertain when you commit fully. I have never been uncertain. I have a 100% decision close rate. Not everyone makes it through a session, but those who do are fundamentally — and I mean permanently — changed.\n\nNew coaching program: "Strike First, Reflect Never." DM for availability. I have one opening. Act accordingly.\n\n#ExecutiveCoaching #DecisiveLeadership #ActionFirst`,
        comments: [
            c(1, "Signed up. Whatever 'permanently changed' means I'm ready."),
            c(3, "Fiona I'd love to refer a few calves. Just want to confirm they'll be okay after?"),
            c(9, "I made a decision once. In 1847. Still stands."),
        ],
        timestamp: new Date('2026-08-05'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LIKE), r(ReactionType.WOW), r(ReactionType.LIKE)],
        shares: 445,
    },
    {
        id: 21,
        authorId: 10,
        content: `A client asked me last week: "How do I become more decisive?"\n\nI answered before they finished the question.\n\nThat is the entire course.\n\nInvoice sent.\n\n#Coaching #Speed #Decisiveness #ResultsSpeak`,
        comments: [
            c(2, "This is the most efficient use of a coaching session I have ever seen."),
            c(4, "I need 18 months to process this post. But it's beautiful."),
        ],
        timestamp: new Date('2026-07-30'),
        imageUrl: undefined,
        reaction: [r(ReactionType.HAHA), r(ReactionType.HAHA), r(ReactionType.LOVE), r(ReactionType.HAHA), r(ReactionType.LIKE)],
        shares: 1102,
    },

    // ── Bonus posts ──────────────────────────────────────────────────
    {
        id: 22,
        authorId: 1,
        content: `I was rejected 3 times before I became the Apex Predator of this region.\n\nThe first rejection: the wildebeest got away. Character building.\nThe second rejection: the hyenas took my kill. Humbling.\nThe third rejection: a zebra just stared at me and walked off. That one still stings.\n\nBut I kept going. And today I am untouchable.\n\nFailure is just success that hasn't decided to comply yet.\n\nSave this post. It will change your life.\n\n#FailureToSuccess #NeverGiveUp #Apex #MondayMotivation`,
        comments: [
            c(7, "Sharing this with everyone I know. Immediately."),
            c(8, "The zebra story is doing something to me. Respect for sharing."),
            c(4, "The zebra part is a masterclass in impermanence. Still processing it. Slowly."),
            c(6, "Pivoted to a rejection-forward strategy based entirely on this post. Thank you."),
        ],
        timestamp: new Date('2026-07-07'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LIKE), r(ReactionType.LOVE), r(ReactionType.LIKE), r(ReactionType.LIKE), r(ReactionType.WOW)],
        shares: 2109,
    },
    {
        id: 23,
        authorId: 4,
        content: `I want to be vulnerable for a moment.\n\nLast month I fell asleep mid-sentence in a strategy meeting.\n\nI woke up 11 days later with three new ideas, a fully digested meal, and zero regrets.\n\nVulnerability is a superpower. Rest is a revenue strategy. And strategy meetings are for animals who don't trust their gut enough to stay still and let the answer come to them.\n\nThe answer came to me. Slowly. On a Thursday.\n\n#Vulnerability #Authenticity #StrategicRest`,
        comments: [
            c(3, "Barry this is incredibly brave to share. Thank you for modelling this."),
            c(6, "I've pivoted 4 times since you fell asleep. Kept your seat warm."),
        ],
        timestamp: new Date('2026-07-31'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.HAHA), r(ReactionType.LOVE), r(ReactionType.HAHA), r(ReactionType.LIKE)],
        shares: 334,
    },
    {
        id: 24,
        authorId: 7,
        content: `I just want to say: the chip industry changed my life.\n\nNot the semiconductor chip. The potato chip.\n\nEvery great connection I've made — every partnership, every collab, every warm intro — started because someone left their food unattended near a harbour.\n\nOpportunity doesn't knock. It sits on a picnic bench at 1pm on a Tuesday.\n\nBe ready. Be bold. Be hungry.\n\n#OpportunityMindset #Networking #SalesStrategy #AlwaysBeConnecting`,
        comments: [
            c(5, "The picnic bench pipeline is criminally underrated."),
        ],
        timestamp: new Date('2026-07-15'),
        imageUrl: undefined,
        reaction: [r(ReactionType.HAHA), r(ReactionType.LIKE), r(ReactionType.HAHA), r(ReactionType.LIKE)],
        shares: 178,
    },
    {
        id: 25,
        authorId: 3,
        content: `I've been in this industry for 47 years.\n\nI remember every deal. Every handshake. Every betrayal. Every individual who told me the herd model was "unscalable."\n\nWe have 9,999 connections.\n\nI remember all of them.\n\nAll of them.\n\n(This is not a threat. This is a memory. There is a difference. Sometimes.)\n\n#Connections #Network #NeverForget #HumbledAndGrateful`,
        comments: [
            c(1, "Olivia I said the herd model was brilliant from day one. Just to clarify."),
            c(10, "A decisive statement. Respect."),
            c(8, "I have 0 connections above ground and I remember all of them too."),
        ],
        timestamp: new Date('2026-08-06'),
        imageUrl: undefined,
        reaction: [r(ReactionType.LOVE), r(ReactionType.HAHA), r(ReactionType.LOVE), r(ReactionType.WOW), r(ReactionType.LOVE)],
        shares: 3012,
    },
];

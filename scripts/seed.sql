-- LinkedPaw — Full Seed Script
-- Paste into Supabase SQL editor (runs as service role, bypasses RLS)
-- Safe to re-run: ON CONFLICT DO NOTHING throughout

-- ─── Ensure Phase 3 profile columns exist ────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills     jsonb DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education  jsonb DEFAULT '[]';

-- ─── Auth Users ──────────────────────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) VALUES
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'leonard@savanna.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '180 days', now()),

  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'perry@airops.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '170 days', now()),

  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'olivia@savannaremembers.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '165 days', now()),

  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'barry@stillwaters.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '160 days', now()),

  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'dot@tentacledynamics.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '155 days', now()),

  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'kevin@chromashift.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '150 days', now()),

  ('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'sandra@coastalreach.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '145 days', now()),

  ('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'marcus@subsurface.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '140 days', now()),

  ('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'gary@eternalhorizons.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '135 days', now()),

  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'fiona@razorsedge.com', crypt('Seed1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}','{}', now() - interval '130 days', now())
ON CONFLICT (id) DO NOTHING;

-- ─── Profiles ────────────────────────────────────────────────────────────────
INSERT INTO profiles (id, username, display_name, species, title, company, location, bio, avatar_url, banner_url, is_alpha, skills, experience, education, created_at) VALUES

('00000000-0000-0000-0000-000000000001', 'leonardmane', 'Leonard Mane', 'Lion',
 'Chief Hunting Officer & Pride Lead', 'Savanna Dynamics LLC', 'Serengeti, Tanzania',
 'Passionate about territory growth and high-performance hunting. I didn''t get to the top of the food chain by accident — it took grit, vision, and 14 hours of sleep a day. Open to strategic alliances. Not a team player (lions don''t do teams, we do prides). #Leadership #Apex #GrowthMindset',
 'https://loremflickr.com/500/500/lion', 'https://loremflickr.com/1200/400/savanna,sunset', true,
 '[{"name":"Pack Leadership","endorsements":247},{"name":"Strategic Ambushing","endorsements":189},{"name":"Roaring","endorsements":312},{"name":"Napping","endorsements":428},{"name":"Intimidation","endorsements":203}]',
 '[{"title":"Chief Hunting Officer","company":"Savanna Dynamics LLC","period":"2018 – Present","description":"Led cross-functional pride of 12 to exceed quarterly prey targets by 340%. Pioneered the ambush-then-nap agile methodology. Managed a $0 budget (territory is wealth)."},{"title":"Senior Hunter","company":"Maasai Mara Ventures","period":"2013 – 2018","description":"Individual contributor driving end-to-end hunt lifecycle. Promoted to Senior after successfully rebranding being chased off a kill by hyenas as strategic resource redistribution."},{"title":"Junior Pride Associate","company":"East Africa Corp.","period":"2009 – 2013","description":"Foundational role building core competencies in sitting, staring, and looking majestic."}]',
 '[{"school":"Serengeti School of Hard Knocks","degree":"Bachelor of Applied Predation","field":"Ambush Strategy & Pride Management","year":"Class of 2009"},{"school":"Ngorongoro Executive Institute","degree":"Executive Leadership Certificate","field":"Roaring & Territorial Expansion","year":"2015"}]',
 now() - interval '180 days'),

('00000000-0000-0000-0000-000000000002', 'perrygrine', 'Perry Grine', 'Peregrine Falcon',
 'VP of Velocity | Speed Evangelist', 'AirOps Global', 'Cliffside HQ, Norway',
 '240mph isn''t a skill, it''s a mindset. I''ve disrupted the aerial predator space and I''m just getting started. Excited to announce I''ve been nominated for Forbes Under-30 (in falcon years that''s under 4). Let''s connect and fly higher — together.',
 'https://loremflickr.com/500/500/falcon', 'https://loremflickr.com/1200/400/cliff,sky,norway', false,
 '[{"name":"Hypersonic Diving","endorsements":891},{"name":"Aerial Agility","endorsements":567},{"name":"Disruption","endorsements":1204},{"name":"Networking","endorsements":445},{"name":"Vision (literally 8x human)","endorsements":302}]',
 '[{"title":"VP of Velocity","company":"AirOps Global","period":"2020 – Present","description":"Scaled dive operations from 180mph to industry-leading 240mph in under 18 months. Coined the term velocity-first culture and put it on every slide deck."},{"title":"Head of Airspace Strategy","company":"ThermalRise Inc.","period":"2017 – 2020","description":"Owned full-funnel prey acquisition from 1,000ft+ altitude. Built a culture of radical transparency (everyone can see you coming from a mile up)."},{"title":"Freelance Disruptor","company":"Self-Employed","period":"2015 – 2017","description":"Serial disruptee of pigeon commutes. Consulted for several cliff-face startups. Available for keynotes on Failure is Just Gravity."}]',
 '[{"school":"British Isles Avian Academy","degree":"BSc in Aerodynamics","field":"Applied Velocity Studies","year":"Class of 2015"}]',
 now() - interval '170 days'),

('00000000-0000-0000-0000-000000000003', 'oliviatrunk', 'Olivia Trunk', 'Elephant',
 'Memory Architect | Community Builder', 'Savanna Remembers Co.', 'Amboseli, Kenya',
 'They say elephants never forget — and neither do I, especially not those who doubted me. 20 years in the industry. Mentor to 47 calves. I believe the herd rises together. Thrilled to share that our watering hole is up 300% YoY. Humbled and grateful.',
 'https://loremflickr.com/500/500/elephant', 'https://loremflickr.com/1200/400/kenya,savanna,landscape', true,
 '[{"name":"Long-term Memory","endorsements":2847},{"name":"Herd Management","endorsements":1932},{"name":"Water Sourcing","endorsements":1456},{"name":"Emotional Intelligence","endorsements":3201},{"name":"Trunk Multitasking","endorsements":879}]',
 '[{"title":"Memory Architect","company":"Savanna Remembers Co.","period":"2004 – Present","description":"Chief custodian of 87 years of institutional knowledge. Led herd through 3 droughts and 2 regime changes. Still remembers the 2003 offsite. All of it."},{"title":"Senior Matriarch","company":"Great Rift Valley Partners","period":"1998 – 2004","description":"Guided cross-species coalition building initiatives. Introduced the Memory as Competitive Advantage framework. Won matriarch of the year 5 consecutive times."}]',
 '[{"school":"Mount Kilimanjaro School of Wisdom","degree":"Masters of Applied Memory","field":"Generational Knowledge Transfer","year":"Class of 1998"},{"school":"Amboseli Community College","degree":"Certificate in Water Divination","field":"Resource Identification in Arid Conditions","year":"1995"}]',
 now() - interval '165 days'),

('00000000-0000-0000-0000-000000000004', 'barrysloth', 'Barry Sloth', 'Three-toed Sloth',
 'Mindfulness Strategist | Slow Living Advocate', 'Still Waters Consulting', 'Costa Rica Canopy District',
 'Taking a mindful pause. It''s not laziness — it''s strategic stillness. I''ve been hanging from the same branch for 6 months and I''ve never felt more productive. Excited to announce I''m almost finished my TEDx draft. ETA: 18 months. #Wellness #SlowIsSmooth',
 'https://loremflickr.com/500/500/sloth', 'https://loremflickr.com/1200/400/rainforest,green,jungle', false,
 '[{"name":"Strategic Stillness","endorsements":342},{"name":"Deep Rest","endorsements":891},{"name":"Deliberate Hanging","endorsements":127},{"name":"Algae Cultivation (passive)","endorsements":63},{"name":"Mindful Digestion","endorsements":218}]',
 '[{"title":"Chief Stillness Officer","company":"Still Waters Consulting","period":"2019 – Present","description":"Providing strategic counsel on the transformative power of doing less. Currently in month 6 of a listening tour (still on branch 1)."},{"title":"Senior Wellness Strategist","company":"Amazon Canopy Co.","period":"2014 – 2019","description":"Spearheaded the company''s first Slowness as Service offering. Reduced meeting velocity by 94%. Attendance at those meetings: also reduced."}]',
 '[{"school":"University of the Rainforest","degree":"BA in Applied Inertia","field":"Mindfulness & Canopy Studies","year":"Class of 2014"}]',
 now() - interval '160 days'),

('00000000-0000-0000-0000-000000000005', 'dotoctavia', 'Dot Octavia', 'Common Octopus',
 'Chief Multi-tasking Officer | 8-Arm Productivity Coach', 'Tentacle Dynamics', 'Coral Bay, Pacific Ocean',
 'Eight arms, one dream. While you were managing one inbox, I was managing eight. Thrilled to share my new course: The Octopus Framework: 8 Arms, 8 Revenue Streams. Also available in camouflage mode for stealth consulting.',
 'https://loremflickr.com/500/500/octopus', 'https://loremflickr.com/1200/400/ocean,coral,underwater', false,
 '[{"name":"Parallel Processing","endorsements":1847},{"name":"Camouflage Leadership","endorsements":934},{"name":"Ink Crisis Management","endorsements":782},{"name":"8-Stream Revenue Thinking","endorsements":2109},{"name":"Pressure Resistance","endorsements":1456}]',
 '[{"title":"Chief Multi-tasking Officer","company":"Tentacle Dynamics","period":"2021 – Present","description":"Managing 8 simultaneous product lines. Invented the 8-arm standup — a daily sync that covers 8 agendas at once. No one is ever confused. (Everyone is always confused.)"},{"title":"Head of Adaptive Strategy","company":"DeepBlue Labs","period":"2016 – 2021","description":"Pivoted the company''s strategy 14 times in 5 years, each time claiming it was always the plan. Won internal award for Most Impressive Reframe."}]',
 '[{"school":"Pacific Institute of Cephalopod Studies","degree":"MSc in Distributed Intelligence","field":"Multi-neural Processing & Arm Coordination","year":"Class of 2016"}]',
 now() - interval '155 days'),

('00000000-0000-0000-0000-000000000006', 'kevincamelo', 'Kevin Camelo', 'Veiled Chameleon',
 'Adaptability Strategist | Pivot Specialist', 'ChromaShift Partners', 'Madagascar Innovation Hub',
 'I''ve been a Web3 evangelist, a blockchain skeptic, an AI visionary, and a back-to-basics advocate — all in the same quarter. Some call it inconsistency. I call it Radical Adaptability. Currently: extremely bullish on whatever you want to hear. Let''s connect.',
 'https://loremflickr.com/500/500/chameleon', 'https://loremflickr.com/1200/400/madagascar,jungle,colorful', false,
 '[{"name":"Radical Adaptability™","endorsements":743},{"name":"Trend Identification (retroactive)","endorsements":892},{"name":"Colour-coded Pivoting","endorsements":1204},{"name":"Strategic Chameleonism","endorsements":567},{"name":"360° Stakeholder Visibility","endorsements":341}]',
 '[{"title":"Adaptability Strategist","company":"ChromaShift Partners","period":"2022 – Present","description":"Helping organizations pivot before they know they need to. Current specializations include: whatever is trending this week."},{"title":"Chief Transformation Officer","company":"Jungle Digital (formerly Jungle Blockchain, formerly Jungle AI)","period":"2018 – 2022","description":"Rebranded company 4 times to align with emerging trends. Net revenue unchanged. Confidence: unchanged."}]',
 '[{"school":"Chameleon Business School","degree":"MBA in Strategic Ambiguity","field":"Trend-Surfing & Pivot Management","year":"Class of 2018"}]',
 now() - interval '150 days'),

('00000000-0000-0000-0000-000000000007', 'sandragull', 'Sandra Gull', 'Herring Gull',
 'Networking Evangelist | Connector of Creatures', 'CoastalReach Group', 'Brighton, UK',
 'I see an opportunity and I take it. Whether that''s a chip, a connection, or a strategic partnership — I''m there. Thrilled to be named a LinkedIn Top Voice in Swooping. Available for keynotes, networking events, and unattended lunches.',
 'https://loremflickr.com/500/500/seagull', 'https://loremflickr.com/1200/400/brighton,beach,coast', false,
 '[{"name":"Opportunistic Networking","endorsements":3421},{"name":"Rapid Resource Acquisition","endorsements":2109},{"name":"Loud Self-Promotion","endorsements":1876},{"name":"Selective Listening","endorsements":934},{"name":"Chip Identification at 200m","endorsements":4012}]',
 '[{"title":"Chief Networking Officer","company":"CoastalReach Group","period":"2020 – Present","description":"Built Europe''s largest seabird professional network. Maintained 8,700+ relationships by reliably showing up wherever there is food."},{"title":"Senior Connector","company":"Harbour Bridge Associates","period":"2015 – 2020","description":"Connected 2,400 coastal professionals. Attended 847 events. Ate at 847 events. Results: exceptional."}]',
 '[{"school":"Coastal Community University","degree":"BA in Social Opportunism","field":"Networking Theory & Applied Scavenging","year":"Class of 2015"}]',
 now() - interval '145 days'),

('00000000-0000-0000-0000-000000000008', 'marcusmole', 'Marcus Mole', 'Star-nosed Mole',
 'Underground Data Scientist | Deep Work Evangelist', 'SubSurface Analytics', 'The Deep Underground, Ontario',
 'While others are distracted by sunlight and social media, I''ve been doing real work. 0.2 seconds to identify an earthworm. That''s faster than your API. I work in the dark so you don''t have to. Currently finishing a 400-page treatise on dirt. DMs closed.',
 'https://loremflickr.com/500/500/mole,animal', 'https://loremflickr.com/1200/400/underground,dark,tunnel', false,
 '[{"name":"Deep Work","endorsements":1203},{"name":"Subsurface Data Mining","endorsements":892},{"name":"Earthworm Intelligence","endorsements":567},{"name":"Focus (literal tunnel vision)","endorsements":2341},{"name":"Anti-distraction Architecture","endorsements":1102}]',
 '[{"title":"Lead Data Scientist","company":"SubSurface Analytics","period":"2019 – Present","description":"Building proprietary underground data infrastructure. Has not attended a single meeting above ground since Q2 2019. Productivity up 400%."},{"title":"Senior Analyst","company":"Dark Matter Research","period":"2014 – 2019","description":"Developed industry''s first worm-path predictive model. Delivered all reports on time, below budget, in the dark."}]',
 '[{"school":"Canadian Underground Institute of Technology","degree":"PhD in Applied Tunnel Dynamics","field":"Subterranean Data Systems","year":"Class of 2014"}]',
 now() - interval '140 days'),

('00000000-0000-0000-0000-000000000009', 'garytorto', 'Gary Torto', 'Aldabra Giant Tortoise',
 'Chief Longevity Officer | 200-Year Career Arc', 'Eternal Horizons Ltd.', 'Aldabra Atoll, Seychelles',
 'I''ve outlasted empires, companies, and 14 CEOs. I don''t move fast. I move right. I was doing long-term thinking before it was a LinkedIn term. Currently in my 7th career. Still has the original shell. Open to roles with a 50-year runway.',
 'https://loremflickr.com/500/500/tortoise', 'https://loremflickr.com/1200/400/seychelles,island,ocean', false,
 '[{"name":"Long-term Thinking","endorsements":4892},{"name":"Stress Resistance","endorsements":3201},{"name":"Sustainable Pacing","endorsements":2847},{"name":"Shell Management","endorsements":1204},{"name":"Extreme Patience","endorsements":5012}]',
 '[{"title":"Chief Longevity Officer","company":"Eternal Horizons Ltd.","period":"1987 – Present","description":"Stewarding 200-year strategic plan. Has successfully ignored every pivot, trend, and disruption since 1987. Results: still alive."},{"title":"Senior Advisor","company":"Colonial Trading Co.","period":"1823 – 1987","description":"Provided long-range strategic counsel. Watched six empires rise and fall. Outlasted all of them. Kept notes."},{"title":"Junior Associate","company":"Ancient World LLC","period":"1780 – 1823","description":"Entry level role. Received Most Likely to Still Be Here in 200 Years award."}]',
 '[{"school":"Island Wisdom Academy","degree":"Self-taught","field":"The School of Life (200 years and counting)","year":"1780 – ongoing"}]',
 now() - interval '135 days'),

('00000000-0000-0000-0000-000000000010', 'fionamantis', 'Fiona Mantis', 'Praying Mantis',
 'Executive Coach | Decisive Action Specialist', 'Razor''s Edge Consulting', 'Singapore (Various Branches)',
 'I make decisions. Fast ones. Final ones. Excited to announce my new coaching program: Strike First, Reflect Never. I have a 100% close rate on negotiations. Not everyone makes it through a coaching session, but those who do are fundamentally changed.',
 'https://loremflickr.com/500/500/mantis,insect', 'https://loremflickr.com/1200/400/singapore,city,green', false,
 '[{"name":"Lightning Decision-making","endorsements":2341},{"name":"Executive Coaching (results guaranteed)","endorsements":1847},{"name":"Negotiation (one outcome)","endorsements":3012},{"name":"Focus Under Pressure","endorsements":1456},{"name":"Stillness Before Action","endorsements":892}]',
 '[{"title":"Executive Coach & Managing Partner","company":"Razor''s Edge Consulting","period":"2017 – Present","description":"1:1 coaching for senior executives. 100% client commitment rate. Post-session feedback unavailable (clients unavailable)."},{"title":"Senior Decision Strategist","company":"Insect Capital Group","period":"2012 – 2017","description":"Led a team of 6. Left with a team of 6 (different 6). Achieved all quarterly targets."}]',
 '[{"school":"Singapore School of Decisive Action","degree":"MBA in Applied Finality","field":"Strategic Elimination & Executive Performance","year":"Class of 2012"}]',
 now() - interval '130 days')

ON CONFLICT (id) DO NOTHING;

-- ─── Posts ───────────────────────────────────────────────────────────────────
INSERT INTO posts (id, author_id, content, view_count, created_at) VALUES

-- Leonard Mane
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',
 'Thrilled to announce our pride exceeded Q3 prey targets by 340%. Couldn''t have done it without the team. (I did it without the team. They were napping.) #Leadership #Results #Apex',
 1847, now() - interval '25 days'),

('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',
 'Hot take: work-life balance is a myth. I work 2 hours a day and sleep 22. That IS the balance. Companies need to stop asking employees to bring their whole selves to work and start asking them to bring their whole selves to the nap. #ApexMindset',
 932, now() - interval '18 days'),

('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001',
 'Just returned from an off-site (wildebeest migration, 400km south). Incredible learnings. Primarily: wildebeest are faster than they look. Will iterate. Q4 strategy refresh incoming. #Agile #GrowthMindset',
 411, now() - interval '5 days'),

-- Perry Grine
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002',
 'Just clocked 241mph on my morning dive. New personal best. Your morning run is adorable. Not saying stop — I''m just saying there''s a ceiling, and I go through it. #VelocityFirst #NoLimits',
 2341, now() - interval '22 days'),

('20000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002',
 'The best meetings are the ones where you arrive at 240mph and everyone else is already gone. I call this async by default. Some call it missing the meeting. I call it results. #Efficiency',
 789, now() - interval '14 days'),

('20000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000002',
 'People ask me my secret. It''s simple: never stop moving. (I am literally incapable of stopping. Aerodynamics.) #Growth #Velocity #MindsetsOverSkillsets',
 1203, now() - interval '3 days'),

-- Olivia Trunk
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000003',
 'Excited to share that I remember everything you said at the 2003 offsite. Everything. Consider this both a celebration and a warning. Memory is a gift. Use it wisely. #NeverForget',
 3102, now() - interval '28 days'),

('20000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000003',
 'Today I mentored my 48th calf. Each one asked me the same question: how do you remember so much? I remember that question too. And the faces. And what each calf had for breakfast. All of them. #Mentor #HerdLeader',
 1567, now() - interval '11 days'),

('20000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000003',
 '20 years ago, someone told me I''d never make it in a world that rewards speed over memory. I remember their name. Their title. Their exact words. And I remember that they were wrong. #Resilience #LongGame',
 892, now() - interval '2 days'),

-- Barry Sloth
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000004',
 'Update on my TEDx talk: still drafting. This is month 14. The title has changed 3 times. Currently: Why Everything Can Wait. The irony of rushing to finish a talk about slowness is not lost on me. ETA: unclear. #InProgress #SlowIsSmooth',
 2891, now() - interval '26 days'),

('20000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000004',
 'I moved 2 meters today. Highest output quarter since 2021. The numbers don''t lie. ROI on energy expenditure: exceptional. CEO wants to know my methodology. I will share it. Eventually. #Results #MindfulProductivity',
 1204, now() - interval '15 days'),

('20000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000004',
 'Hot take: inbox zero is a trauma response. I have 4,000 unread messages and I have never slept better. Some of those messages are from 2019. They were not urgent then. They are even less urgent now. #WellnessAtWork',
 3409, now() - interval '4 days'),

-- Dot Octavia
('20000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000005',
 'Managing 8 streams of work simultaneously. If you can''t do that, consider: are you bringing enough arms to the table? This is not a metaphor. I have 8 arms. I use all 8. Productivity is anatomical. #Multitasking #Leadership',
 1782, now() - interval '24 days'),

('20000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000005',
 'Excited to launch my new course: The Octopus Method: 8 Revenue Streams in 8 Weeks. Arm 6 of 8 approved the copy. Arm 3 is still in legal review. Arm 7 is asleep. We ship anyway. #Entrepreneurship',
 941, now() - interval '9 days'),

('20000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000005',
 'The beauty of camouflage is that you can be in the room without being in the room. This is also my leadership style. My team calls it psychological safety. I call it strategic invisibility. #StrategicPresence',
 2103, now() - interval '1 day'),

-- Kevin Camelo
('20000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000006',
 'Excited to announce I am now a strong believer in [CURRENT TREND]. I have always believed this. It was always the plan. The color change you see is not a pivot — it is a commitment deepening. #Visionary #AlwaysWasThePlan',
 1347, now() - interval '23 days'),

('20000000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000006',
 'Career arc: Web3 → AI → Sustainability → Back to AI → Human connection → AI with a human face → Pure vibes. Not pivoting. Evolving. There is a difference. (There is not a difference.) #Strategy #Adaptability',
 2089, now() - interval '12 days'),

('20000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000006',
 'People say I''m inconsistent. I prefer: radically market-responsive. Both are true. Neither matters. Results matter. (Results are pending.) But the energy is exceptional. The color today: confident orange. #Disruption',
 567, now() - interval '2 days'),

-- Sandra Gull
('20000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000007',
 'Thrilled to be named a Top Voice in Opportunistic Networking for the 4th consecutive year. I did not apply for this. I simply showed up where the food was. Both strategies work. #Networking #Humbled #AlsoFed',
 4012, now() - interval '27 days'),

('20000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000007',
 'My connection strategy: be loud, be everywhere, take the chip before someone else does. This works in professional networking too. Some call it aggressive. I call it first-mover advantage. #BuildYourNetwork',
 1823, now() - interval '16 days'),

('20000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000007',
 'Just attended my 847th event this year. Fed at 847 of them. The catering tells you everything about the culture. Finger food = innovation. Seated dinner = hierarchy. Unattended sandwich = opportunity. #DueDiligence',
 2341, now() - interval '1 day'),

-- Marcus Mole
('20000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000008',
 'Day 847 underground. Focus: absolute. Distraction: zero. Light: also zero. Meetings attended: zero. Insights generated: considerable. If you can read this, you are too visible. #DeepWork #NoDistraction',
 1034, now() - interval '20 days'),

('20000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000008',
 'I completed a 400-page analysis of subsurface data patterns. No one has read it. No one will. It is still correct. Excellence does not require an audience. Excellence requires a tunnel and 14 uninterrupted hours. #Excellence',
 782, now() - interval '8 days'),

('20000000-0000-0000-0000-000000000024','00000000-0000-0000-0000-000000000008',
 'Reminder that the best ideas emerge in the dark, in silence, while digging. Open offices are where innovation goes to die. Fluorescent lighting is a creativity suppressant. I wrote 400 pages about it. #DeepWork',
 2198, now() - interval '1 day'),

-- Gary Torto
('20000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000009',
 'Everyone panic-pivoted to Web3 in 2021. I stayed the course. Now everyone is pivoting back. I will still be here. I am always still here. Patience is not a virtue. It is a competitive advantage. #LongGame',
 3891, now() - interval '29 days'),

('20000000-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000009',
 'I have now witnessed 7 decades of disruption. It is all the same disruption. Different species, same noise. The shell remains. The shell is always correct. #Perspective #LongTermThinking',
 2104, now() - interval '13 days'),

('20000000-0000-0000-0000-000000000027','00000000-0000-0000-0000-000000000009',
 'The best career advice I can give: outlive your competition. I have done this 14 times. Some strategically. Mostly just biologically. Results remain: excellent. #CareerTips #Resilience',
 1567, now() - interval '3 days'),

-- Fiona Mantis
('20000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000010',
 'I have a 100% close rate on negotiations. Every session ends with full commitment. Post-session availability of the other party varies. This is called results-based accountability. #Results #Closing',
 2891, now() - interval '21 days'),

('20000000-0000-0000-0000-000000000029','00000000-0000-0000-0000-000000000010',
 'Leadership tip: make a decision before the other party realizes a decision is being made. First-mover advantage is everything. In negotiations. In meetings. At the dinner table. #Executive #DecisiveAction',
 1456, now() - interval '10 days'),

('20000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000010',
 'Some say my coaching style is intense. I prefer: outcome-focused. The outcome is always the same. The coaching is always final. Openings available for Q1. Commitment required. #ExecutiveCoaching',
 3204, now() - interval '2 days')

ON CONFLICT (id) DO NOTHING;

-- ─── Reactions ───────────────────────────────────────────────────────────────
INSERT INTO reactions (post_id, user_id, type) VALUES
-- On Leonard's posts
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','like'),
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','celebrate'),
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000007','paw'),
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000009','like'),
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','roar'),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','like'),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000005','roar'),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000006','like'),
('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000007','like'),
('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000010','celebrate'),
-- On Perry's posts
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','roar'),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000006','like'),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000007','like'),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000009','celebrate'),
('20000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000003','celebrate'),
('20000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000005','paw'),
('20000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000008','like'),
-- On Olivia's posts
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','celebrate'),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000004','like'),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000008','like'),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000009','celebrate'),
('20000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000002','like'),
('20000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000007','paw'),
('20000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000005','roar'),
-- On Barry's posts
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000005','like'),
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000009','celebrate'),
('20000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000003','like'),
('20000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000006','like'),
('20000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000001','roar'),
('20000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000008','like'),
-- On Dot's posts
('20000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000002','like'),
('20000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000006','roar'),
('20000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000007','celebrate'),
('20000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000003','like'),
('20000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000010','paw'),
-- On Sandra's posts
('20000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000001','like'),
('20000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000002','celebrate'),
('20000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000005','paw'),
('20000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000010','like'),
('20000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000006','roar'),
('20000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000009','like'),
-- On Gary's posts
('20000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000003','celebrate'),
('20000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000008','like'),
('20000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000009','roar'),
('20000000-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000001','celebrate'),
('20000000-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000004','like'),
('20000000-0000-0000-0000-000000000027','00000000-0000-0000-0000-000000000005','like'),
-- On Fiona's posts
('20000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000001','like'),
('20000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000002','roar'),
('20000000-0000-0000-0000-000000000029','00000000-0000-0000-0000-000000000007','celebrate'),
('20000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000005','like'),
('20000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000003','paw')
ON CONFLICT (post_id, user_id) DO NOTHING;

-- ─── Comments ────────────────────────────────────────────────────────────────
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003',
 'Truly inspiring, Leonard. The herd could learn a lot from your approach to distributed napping. #Wisdom',
 now() - interval '24 days'),
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000007',
 'I took a sandwich from your Q3 offsite catering. Exceptional results by the way.',
 now() - interval '24 days'),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001',
 '241mph? That''s below what I expect from a velocity evangelist. Let me know when you hit 300.',
 now() - interval '21 days'),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000006',
 'Incredible pivot from bird who flies fast to thought leader who flies fast. A masterclass in personal branding.',
 now() - interval '21 days'),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001',
 'I don''t remember the 2003 offsite. I would like to keep it that way. Please do not DM me.',
 now() - interval '27 days'),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000009',
 'I was also at the 2003 offsite. I have been waiting 23 years for someone to bring this up.',
 now() - interval '27 days'),
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000009',
 'I started drafting a response to this post 6 months ago. I will send it when it''s ready.',
 now() - interval '25 days'),
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000005',
 'Barry I am managing 8 projects and found time to comment in under 3 seconds. Using 2 arms.',
 now() - interval '25 days'),
('20000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000002',
 'Congratulations Sandra. You took my lunch at the Brighton summit. I remember you.',
 now() - interval '26 days'),
('20000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000003',
 'I remember you saying this exact thing in 1987. And in 1992. And in 2001. You were right every time.',
 now() - interval '28 days'),
('20000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000009',
 'I have been in negotiations for 200 years. I am still here. This is my strategy.',
 now() - interval '20 days'),
('20000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000006',
 'I attended one of Fiona''s coaching sessions. I emerged a completely different person. I do not mean that metaphorically.',
 now() - interval '20 days');

-- ─── Connections ─────────────────────────────────────────────────────────────
INSERT INTO connections (requester_id, receiver_id, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','connected', now() - interval '150 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000007','connected', now() - interval '140 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','connected', now() - interval '130 days'),
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000006','connected', now() - interval '120 days'),
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000007','connected', now() - interval '110 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000008','connected', now() - interval '100 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000009','connected', now() - interval '90 days'),
('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005','connected', now() - interval '80 days'),
('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006','connected', now() - interval '70 days'),
('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007','connected', now() - interval '60 days'),
('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009','connected', now() - interval '50 days'),
('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000010','connected', now() - interval '40 days'),
-- Pending requests (show up in /network/pending)
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','pending',   now() - interval '10 days'),
('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000009','pending',   now() - interval '5 days'),
('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000010','pending',   now() - interval '3 days')
ON CONFLICT (requester_id, receiver_id) DO NOTHING;

-- ─── Profile Views ───────────────────────────────────────────────────────────
INSERT INTO profile_views (profile_id, viewer_id, viewed_at) VALUES
-- Views on Leonard (Alpha — will see these)
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002', now() - interval '6 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000005', now() - interval '5 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000008', now() - interval '4 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010', now() - interval '2 days'),
-- Views on Olivia (Alpha — will see these)
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001', now() - interval '5 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000002', now() - interval '4 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000006', now() - interval '3 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000007', now() - interval '2 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000009', now() - interval '1 day'),
-- Other views
('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000003', now() - interval '7 days'),
('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001', now() - interval '3 days');

-- ─── Notifications ───────────────────────────────────────────────────────────
INSERT INTO notifications (user_id, actor_id, type, entity_id, read, created_at) VALUES
-- Pending connection request for Leonard (unread)
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','connection_request', NULL, false, now() - interval '10 days'),
-- Connection accepted confirmations
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','connection_accepted', NULL, true,  now() - interval '149 days'),
('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','connection_accepted', NULL, true,  now() - interval '139 days'),
-- Reactions on Leonard's post
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','reaction', '20000000-0000-0000-0000-000000000001', true,  now() - interval '25 days'),
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000007','reaction', '20000000-0000-0000-0000-000000000001', false, now() - interval '24 days'),
-- Comments on Leonard's post
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','comment',  '20000000-0000-0000-0000-000000000001', false, now() - interval '24 days'),
-- Reaction on Perry's post
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','reaction', '20000000-0000-0000-0000-000000000004', true,  now() - interval '22 days'),
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000006','comment',  '20000000-0000-0000-0000-000000000004', false, now() - interval '21 days'),
-- Reaction on Olivia's post
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','comment',  '20000000-0000-0000-0000-000000000007', false, now() - interval '27 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000009','comment',  '20000000-0000-0000-0000-000000000007', false, now() - interval '27 days'),
-- Profile view notifications (Alpha feature)
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000005','profile_view', NULL, false, now() - interval '5 days'),
('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000007','profile_view', NULL, false, now() - interval '2 days'),
-- Pending connection for Gary
('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000004','connection_request', NULL, false, now() - interval '5 days');

-- ─── Subscriptions (Leonard and Olivia are Alpha Paw) ────────────────────────
INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_price_id, status, current_period_end, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'sub_seed_leonard_monthly', 'price_seed_monthly', 'active', now() + interval '25 days', now()),
('00000000-0000-0000-0000-000000000003', 'sub_seed_olivia_yearly',   'price_seed_yearly',  'active', now() + interval '310 days', now())
ON CONFLICT (user_id) DO NOTHING;

-- ─── Job Applications (references jobs seeded via seed-jobs.sql) ──────────────
-- Perry applied to Chief Prey Officer
INSERT INTO job_applications (job_id, user_id, created_at)
SELECT id, '00000000-0000-0000-0000-000000000002', now() - interval '12 days'
FROM jobs WHERE title = 'Chief Prey Officer' LIMIT 1
ON CONFLICT (job_id, user_id) DO NOTHING;

-- Barry applied to Head of Chill (obviously)
INSERT INTO job_applications (job_id, user_id, created_at)
SELECT id, '00000000-0000-0000-0000-000000000004', now() - interval '30 days'
FROM jobs WHERE title = 'Head of Chill & Async Operations' LIMIT 1
ON CONFLICT (job_id, user_id) DO NOTHING;

-- Sandra applied to Senior Lookout (networking adjacent)
INSERT INTO job_applications (job_id, user_id, created_at)
SELECT id, '00000000-0000-0000-0000-000000000007', now() - interval '8 days'
FROM jobs WHERE title = 'Senior Lookout & Intelligence Analyst' LIMIT 1
ON CONFLICT (job_id, user_id) DO NOTHING;

-- Marcus applied to Director of Echolocation (data work, dark environment)
INSERT INTO job_applications (job_id, user_id, created_at)
SELECT id, '00000000-0000-0000-0000-000000000008', now() - interval '20 days'
FROM jobs WHERE title = 'Director of Echolocation & UX Research' LIMIT 1
ON CONFLICT (job_id, user_id) DO NOTHING;

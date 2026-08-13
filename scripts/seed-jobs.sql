-- LinkedPaw — seed jobs
-- Run this in the Supabase SQL editor (service role bypasses RLS)
-- Replace YOUR_USER_UUID with your actual Supabase auth user ID if you want posted_by set.
-- Otherwise leave as NULL — jobs will still appear but won't show a poster card.

INSERT INTO jobs (title, company, location, description, requirements, salary, species_tag, posted_by) VALUES

('Chief Prey Officer',
 'Savanna Dynamics LLC',
 'Serengeti, Tanzania',
 'Savanna Dynamics is hiring a visionary Chief Prey Officer to own our end-to-end prey acquisition lifecycle. The ideal candidate has led high-performance ambush teams, delivered against quarterly migration targets, and can nap for 14 hours while maintaining full strategic awareness.

You will report directly to the CEO and occasionally be the CEO. This is a high-impact, high-visibility, high-decibel role. Our culture is high-performance, high-rest, and low-sharing.',
 ARRAY['5+ years ambush strategy experience with measurable prey conversion rates','Demonstrated ability to lead a cross-functional pride of 8–15 individuals','Comfortable operating in unstructured, open-plan environments (the savanna)','Strong stakeholder management — specifically hyenas, jackals, and circling vultures','Sprint speed of 80km/h minimum (will be tested at interview)'],
 '340kg wildebeest/month + territory equity + relocation package if prey moves',
 'Lion',
 NULL),

('VP of Velocity & Aerial Operations',
 'AirOps Global',
 'Cliffside HQ, Norway',
 'AirOps Global is looking for a VP of Velocity to scale our dive operations from 200mph to 240mph+ within 18 months. You will own the full aerial hunting lifecycle — from thermal identification to point-of-impact delivery.

Our culture is velocity-first: if you are not in the air, you are already behind.',
 ARRAY['Certified dive speed of 200mph or above (IATA certification accepted)','Proven thermal column identification and utilisation at altitude','Experience leading cross-species aerial pursuit teams of 4+','Comfort operating in "fail fast, impact faster" environments'],
 'Uncapped fish + quarterly altitude bonuses',
 'Peregrine Falcon',
 NULL),

('Head of Chill & Async Operations',
 'Slothful Technologies',
 'Rainforest Campus, Costa Rica',
 'We are looking for a Head of Chill to define our asynchronous-first culture. This is a role for someone who understands that slow is smooth, smooth is productive, and productivity is a capitalist construct. Zero meetings. No standups. Ever.',
 ARRAY['Ability to hang upside down for extended periods without losing focus','Proficient in at least one async communication tool (blinking counts)','Demonstrably minimal cortisol levels (bloodwork required)','Commitment to 18-hour sleep cycles as a feature, not a bug'],
 '3 leaves/day + unlimited PTO (we don''t track it, we don''t believe in it)',
 'Sloth',
 NULL),

('Senior Lookout & Intelligence Analyst',
 'Meerkat Mutual',
 'Kalahari Desert, Botswana',
 'Meerkat Mutual is seeking a Senior Lookout to join our threat intelligence division. You will be responsible for 360-degree situational awareness, predator pattern recognition, and alarm call optimisation.',
 ARRAY['5+ years standing upright on hind legs (portfolio required)','Fluent in at least 3 alarm call dialects','Demonstrated ability to rotate head 180 degrees without losing situational awareness','Previous experience surviving a hawk attack is a plus'],
 'Scorpion stipend + burrow equity after 90 days',
 'Meerkat',
 NULL),

('Director of Echolocation & UX Research',
 'DeepThink Labs',
 'Mediterranean Sea (Remote-First)',
 'DeepThink Labs is hiring a Director of Echolocation to lead our sonar-driven user research practice. You will translate complex acoustic data into actionable product insights and mentor a team of junior click-pattern analysts.',
 ARRAY['10+ years echolocation experience in open-water environments','Proficient in click, burst-pulse, and whistle communication','Prior experience conducting user interviews at depths of 200m+','Strong cross-species collaboration skills (we work with orcas, it is complicated)'],
 'Competitive fish package + relocation to any ocean of your choice',
 'Dolphin',
 NULL);

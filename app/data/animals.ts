export type Skill = {
  name: string;
  endorsements: number;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  year: string;
};

export type Animal = {
  id: number;
  name: string;
  species: string;
  title: string;
  company: string;
  location: string;
  connections: number;
  photo: string;
  about: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
};

export const animals: Animal[] = [
  {
    id: 1,
    name: "Leonard Mane",
    species: "Lion",
    title: "Chief Hunting Officer & Pride Lead",
    company: "Savanna Dynamics LLC",
    location: "Serengeti, Tanzania",
    connections: 1204,
    photo: "https://loremflickr.com/500/500/lion",
    about:
      "Passionate about territory growth and high-performance hunting. I didn't get to the top of the food chain by accident — it took grit, vision, and 14 hours of sleep a day. Open to strategic alliances. Not a team player (lions don't do teams, we do prides). #Leadership #Apex #GrowthMindset",
    skills: [
      { name: "Pack Leadership", endorsements: 247 },
      { name: "Strategic Ambushing", endorsements: 189 },
      { name: "Roaring", endorsements: 312 },
      { name: "Napping", endorsements: 428 },
      { name: "Intimidation", endorsements: 203 },
    ],
    experience: [
      {
        title: "Chief Hunting Officer",
        company: "Savanna Dynamics LLC",
        period: "2018 – Present",
        description:
          "Led cross-functional pride of 12 to exceed quarterly prey targets by 340%. Pioneered the 'ambush-then-nap' agile methodology. Managed a $0 budget (territory is wealth).",
      },
      {
        title: "Senior Hunter",
        company: "Maasai Mara Ventures",
        period: "2013 – 2018",
        description:
          "Individual contributor driving end-to-end hunt lifecycle. Promoted to Senior after successfully rebranding 'being chased off a kill by hyenas' as 'strategic resource redistribution.'",
      },
      {
        title: "Junior Pride Associate",
        company: "East Africa Corp.",
        period: "2009 – 2013",
        description:
          "Foundational role building core competencies in sitting, staring, and looking majestic. Received 'Most Likely to Take Credit for Others' Work' award two years running.",
      },
    ],
    education: [
      {
        school: "Serengeti School of Hard Knocks",
        degree: "Bachelor of Applied Predation",
        field: "Ambush Strategy & Pride Management",
        year: "Class of 2009",
      },
      {
        school: "Ngorongoro Executive Institute",
        degree: "Executive Leadership Certificate",
        field: "Roaring & Territorial Expansion",
        year: "2015",
      },
    ],
  },
  {
    id: 2,
    name: "Perry Grine",
    species: "Peregrine Falcon",
    title: "VP of Velocity | Speed Evangelist",
    company: "AirOps Global",
    location: "Cliffside HQ, Norway",
    connections: 3401,
    photo: "https://loremflickr.com/500/500/falcon",
    about:
      "240mph isn't a skill, it's a mindset. I've disrupted the aerial predator space and I'm just getting started. Excited to announce I've been nominated for Forbes' Under-30 (in falcon years that's under 4). Let's connect and fly higher — together. 🦅",
    skills: [
      { name: "Hypersonic Diving", endorsements: 891 },
      { name: "Aerial Agility", endorsements: 567 },
      { name: "Disruption", endorsements: 1204 },
      { name: "Networking", endorsements: 445 },
      { name: "Vision (literally 8x human)", endorsements: 302 },
    ],
    experience: [
      {
        title: "VP of Velocity",
        company: "AirOps Global",
        period: "2020 – Present",
        description:
          "Scaled dive operations from 180mph to industry-leading 240mph in under 18 months. Coined the term 'velocity-first culture' and put it on every slide deck.",
      },
      {
        title: "Head of Airspace Strategy",
        company: "ThermalRise Inc.",
        period: "2017 – 2020",
        description:
          "Owned full-funnel prey acquisition from 1,000ft+ altitude. Built a culture of radical transparency (everyone can see you coming from a mile up).",
      },
      {
        title: "Freelance Disruptor",
        company: "Self-Employed",
        period: "2015 – 2017",
        description:
          "Serial disruptee of pigeon commutes. Consulted for several cliff-face startups. Available for keynotes on 'Failure is Just Gravity.'",
      },
    ],
    education: [
      {
        school: "British Isles Avian Academy",
        degree: "BSc in Aerodynamics",
        field: "Applied Velocity Studies",
        year: "Class of 2015",
      },
    ],
  },
  {
    id: 3,
    name: "Olivia Trunk",
    species: "Elephant",
    title: "Memory Architect | Community Builder",
    company: "Savanna Remembers Co.",
    location: "Amboseli, Kenya",
    connections: 9999,
    photo: "https://loremflickr.com/500/500/elephant",
    about:
      "They say elephants never forget — and neither do I, especially not those who doubted me. 20 years in the industry. Mentor to 47 calves. I believe the herd rises together. Thrilled to share that our watering hole is up 300% YoY. Humbled and grateful. 🐘 #NeverForget #HerdLeader",
    skills: [
      { name: "Long-term Memory", endorsements: 2847 },
      { name: "Herd Management", endorsements: 1932 },
      { name: "Water Sourcing", endorsements: 1456 },
      { name: "Emotional Intelligence", endorsements: 3201 },
      { name: "Trunk Multitasking", endorsements: 879 },
    ],
    experience: [
      {
        title: "Memory Architect",
        company: "Savanna Remembers Co.",
        period: "2004 – Present",
        description:
          "Chief custodian of 87 years of institutional knowledge. Led herd through 3 droughts and 2 regime changes. Still remembers the 2003 offsite. All of it.",
      },
      {
        title: "Senior Matriarch",
        company: "Great Rift Valley Partners",
        period: "1998 – 2004",
        description:
          "Guided cross-species coalition building initiatives. Introduced the 'Memory as Competitive Advantage' framework. Won matriarch of the year 5 consecutive times.",
      },
    ],
    education: [
      {
        school: "Mount Kilimanjaro School of Wisdom",
        degree: "Masters of Applied Memory",
        field: "Generational Knowledge Transfer",
        year: "Class of 1998",
      },
      {
        school: "Amboseli Community College",
        degree: "Certificate in Water Divination",
        field: "Resource Identification in Arid Conditions",
        year: "1995",
      },
    ],
  },
  {
    id: 4,
    name: "Barry Sloth",
    species: "Three-toed Sloth",
    title: "Mindfulness Strategist | Slow Living Advocate",
    company: "Still Waters Consulting",
    location: "Costa Rica Canopy District",
    connections: 612,
    photo: "https://loremflickr.com/500/500/sloth",
    about:
      "Taking a mindful pause. It's not laziness — it's strategic stillness. I've been hanging from the same branch for 6 months and I've never felt more productive. Excited to announce I've almost finished my TEDx draft. ETA: 18 months. #Wellness #SlowIsSmooth #StrategicPause",
    skills: [
      { name: "Strategic Stillness", endorsements: 342 },
      { name: "Deep Rest", endorsements: 891 },
      { name: "Deliberate Hanging", endorsements: 127 },
      { name: "Algae Cultivation (passive)", endorsements: 63 },
      { name: "Mindful Digestion", endorsements: 218 },
    ],
    experience: [
      {
        title: "Chief Stillness Officer",
        company: "Still Waters Consulting",
        period: "2019 – Present",
        description:
          "Providing strategic counsel on the transformative power of doing less. Currently in month 6 of a 'listening tour' (still on branch 1).",
      },
      {
        title: "Senior Wellness Strategist",
        company: "Amazon Canopy Co.",
        period: "2014 – 2019",
        description:
          "Spearheaded the company's first 'Slowness as Service' offering. Reduced meeting velocity by 94%. Attendance at those meetings: also reduced.",
      },
    ],
    education: [
      {
        school: "University of the Rainforest",
        degree: "BA in Applied Inertia",
        field: "Mindfulness & Canopy Studies",
        year: "Class of 2014",
      },
    ],
  },
  {
    id: 5,
    name: "Dot Octavia",
    species: "Common Octopus",
    title: "Chief Multi-tasking Officer | 8-Arm Productivity Coach",
    company: "Tentacle Dynamics",
    location: "Coral Bay, Pacific Ocean",
    connections: 5012,
    photo: "https://loremflickr.com/500/500/octopus",
    about:
      "Eight arms, one dream. While you were managing one inbox, I was managing eight. Thrilled to share my new course: 'The Octopus Framework: 8 Arms, 8 Revenue Streams.' Also available in camouflage mode for stealth consulting. 🐙 #Productivity #Multitasking #OceanLeader",
    skills: [
      { name: "Parallel Processing", endorsements: 1847 },
      { name: "Camouflage Leadership", endorsements: 934 },
      { name: "Ink Crisis Management", endorsements: 782 },
      { name: "8-Stream Revenue Thinking", endorsements: 2109 },
      { name: "Pressure Resistance", endorsements: 1456 },
    ],
    experience: [
      {
        title: "Chief Multi-tasking Officer",
        company: "Tentacle Dynamics",
        period: "2021 – Present",
        description:
          "Managing 8 simultaneous product lines. Invented the '8-arm standup' — a daily sync that covers 8 agendas at once. No one is ever confused. (Everyone is always confused.)",
      },
      {
        title: "Head of Adaptive Strategy",
        company: "DeepBlue Labs",
        period: "2016 – 2021",
        description:
          "Pivoted the company's strategy 14 times in 5 years, each time claiming it was 'always the plan.' Won internal award for 'Most Impressive Reframe.'",
      },
    ],
    education: [
      {
        school: "Pacific Institute of Cephalopod Studies",
        degree: "MSc in Distributed Intelligence",
        field: "Multi-neural Processing & Arm Coordination",
        year: "Class of 2016",
      },
    ],
  },
  {
    id: 6,
    name: "Kevin Camelo",
    species: "Veiled Chameleon",
    title: "Adaptability Strategist | Pivot Specialist",
    company: "ChromaShift Partners",
    location: "Madagascar Innovation Hub",
    connections: 2891,
    photo: "https://loremflickr.com/500/500/chameleon",
    about:
      "I've been a Web3 evangelist, a blockchain skeptic, an AI visionary, and a 'back to basics' advocate — all in the same quarter. Some call it inconsistency. I call it Radical Adaptability™. Currently: extremely bullish on whatever you want to hear. Let's connect. 🦎",
    skills: [
      { name: "Radical Adaptability™", endorsements: 743 },
      { name: "Trend Identification (retroactive)", endorsements: 892 },
      { name: "Colour-coded Pivoting", endorsements: 1204 },
      { name: "Strategic Chameleonism", endorsements: 567 },
      { name: "360° Stakeholder Visibility", endorsements: 341 },
    ],
    experience: [
      {
        title: "Adaptability Strategist",
        company: "ChromaShift Partners",
        period: "2022 – Present",
        description:
          "Helping organizations pivot before they know they need to. Current specializations include: whatever is trending this week.",
      },
      {
        title: "Chief Transformation Officer",
        company: "Jungle Digital (formerly Jungle Blockchain, formerly Jungle AI)",
        period: "2018 – 2022",
        description:
          "Rebranded company 4 times to align with emerging trends. Net revenue unchanged. Confidence: unchanged.",
      },
    ],
    education: [
      {
        school: "Chameleon Business School",
        degree: "MBA in Strategic Ambiguity",
        field: "Trend-Surfing & Pivot Management",
        year: "Class of 2018",
      },
    ],
  },
  {
    id: 7,
    name: "Sandra Gull",
    species: "Herring Gull",
    title: "Networking Evangelist | Connector of Creatures",
    company: "CoastalReach Group",
    location: "Brighton, UK",
    connections: 8743,
    photo: "https://loremflickr.com/500/500/seagull",
    about:
      "I see an opportunity and I take it. Whether that's a chip, a connection, or a strategic partnership — I'm there. Thrilled to be named a LinkedIn Top Voice in 'Swooping.' Excited to announce I'm available for keynotes, networking events, and unattended lunches. 🐦 #Networking #OpportunityAwareness",
    skills: [
      { name: "Opportunistic Networking", endorsements: 3421 },
      { name: "Rapid Resource Acquisition", endorsements: 2109 },
      { name: "Loud Self-Promotion", endorsements: 1876 },
      { name: "Selective Listening", endorsements: 934 },
      { name: "Chip Identification at 200m", endorsements: 4012 },
    ],
    experience: [
      {
        title: "Chief Networking Officer",
        company: "CoastalReach Group",
        period: "2020 – Present",
        description:
          "Built Europe's largest seabird professional network. Maintained 8,700+ 'relationships' by reliably showing up wherever there is food.",
      },
      {
        title: "Senior Connector",
        company: "Harbour Bridge Associates",
        period: "2015 – 2020",
        description:
          "Connected 2,400 coastal professionals. Attended 847 events. Ate at 847 events. Results: exceptional.",
      },
    ],
    education: [
      {
        school: "Coastal Community University",
        degree: "BA in Social Opportunism",
        field: "Networking Theory & Applied Scavenging",
        year: "Class of 2015",
      },
    ],
  },
  {
    id: 8,
    name: "Marcus Mole",
    species: "Star-nosed Mole",
    title: "Underground Data Scientist | Deep Work Evangelist",
    company: "SubSurface Analytics",
    location: "The Deep Underground, Ontario",
    connections: 344,
    photo: "https://loremflickr.com/500/500/mole,animal",
    about:
      "While others are distracted by sunlight and social media, I've been doing real work. 0.2 seconds to identify an earthworm. That's faster than your API. I work in the dark so you don't have to. Currently finishing a 400-page treatise on dirt. DMs closed. 🌑 #DeepWork #NoDistraction",
    skills: [
      { name: "Deep Work", endorsements: 1203 },
      { name: "Subsurface Data Mining", endorsements: 892 },
      { name: "Earthworm Intelligence", endorsements: 567 },
      { name: "Focus (literal tunnel vision)", endorsements: 2341 },
      { name: "Anti-distraction Architecture", endorsements: 1102 },
    ],
    experience: [
      {
        title: "Lead Data Scientist",
        company: "SubSurface Analytics",
        period: "2019 – Present",
        description:
          "Building proprietary underground data infrastructure. Has not attended a single meeting above ground since Q2 2019. Productivity up 400%.",
      },
      {
        title: "Senior Analyst",
        company: "Dark Matter Research",
        period: "2014 – 2019",
        description:
          "Developed industry's first worm-path predictive model. Delivered all reports on time, below budget, in the dark.",
      },
    ],
    education: [
      {
        school: "Canadian Underground Institute of Technology",
        degree: "PhD in Applied Tunnel Dynamics",
        field: "Subterranean Data Systems",
        year: "Class of 2014",
      },
    ],
  },
  {
    id: 9,
    name: "Gary Torto",
    species: "Aldabra Giant Tortoise",
    title: "Chief Longevity Officer | 200-Year Career Arc",
    company: "Eternal Horizons Ltd.",
    location: "Aldabra Atoll, Seychelles",
    connections: 127,
    photo: "https://loremflickr.com/500/500/tortoise",
    about:
      "I've outlasted empires, companies, and 14 CEOs. I don't move fast. I move right. I was doing 'long-term thinking' before it was a LinkedIn term. Currently in my 7th career. Still has the original shell. Open to roles with a 50-year runway. #LongTermThinking #Resilience #Sustainable",
    skills: [
      { name: "Long-term Thinking", endorsements: 4892 },
      { name: "Stress Resistance", endorsements: 3201 },
      { name: "Sustainable Pacing", endorsements: 2847 },
      { name: "Shell Management", endorsements: 1204 },
      { name: "Extreme Patience", endorsements: 5012 },
    ],
    experience: [
      {
        title: "Chief Longevity Officer",
        company: "Eternal Horizons Ltd.",
        period: "1987 – Present",
        description:
          "Stewarding 200-year strategic plan. Has successfully ignored every pivot, trend, and disruption since 1987. Results: still alive.",
      },
      {
        title: "Senior Advisor",
        company: "Colonial Trading Co.",
        period: "1823 – 1987",
        description:
          "Provided long-range strategic counsel. Watched six empires rise and fall. Outlasted all of them. Kept notes.",
      },
      {
        title: "Junior Associate",
        company: "Ancient World LLC",
        period: "1780 – 1823",
        description:
          "Entry level role. Learned to walk, eat, and be extremely patient. Received 'Most Likely to Still Be Here in 200 Years' award.",
      },
    ],
    education: [
      {
        school: "Island Wisdom Academy",
        degree: "Self-taught",
        field: "The School of Life (200 years and counting)",
        year: "1780 – ongoing",
      },
    ],
  },
  {
    id: 10,
    name: "Fiona Mantis",
    species: "Praying Mantis",
    title: "Executive Coach | Decisive Action Specialist",
    company: "Razor's Edge Consulting",
    location: "Singapore (Various Branches)",
    connections: 1876,
    photo: "https://loremflickr.com/500/500/mantis,insect",
    about:
      "I make decisions. Fast ones. Final ones. Excited to announce my new coaching program: 'Strike First, Reflect Never.' I have a 100% close rate on negotiations. Not everyone makes it through a coaching session, but those who do are fundamentally changed. 🙏 #Executive #Decisive #Leadership",
    skills: [
      { name: "Lightning Decision-making", endorsements: 2341 },
      { name: "Executive Coaching (results guaranteed)", endorsements: 1847 },
      { name: "Negotiation (one outcome)", endorsements: 3012 },
      { name: "Focus Under Pressure", endorsements: 1456 },
      { name: "Stillness Before Action", endorsements: 892 },
    ],
    experience: [
      {
        title: "Executive Coach & Managing Partner",
        company: "Razor's Edge Consulting",
        period: "2017 – Present",
        description:
          "1:1 coaching for senior executives. 100% client commitment rate. Post-session feedback unavailable (clients unavailable).",
      },
      {
        title: "Senior Decision Strategist",
        company: "Insect Capital Group",
        period: "2012 – 2017",
        description:
          "Led a team of 6. Left with a team of 6 (different 6). Achieved all quarterly targets.",
      },
    ],
    education: [
      {
        school: "Singapore School of Decisive Action",
        degree: "MBA in Applied Finality",
        field: "Strategic Elimination & Executive Performance",
        year: "Class of 2012",
      },
    ],
  },
];

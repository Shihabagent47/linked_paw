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
  skills: string[];
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
    about: "Passionate about territory growth and high-performance hunting. I didn't get to the top of the food chain by accident — it took grit, vision, and 14 hours of sleep a day. Open to strategic alliances. Not a team player (lions don't do teams, we do prides). #Leadership #Apex #GrowthMindset",
    skills: ["Pack Leadership", "Strategic Ambushing", "Roaring", "Napping", "Intimidation"],
  },
  {
    id: 2,
    name: "Perry Grine",
    species: "Peregrine Falcon",
    title: "VP of Velocity | Speed Evangelist",
    company: "AirOps Global",
    location: "Cliffside HQ, Norway",
    connections: 3401,
    photo: "https://loremflickr.com/500/500/peregrine,falcon",
    about: "240mph isn't a skill, it's a mindset. I've disrupted the aerial predator space and I'm just getting started. Excited to announce I've been nominated for Forbes' Under-30 (in falcon years that's under 4). Let's connect and fly higher — together. 🦅",
    skills: ["Hypersonic Diving", "Aerial Agility", "Disruption", "Networking", "Vision (literally 8x human)"],
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
    about: "They say elephants never forget — and neither do I, especially not those who doubted me. 20 years in the industry. Mentor to 47 calves. I believe the herd rises together. Thrilled to share that our watering hole is up 300% YoY. Humbled and grateful. 🐘 #NeverForget #HerdLeader",
    skills: ["Long-term Memory", "Herd Management", "Water Sourcing", "Emotional Intelligence", "Trunk Multitasking"],
  },
];

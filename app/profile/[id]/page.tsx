import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { animals, type Animal, type Experience, type Education, type Skill } from '@/app/data/animals';
import { ME } from '@/app/lib/constants';

const BANNER_GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-emerald-400 to-green-600',
  'from-teal-400 to-cyan-600',
  'from-lime-400 to-green-500',
  'from-sky-400 to-blue-500',
  'from-stone-500 to-gray-700',
  'from-yellow-400 to-amber-500',
  'from-green-400 to-emerald-600',
];

export async function generateStaticParams() {
  return animals.map((a) => ({ id: String(a.id) }));
}

function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section className="bg-white rounded-lg border border-[#e0dfdc] p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Experience</h2>
      <div className="space-y-5">
        {experience.map((job, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-lg">
              🏢
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{job.title}</p>
              <p className="text-sm text-gray-700">{job.company}</p>
              <p className="text-xs text-gray-500 mt-0.5">{job.period}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ education }: { education: Education[] }) {
  return (
    <section className="bg-white rounded-lg border border-[#e0dfdc] p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Education</h2>
      <div className="space-y-5">
        {education.map((edu, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-lg">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{edu.school}</p>
              <p className="text-sm text-gray-700">{edu.degree}</p>
              <p className="text-xs text-gray-500 mt-0.5">{edu.field}</p>
              <p className="text-xs text-gray-400 mt-0.5">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <section className="bg-white rounded-lg border border-[#e0dfdc] p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Skills & Endorsements</h2>
      <div className="divide-y divide-gray-100">
        {skills.map((skill) => (
          <div key={skill.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{skill.name}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-[#0a66c2]">👍</span>
              <span className="text-xs font-semibold text-[#0a66c2]">{skill.endorsements.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PeopleAlsoViewed({ current }: { current: Animal }) {
  const suggestions = animals.filter((a) => a.id !== current.id).slice(0, 4);
  return (
    <aside className="w-[280px] shrink-0 space-y-2">
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Animals also viewed</h2>
        <div className="divide-y divide-gray-100">
          {suggestions.map((animal) => (
            <Link
              key={animal.id}
              href={`/profile/${animal.id}`}
              className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 -mx-1 px-1 rounded transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <Image src={animal.photo} alt={animal.name} fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate hover:underline">{animal.name}</p>
                <p className="text-xs text-gray-500 leading-snug line-clamp-2">{animal.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e0dfdc] p-4">
        <p className="text-xs font-semibold text-amber-700 mb-1">✨ PawPremium</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          See who&apos;s been sniffing this profile. 47 creatures viewed it this week.
        </p>
        <button className="mt-2 w-full text-xs font-semibold text-amber-700 border border-amber-400 rounded-full py-1 hover:bg-amber-50 transition-colors">
          Unlock insights — just a gazelle
        </button>
      </div>
    </aside>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = animals.find((a) => a.id === Number(id));
  if (!animal) notFound();

  const isMe = animal.id === ME.id;
  const bannerClass = BANNER_GRADIENTS[(animal.id - 1) % BANNER_GRADIENTS.length];

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          {/* Main profile content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Profile header card */}
            <div className="bg-white rounded-lg border border-[#e0dfdc] overflow-hidden">
              {/* Banner */}
              <div className={`h-32 bg-gradient-to-r ${bannerClass}`} />

              {/* Avatar + info */}
              <div className="px-5 pb-5">
                <div className="flex items-end justify-between -mt-12 mb-3">
                  <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shrink-0 shadow">
                    <Image
                      src={animal.photo}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex gap-2 pb-1">
                    {isMe ? (
                      <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 transition-colors">
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button className="text-sm font-semibold bg-[#0a66c2] text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors">
                          Connect
                        </button>
                        <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 transition-colors">
                          Message
                        </button>
                        <button className="text-sm font-semibold text-gray-600 border border-gray-400 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
                          More
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">{animal.name}</h1>
                  <p className="text-base text-gray-800 mt-0.5">{animal.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {animal.company} · {animal.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold text-[#0a66c2]">
                      {animal.connections >= 500 ? '500+' : animal.connections} connections
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {animal.species}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
                    ✨ PawPremium
                  </span>
                  <span className="text-xs text-gray-400">Open to: Strategic Partnerships, Territory Expansions</span>
                </div>
              </div>
            </div>

            {/* About */}
            <section className="bg-white rounded-lg border border-[#e0dfdc] p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{animal.about}</p>
            </section>

            <ExperienceSection experience={animal.experience} />
            <EducationSection education={animal.education} />
            <SkillsSection skills={animal.skills} />
          </div>

          <PeopleAlsoViewed current={animal} />
        </div>
      </div>
    </main>
  );
}

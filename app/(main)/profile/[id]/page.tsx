import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { animals, type Animal, type Experience, type Education, type Skill } from '@/app/data/animals';
import { getCurrentUser } from '@/app/lib/auth';

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

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return animals.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const animal = animals.find((a) => a.id === Number(id));
  if (!animal) return { title: 'Animal Not Found — LinkedPaw' };
  return {
    title: `${animal.name} — ${animal.title} | LinkedPaw`,
    description: animal.about.slice(0, 155),
  };
}

function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Experience</h2>
      <div className="space-y-5">
        {experience.map((job, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 flex items-center justify-center text-lg">
              🏢
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{job.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{job.company}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.period}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ education }: { education: Education[] }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Education</h2>
      <div className="space-y-5">
        {education.map((edu, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 flex items-center justify-center text-lg">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{edu.school}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{edu.degree}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.field}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Skills &amp; Endorsements</h2>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {skills.map((skill) => (
          <div key={skill.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{skill.name}</p>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Animals also viewed</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {suggestions.map((animal) => (
            <Link
              key={animal.id}
              href={`/profile/${animal.id}`}
              className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-1 px-1 rounded transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600">
                <Image src={animal.photo} alt={animal.name} fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate hover:underline text-gray-900 dark:text-gray-100">{animal.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{animal.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">✨ PawPremium</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          See who&apos;s been sniffing this profile. 47 creatures viewed it this week.
        </p>
        <button className="mt-2 w-full text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-400 dark:border-amber-600 rounded-full py-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
          Unlock insights — just a gazelle
        </button>
      </div>
    </aside>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const animal = animals.find((a) => a.id === Number(id));
  if (!animal) notFound();

  const currentUser = await getCurrentUser();
  const isMe = currentUser?.id === String(animal.id);
  const bannerClass = BANNER_GRADIENTS[(animal.id - 1) % BANNER_GRADIENTS.length];

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          {/* Main profile content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Profile header card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 overflow-hidden">
              {/* Banner */}
              <div className={`h-32 bg-gradient-to-r ${bannerClass}`} />

              {/* Avatar + info */}
              <div className="px-5 pb-5">
                <div className="flex items-end justify-between -mt-12 mb-3">
                  <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shrink-0 shadow">
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
                      <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button className="text-sm font-semibold bg-[#0a66c2] text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors">
                          Connect
                        </button>
                        <button className="text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          Message
                        </button>
                        <button className="hidden sm:block text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          More
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{animal.name}</h1>
                  <p className="text-base text-gray-800 dark:text-gray-200 mt-0.5">{animal.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {animal.company} · {animal.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#0a66c2]">
                      {animal.connections >= 500 ? '500+' : animal.connections} connections
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium">
                      {animal.species}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-3 py-0.5">
                    ✨ PawPremium
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Open to: Strategic Partnerships, Territory Expansions</span>
                </div>
              </div>
            </div>

            {/* About */}
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">About</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{animal.about}</p>
            </section>

            <ExperienceSection experience={animal.experience} />
            <EducationSection education={animal.education} />
            <SkillsSection skills={animal.skills} />
          </div>

          <div className="hidden lg:block">
            <PeopleAlsoViewed current={animal} />
          </div>
        </div>
      </div>
    </main>
  );
}

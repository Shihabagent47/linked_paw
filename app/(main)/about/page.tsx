import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About LinkedPaw — Case Study',
  description: 'LinkedPaw is a satirical LinkedIn clone built for the animal kingdom. A portfolio case study exploring Next.js App Router, Tailwind CSS, and product design.',
};

const TECH = [
  { name: 'Next.js 15', role: 'App Router, SSG, dynamic routes, metadata API' },
  { name: 'TypeScript', role: 'End-to-end type safety across all data and components' },
  { name: 'Tailwind CSS v4', role: 'Utility-first styling with dark mode and responsive design' },
  { name: 'React', role: 'Client components for interactive UI (filters, toggles, notifications)' },
];

const FEATURES = [
  { emoji: '🏠', title: 'Feed', desc: '25+ seed posts with satirical LinkedIn-speak, hashtag highlighting, see-more truncation, and animal-themed reactions.' },
  { emoji: '🦁', title: 'Animal Profiles', desc: '10 fully fleshed profiles with job history, education, skills & endorsements, and unique gradient banners.' },
  { emoji: '💼', title: 'Job Board', desc: '15 satirical job listings with client-side filtering by species and keyword search. "Easy Apply" for positions like Chief Napping Officer.' },
  { emoji: '🐾', title: 'Network', desc: 'Full network view with connect/pending/connected state machine, species chips, location dropdown, and live connection counters.' },
  { emoji: '🔔', title: 'Notifications', desc: '15 seed notifications across 9 types — likes, comments, endorsements, job alerts, anniversaries — with unread filtering.' },
  { emoji: '🌑', title: 'Dark Mode', desc: 'Class-based dark mode with system preference detection and localStorage persistence.' },
  { emoji: '📱', title: 'Responsive', desc: 'Mobile-first design with a fixed bottom nav, collapsing sidebars, and touch-friendly tap targets.' },
  { emoji: '🔍', title: 'SEO', desc: 'Per-page metadata via Next.js generateMetadata — profile and job pages get unique titles and descriptions.' },
];

const DECISIONS = [
  {
    title: 'Static seed data over a database',
    body: 'All animal profiles, posts, jobs, and notifications are static TypeScript files. No database, no API calls, no auth. This keeps the project deployable as a pure static site while keeping the code readable for a portfolio walkthrough.',
  },
  {
    title: 'App Router over Pages Router',
    body: 'Next.js App Router enables per-page metadata, server components for profile and job detail pages, and streaming with loading.tsx skeletons — all without any extra boilerplate.',
  },
  {
    title: 'No global state manager',
    body: 'Every interactive feature (connection status, notification read-state, theme) uses local useState or a lightweight React context. No Redux, no Zustand. The scope doesn\'t need it.',
  },
  {
    title: 'Tailwind CSS v4 with class-based dark mode',
    body: 'Tailwind v4\'s @custom-variant directive wires dark: utilities to a .dark class on the html element, giving full control without CSS-in-JS or a third-party library.',
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20 md:pb-8">

        {/* Hero */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#e0dfdc] dark:border-gray-700 p-8 mb-6 text-center">
          <p className="text-5xl mb-4">🐾</p>
          <h1 className="text-3xl font-black text-[#0a66c2] mb-2">LinkedPaw</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            A satirical LinkedIn for the animal kingdom — where apex predators connect, humble-brag,
            and apply for positions they&apos;re wildly overqualified for.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-4">
            A front-end portfolio project by{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">Shihab Hossain</span>
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Link
              href="/"
              className="bg-[#0a66c2] text-white text-sm font-semibold rounded-full px-5 py-2 hover:bg-[#004182] transition-colors"
            >
              Explore the app →
            </Link>
          </div>
        </div>

        {/* Features */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">What&apos;s built</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4"
              >
                <p className="text-lg mb-1">{emoji}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">Tech stack</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            {TECH.map(({ name, role }) => (
              <div key={name} className="flex items-center gap-4 px-4 py-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-36 shrink-0">{name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Design decisions */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">Design decisions</h2>
          <div className="space-y-3">
            {DECISIONS.map(({ title, body }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0dfdc] dark:border-gray-700 p-4"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Like what you see?</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            The full source code is available on GitHub. Built as a portfolio case study.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Explore LinkedPaw
            </Link>
            <Link
              href="/network"
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Meet the animals
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy — LinkedPaw' }

const EFFECTIVE_DATE = 'August 13, 2026'
const CONTACT_EMAIL = 'legal@linkedpaw.com'

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">Privacy Policy</h1>
            <p className="text-xs text-gray-400">Effective {EFFECTIVE_DATE}</p>
          </div>

          <p>
            LinkedPaw Corporation (&ldquo;we&rdquo;) operates the LinkedPaw platform. This Privacy Policy
            explains what personal data we collect, how we use it, and your rights.
          </p>

          <Section title="1. Data We Collect">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account data:</strong> email address, display name, species, profile photo, and other profile fields you choose to provide.</li>
              <li><strong>Content:</strong> posts, comments, reactions, and job listings you create.</li>
              <li><strong>Usage data:</strong> pages visited, features used, IP address, browser type (collected automatically).</li>
              <li><strong>Payment data:</strong> billing details are collected and stored directly by Stripe — we never see or store full card numbers.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and operate the Service (authentication, profiles, feed, notifications).</li>
              <li>Process payments and manage subscriptions via Stripe.</li>
              <li>Send transactional emails (connection requests, subscription confirmations).</li>
              <li>Improve the Service through aggregated, anonymised analytics.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Processors">
            <p>We share your data with the following processors, each operating under their own privacy policy:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — database, authentication, and file storage (supabase.com/privacy)</li>
              <li><strong>Stripe</strong> — payment processing and subscription management (stripe.com/privacy)</li>
              <li><strong>Vercel</strong> — hosting and infrastructure (vercel.com/legal/privacy-policy)</li>
              <li><strong>Sentry</strong> — error monitoring (sentry.io/privacy)</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p>We use essential cookies to maintain your login session (provided by Supabase Auth). We use Vercel Analytics for privacy-first page-view measurement; it does not set third-party cookies or track you across sites.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your data for as long as your account is active. You may delete your account at any time, which removes your profile and content within 30 days, subject to legal retention requirements.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have rights to access, correct, or delete your personal data, or to object to or restrict its processing. To exercise these rights, email us at the address below.</p>
          </Section>

          <Section title="7. Children">
            <p>LinkedPaw is not intended for users under 13. We do not knowingly collect data from children under 13.</p>
          </Section>

          <Section title="8. Changes">
            <p>We will notify you of material changes to this policy by email or notice in the Service at least 7 days before they take effect.</p>
          </Section>

          <p className="pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
            Questions? Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0a66c2] hover:underline">{CONTACT_EMAIL}</a>.
            {' '}See also our{' '}
            <Link href="/legal/terms" className="text-[#0a66c2] hover:underline">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

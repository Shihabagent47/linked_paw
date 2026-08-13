import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service — LinkedPaw' }

const EFFECTIVE_DATE = 'August 13, 2026'
const CONTACT_EMAIL = 'legal@linkedpaw.com'

export default function TermsPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">Terms of Service</h1>
            <p className="text-xs text-gray-400">Effective {EFFECTIVE_DATE}</p>
          </div>

          <p>
            Welcome to LinkedPaw. These Terms govern your use of the LinkedPaw platform
            (&ldquo;Service&rdquo;), operated by LinkedPaw Corporation (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            By creating an account or using the Service, you agree to these Terms.
          </p>

          <Section title="1. Accounts">
            <p>You must be at least 13 years old to use LinkedPaw. You are responsible for maintaining the security of your account and all activity that occurs under it. You may not share your credentials or impersonate any animal or person.</p>
          </Section>

          <Section title="2. Content">
            <p>You retain ownership of content you post. By posting, you grant us a non-exclusive, worldwide, royalty-free licence to display and distribute your content as part of the Service. You must not post content that is unlawful, harassing, defamatory, or infringes third-party rights. We may remove content that violates these Terms at our discretion.</p>
          </Section>

          <Section title="3. Subscriptions and Billing">
            <p>LinkedPaw offers a free &ldquo;Cub&rdquo; tier and a paid &ldquo;Alpha Paw&rdquo; subscription at $8/month or $72/year. Payments are processed by Stripe. Subscriptions renew automatically at the end of each billing period unless cancelled. You may cancel at any time through the billing portal; access continues until the end of the current period. We do not offer refunds except where required by law.</p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You may not use the Service to: (a) send spam or unsolicited messages; (b) scrape or harvest data without permission; (c) circumvent technical limits or access controls; (d) engage in any activity that disrupts the Service or other users&apos; experience.</p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>The LinkedPaw name, logo, and platform design are our intellectual property. Nothing in these Terms grants you any right to use our trademarks.</p>
          </Section>

          <Section title="6. Disclaimers">
            <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee uninterrupted access, accuracy of content posted by users, or suitability for any particular purpose.</p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>To the fullest extent permitted by law, our total liability for any claim arising from the Service is limited to the amount you paid us in the 12 months preceding the claim, or $10, whichever is greater.</p>
          </Section>

          <Section title="8. Termination">
            <p>We may suspend or terminate your account for material breach of these Terms, with or without notice. You may delete your account at any time. Upon termination, your content may be removed.</p>
          </Section>

          <Section title="9. Changes">
            <p>We may update these Terms from time to time. Material changes will be communicated by email or prominent notice in the Service at least 7 days before taking effect.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms are governed by the laws of the applicable jurisdiction. Disputes will be resolved in the courts of that jurisdiction.</p>
          </Section>

          <p className="pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
            Questions? Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0a66c2] hover:underline">{CONTACT_EMAIL}</a>.
            {' '}See also our{' '}
            <Link href="/legal/privacy" className="text-[#0a66c2] hover:underline">Privacy Policy</Link>.
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

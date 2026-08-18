# LinkedPaw — SaaS Build Plan

Turn the satirical showcase into a real product: real users, real data, real money.

Stack: **Next.js 16 (App Router) · Supabase (Auth + Postgres + Storage + Realtime) · Stripe**

---

## Pricing Model

| Tier | Price | Tagline |
|---|---|---|
| **Cub** (free) | $0 | Sniff around the savannah |
| **Alpha Paw** | $8/mo or $72/yr | Run the pride |

### Feature Gate

| Feature | Cub | Alpha Paw |
|---|---|---|
| Profile + avatar/banner upload | ✅ | ✅ |
| Post to feed | 5/day cap | Unlimited |
| React & comment | ✅ | ✅ |
| Connect with others | 50 cap | Unlimited |
| Browse job listings | ✅ | ✅ |
| Apply to jobs | ✅ | ✅ |
| Post a job listing | ❌ | ✅ |
| See who viewed your profile | ❌ | ✅ |
| Post analytics (views, reach) | ❌ | ✅ |
| Alpha badge on profile | ❌ | ✅ |
| Boosted placement in network search | ❌ | ✅ |

---

## Database Schema (Supabase / Postgres)

```sql
-- Run this block first if you need to reset (drops in reverse dependency order):
-- DROP TABLE IF EXISTS subscriptions, notifications, profile_views, job_applications, jobs, connections, comments, reactions, posts, profiles CASCADE;

CREATE TABLE IF NOT EXISTS profiles (
  id                 uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username           text UNIQUE NOT NULL,
  display_name       text NOT NULL,
  species            text NOT NULL,
  title              text,
  company            text,
  location           text,
  bio                text,
  avatar_url         text,
  banner_url         text,
  is_alpha           boolean DEFAULT false,
  stripe_customer_id text UNIQUE,
  created_at         timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content    text NOT NULL,
  image_url  text,
  view_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type    text NOT NULL,
  UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS connections (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status       text DEFAULT 'pending',
  created_at   timestamptz DEFAULT now(),
  UNIQUE (requester_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title        text NOT NULL,
  company      text NOT NULL,
  location     text NOT NULL,
  description  text NOT NULL,
  requirements text[],
  salary       text,
  species_tag  text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (job_id, user_id)
);

CREATE TABLE IF NOT EXISTS profile_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type       text NOT NULL,
  entity_id  uuid,
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_price_id        text,
  status                 text,
  current_period_end     timestamptz,
  updated_at             timestamptz DEFAULT now()
);
```

---

## Phase 1 — Supabase Foundation

Goal: schema deployed, RLS locked down, env wired to Next.js.

- [x] Create Supabase project, grab `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`
- [x] Install `@supabase/supabase-js` + `@supabase/ssr`
- [x] Create `lib/supabase/client.ts` (browser client), `lib/supabase/server.ts` (server client using cookies), `lib/supabase/middleware.ts`
- [x] Add `middleware.ts` at project root — refresh session on every request, redirect unauthenticated users away from protected routes
- [x] Run all schema SQL in Supabase SQL editor
- [x] Write Row Level Security policies:
  - `profiles`: anyone can read; only owner can update
  - `posts`: anyone can read; only author can insert/delete
  - `reactions`: anyone can read; authenticated users insert; only owner deletes
  - `comments`: same as reactions
  - `connections`: both parties can read; requester inserts; either party updates/deletes
  - `jobs`: anyone reads; only Alpha users insert
  - `job_applications`: user reads own; job poster reads all for their job
  - `profile_views`: only profile owner reads; authenticated users insert
  - `notifications`: only recipient reads; system/triggers insert
  - `subscriptions`: only owner reads; service role writes
- [x] Create Supabase Storage buckets: `avatars` (public), `post-images` (public), `banners` (public)
- [x] Set storage policies: authenticated users upload to their own folder (`{user_id}/*`)
- [x] Add `.env.local` with all keys (never commit)

---

## Phase 2 — Auth Flow

Goal: users can sign up, log in, and complete an onboarding profile.

- [x] `app/(auth)/login/page.tsx` — email + password form, "Continue with Google" button
- [x] `app/(auth)/signup/page.tsx` — same layout, register new account
- [x] `app/(auth)/callback/route.ts` — Next.js Route Handler for Supabase OAuth code exchange
- [x] `app/(auth)/onboarding/page.tsx` — runs once after first sign-in:
  - Pick a display name
  - Pick a species (dropdown with the 10 original animals + open "Other")
  - Set a title and location
  - Upload avatar (optional, defaults to species illustration)
  - On submit: INSERT into `profiles`, redirect to `/`
- [x] Gate all non-auth routes in `middleware.ts`: redirect to `/login` if no session
- [x] "Log out" button in Navbar (calls `supabase.auth.signOut()`, redirects to `/login`)
- [x] Replace the hardcoded `ME` constant everywhere with the session user fetched server-side

---

## Phase 3 — Real Profiles

Goal: users own and can edit their profile page.

- [x] `app/profile/[id]/page.tsx` — fetch profile by `id` from Supabase (server component)
- [x] Show real posts, real connections count, real skills (store skills as `text[]` on profiles)
- [x] "Edit profile" modal/drawer (only shown to profile owner):
  - Display name, title, company, location, bio, species
  - Avatar upload → Supabase Storage → update `avatar_url`
  - Banner upload → Supabase Storage → update `banner_url`
  - Skills array (add/remove chips)
  - Experience + Education as JSONB arrays on `profiles`
- [x] Profile views: on every profile page load (by a non-owner), INSERT into `profile_views`
- [x] "X animals viewed your profile this week" card — visible only to Alpha users; query `profile_views` for the last 7 days
- [x] Alpha badge (🐾⭐) displayed next to name on profile and feed cards if `profiles.is_alpha = true`

---

## Phase 4 — Real Feed

Goal: users create posts, react, comment. Feed is live.

- [x] Post composer (currently a placeholder button): opens a modal with textarea + optional image upload
  - On submit: INSERT into `posts`, upload image to Storage if present
  - Enforce 5/day cap for Cub users (count today's posts server-side before insert)
- [x] Feed (`app/page.tsx`): server component fetches posts with author profile, reaction counts, comment counts — ordered by `created_at DESC`, paginated (cursor-based, 10 at a time)
- [x] `PostCard` — make reactions functional:
  - Fetch current user's reaction for each post
  - Click reaction → upsert/delete row in `reactions`
  - Count displayed via `SELECT count(*) ... GROUP BY type`
- [x] Comments: click "Comment" → expand inline comment thread, load from `comments`, submit new
- [x] "Infinite scroll" or "Load more" button for feed pagination
- [x] Supabase Realtime subscription on `posts` table → new posts appear at top without page reload
- [x] Post analytics (Alpha only): view count tracked via server action on card mount, shown on own posts

---

## Phase 5 — Real Connections

Goal: connection requests with real state.

- [x] "Connect" button on `ConnectionCard` and profiles:
  - INSERT into `connections` with `status = 'pending'`
  - Trigger INSERT into `notifications` for receiver
- [x] `/network` page: fetch all `profiles` except self; join `connections` to show real status (none / pending / connected)
  - "People you may know" prioritized by same species, then mutual connections (count shared connections)
- [x] `/network/connections` tab: list of `status = 'connected'` connections
- [x] `/network/pending` tab: incoming requests with Accept / Decline buttons
  - Accept → UPDATE `connections` status to `'connected'`, notify requester
  - Decline → DELETE row
- [x] Connection count on Navbar badge: count `status = 'connected'` rows for current user
- [x] Enforce 50-connection cap for Cub users (check count before INSERT)

---

## Phase 6 — Real Notifications

Goal: live notification feed.

- [x] `/notifications` page: fetch `notifications` for current user, join `actor` profile for name/avatar
- [x] Mark all as read on page visit (UPDATE `read = true`)
- [x] Unread count badge on Navbar: count `read = false` rows
- [x] Supabase Realtime subscription on `notifications WHERE user_id = me` → badge updates live, toast pops in corner
- [x] Notification triggers (INSERT into `notifications`):
  - New connection request
  - Connection accepted
  - Reaction on your post
  - Comment on your post
  - Someone applied to your job (Alpha)
  - Someone viewed your profile (Alpha)

---

## Phase 7 — Real Jobs

Goal: job board backed by real data with gated posting.

- [x] Seed jobs migrated to Supabase (one-time INSERT script)
- [x] `/jobs` page: fetch from `jobs` table, client-side filter stays (or move to server-side search with Postgres `ilike`)
- [x] `/jobs/[id]` page: fetch job + `job_applications` count; "Easy Apply" button INSERTs into `job_applications`
- [x] "Post a Job" page (`/jobs/new`):
  - Gate: only Alpha users see this link and can access the page (check `is_alpha` server-side, 403 otherwise)
  - Form → INSERT into `jobs`
- [x] "My Job Posts" section on profile: lists jobs posted by this user with applicant counts
- [x] "My Applications" section on profile: lists jobs current user has applied to

---

## Phase 8 — Stripe Monetization

Goal: Cub users can upgrade to Alpha Paw; billing is self-serve.

- [x] Install `stripe` (server) + `@stripe/stripe-js` (client)
- [ ] Create Stripe products:
  - Alpha Paw Monthly — $8/month
  - Alpha Paw Yearly — $72/year
- [x] `app/upgrade/page.tsx` — pricing comparison table, two "Upgrade" buttons
- [x] `app/api/stripe/checkout/route.ts`:
  - Create or retrieve Stripe Customer for current user
  - Save `stripe_customer_id` to `profiles`
  - Create Checkout Session (mode: `subscription`, with `success_url` and `cancel_url`)
  - Return `{ url }` → client redirects
- [x] `app/api/stripe/portal/route.ts`:
  - Create Stripe Billing Portal session for current user's customer
  - Return URL → "Manage Subscription" button redirects there
- [x] `app/api/stripe/webhook/route.ts` (Route Handler):
  - Verify Stripe signature with `STRIPE_WEBHOOK_SECRET`
  - Handle events:
    - `checkout.session.completed` → INSERT into `subscriptions`, set `profiles.is_alpha = true`
    - `customer.subscription.updated` → UPDATE `subscriptions`
    - `customer.subscription.deleted` → UPDATE status, set `profiles.is_alpha = false`
- [x] Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
- [x] "Alpha Paw" badge + upsell prompts at every feature gate (not a wall, a nudge)
- [x] "Manage Subscription" link in Navbar dropdown for Alpha users

---

## Phase 9 — Production Hardening

Goal: safe to hand to real strangers on the internet.

- [ ] **RLS audit**: run every table through Supabase's "Auth Policies" UI, test as anonymous + authenticated + other user
- [x] **Rate limiting**: add simple in-memory or Redis-backed rate limiter on Route Handlers for post creation and job application
- [x] **Input validation**: `zod` schemas on all form inputs before any Supabase write
- [x] **Error monitoring**: add Sentry (`@sentry/nextjs`) — capture unhandled errors + slow DB queries
- [x] **Analytics**: add Vercel Analytics or Plausible (privacy-first) — page views, upgrade funnel
- [ ] **Transactional email**: Supabase Edge Function + Resend for:
  - Welcome email on signup
  - "Someone connected with you" digest (daily, not per-event)
  - Subscription confirmation / cancellation
- [x] **Legal pages** (required before taking money):
  - `/legal/terms` — Terms of Service
  - `/legal/privacy` — Privacy Policy (mention Supabase, Stripe, Vercel data processing)
  - Cookie consent banner
- [ ] **Custom domain** on Vercel, update Supabase Auth redirect URLs
- [x] **Environment variables** audit: no secrets in client bundle (`NEXT_PUBLIC_` only for safe keys)
- [x] **Image optimization**: enforce max file size (2MB) on Storage uploads, run through Next.js `<Image>` for resizing

---

## Technical Decisions

| Concern | Decision |
|---|---|
| Auth | Supabase Auth — email/password + Google OAuth |
| Database | Supabase Postgres — all tables with RLS |
| File storage | Supabase Storage — `avatars/`, `banners/`, `post-images/` buckets |
| Realtime | Supabase Realtime — notifications badge + feed live inserts |
| Payments | Stripe Subscriptions — monthly + yearly, self-serve portal |
| API | Next.js Route Handlers — Stripe webhooks, checkout, portal |
| Server data fetching | Next.js Server Components + Supabase server client (cookie-based auth) |
| Client interactivity | `'use client'` components for composer, reactions, real-time updates |
| Validation | Zod on all user input |
| Error tracking | Sentry |
| Email | Supabase Edge Functions + Resend |
| Deployment | Vercel (already deployed) |

---

## Order of Attack

1. **Phase 1** — foundation first; nothing else works without it
2. **Phase 2** — auth before any real data; onboarding gives everyone a profile
3. **Phase 3** — profiles are the identity layer everything else references
4. **Phase 4** — feed is the core loop; make it real and sticky
5. **Phase 5** — connections make it social, not just a blog
6. **Phase 6** — notifications bring users back
7. **Phase 7** — jobs unlock the Alpha upsell moment ("post a job? upgrade!")
8. **Phase 8** — Stripe last, when there's actually something worth paying for
9. **Phase 9** — harden before any real marketing push

---

## What Carries Over From plan.md

The UI is done. Every component (`PostCard`, `JobCard`, `ConnectionCard`, Navbar, sidebars, dark mode, responsive layout, loading skeletons, 404 page) stays as-is. The work ahead is entirely **data layer + auth + payments** — wiring real Supabase calls in place of the static imports, and adding the Stripe checkout flow on top.

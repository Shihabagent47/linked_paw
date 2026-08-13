# 🐾 LinkedPaw

> Professional networking for the animal kingdom. Where apex predators connect, humble-brag, and apply for positions they're wildly overqualified for.

A satirical LinkedIn parody built as a real SaaS product — real auth, real database, real payments.

**Stack:** Next.js 16 (App Router) · Supabase · Stripe · Sentry · Vercel

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local — see the guide below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in each value. Here's exactly where to get every one.

---

### Supabase

LinkedPaw uses Supabase for the database, authentication, and file storage.

#### Step 1 — Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose an organisation, give the project a name (e.g. `linked-paw`), set a database password, and pick a region close to your users.
4. Wait ~2 minutes for provisioning.

#### Step 2 — Get the API keys

In your project, go to **Project Settings** (gear icon) → **API**.

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** field |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon / public** key under "Project API keys" |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role / secret** key — never expose to the browser |

#### Step 3 — Run the database schema

1. Go to **SQL Editor** → **New query**.
2. Paste and run the full schema SQL from the `## Database Schema` section in `plan2.md`.
3. Paste and run the RLS policies SQL that follows.

#### Step 4 — Create storage buckets

1. Go to **Storage** → **New bucket**.
2. Create three buckets, all set to **Public**:
   - `avatars`
   - `banners`
   - `post-images`
3. For each bucket, go to **Policies** and add a policy allowing authenticated users to upload to their own folder (`{user_id}/*`).

---

### Stripe

LinkedPaw uses Stripe for subscription billing ($8/month or $72/year).

#### Step 1 — Get your API keys

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign in.
2. Switch to **Test mode** (toggle in the top-left) during development.
3. Go to **Developers** → **API keys**.

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Publishable key** (`pk_test_...`) |
| `STRIPE_SECRET_KEY` | **Secret key** (`sk_test_...`) — click "Reveal" |

#### Step 2 — Create the products and price IDs

1. Go to **Product catalogue** → **Add product**.
2. Create **Alpha Paw Monthly**:
   - Name: `Alpha Paw`
   - Pricing model: Standard pricing
   - Price: `$8.00` · Recurring · Every month
   - Click **Save product**.
   - Copy the **Price ID** (`price_...`) shown under the price → paste as `STRIPE_PRICE_MONTHLY`.
3. On the same product page, click **Add another price**:
   - Price: `$72.00` · Recurring · Every year
   - Click **Save**.
   - Copy that **Price ID** → paste as `STRIPE_PRICE_YEARLY`.

#### Step 3 — Set up the webhook

The webhook keeps `is_alpha` and the `subscriptions` table in sync when a user subscribes, upgrades, or cancels.

**For local development** (using the Stripe CLI):

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   # Windows (via scoop)
   scoop install stripe
   ```
2. Log in:
   ```bash
   stripe login
   ```
3. In a separate terminal, forward events to your local dev server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. The CLI prints a signing secret (`whsec_...`). Paste it as `STRIPE_WEBHOOK_SECRET`.

**For production** (Vercel deployment):

1. In the Stripe dashboard, go to **Developers** → **Webhooks** → **Add endpoint**.
2. Set the endpoint URL to `https://your-domain.com/api/stripe/webhook`.
3. Under **Select events**, add:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add endpoint**, then click **Reveal** next to the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET`.

#### Step 4 — Enable the Customer Portal

1. In the Stripe dashboard, go to **Settings** → **Billing** → **Customer portal**.
2. Enable the portal and configure allowed self-serve actions (cancel subscription, update payment method).
3. Click **Save settings**.

---

### App URL

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally · your deployed URL in production (no trailing slash) |

This is used to build the `success_url` and `cancel_url` redirected to after Stripe Checkout.

---

### Sentry

Sentry captures unhandled errors and performance data in production.

#### Step 1 — Create a project

1. Go to [sentry.io](https://sentry.io) and sign in (free tier is fine).
2. Click **Create Project** → select **Next.js** as the platform → name it `linked-paw`.
3. Sentry shows your DSN on the setup screen. Copy it.

#### Step 2 — Get the values

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | DSN shown after project creation, or **Settings → Projects → linked-paw → Client Keys (DSN)** |
| `SENTRY_DSN` | Same DSN — used server-side so it doesn't need the `NEXT_PUBLIC_` prefix |
| `SENTRY_ORG` | Your organisation slug — visible in the Sentry URL: `sentry.io/organizations/{slug}/` |
| `SENTRY_PROJECT` | The project slug — `linked-paw` (or whatever you named it) |
| `SENTRY_AUTH_TOKEN` | **Settings → Account → API → Auth Tokens** → **Create New Token** — scope: `project:releases` + `org:read` |

> `SENTRY_AUTH_TOKEN` is only used at build time to upload source maps. Add it to Vercel's environment variables — you don't need it in your local `.env.local`.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Add every variable from `.env.local` into **Settings → Environment Variables**, plus `SENTRY_AUTH_TOKEN`.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL (e.g. `https://linkedpaw.vercel.app`).
5. Update the Stripe webhook endpoint URL to your production domain.
6. In **Supabase → Authentication → URL Configuration**, add your production URL to **Redirect URLs** so OAuth callbacks work.

---

## Manual Steps After Go-Live

These can't be scripted — they require clicking through dashboards:

- **RLS audit** — In Supabase, open **Authentication → Policies**. Test each table as anonymous, as a signed-in user, and as a different user to confirm the policies are locked down correctly.
- **Custom domain** — In Vercel, go to **Settings → Domains** and add your domain. Then update the Stripe webhook endpoint and Supabase Auth redirect URLs to the new domain.
- **Transactional email** — Create a [Resend](https://resend.com) account, verify your domain, and write Supabase Edge Functions to send welcome emails (on signup) and billing confirmation emails (on subscription events).
- **Make yourself Alpha for testing** — Before Stripe is wired up, you can manually flip the flag in Supabase:
  ```sql
  UPDATE profiles SET is_alpha = true WHERE id = 'your-user-uuid-here';
  ```

---

## Project Structure

```
app/
  (auth)/           # login, signup, onboarding, OAuth callback
  (main)/           # layout with Navbar + footer
    page.tsx        # feed
    profile/        # profile pages + edit modal
    network/        # connection discovery + pending requests
    notifications/  # notification feed
    jobs/           # job board, job detail, post a job
    upgrade/        # pricing page
    legal/          # terms of service + privacy policy
  api/
    posts/          # create post, reactions, comments
    connections/    # send / accept / decline / remove
    stripe/         # checkout session, billing portal, webhook
  components/       # shared React components
  lib/
    actions/        # server actions (jobs, notifications)
    auth.ts         # getCurrentUser() — cached server-side
    types.ts        # shared TypeScript types
lib/
  supabase/         # browser, server, and service-role clients
  stripe.ts         # Stripe server instance
  validations.ts    # Zod schemas for all write endpoints
  rate-limit.ts     # in-memory sliding-window rate limiter
```

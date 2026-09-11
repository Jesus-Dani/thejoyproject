# The Joy Project

Production website for The Joy Project — a university Barbie movie marathon
(Saturday, Sept 26 2026, SEAP) and charity football match (Friday, Sept 25
2026, Main Field), run in partnership with **The Ezer Foundation**. Next.js
(App Router, TypeScript) + Supabase (Postgres) + Paystack + Resend.

See `PRD.md`, `TRD.md`, and `BRAND_SPEC.md` in this repo for the full
product/technical/design specs this build implements.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Supabase** (Postgres) — server-only access via the service-role key, no
  buyer accounts, RLS default-deny on every table
- **Paystack** — hosted checkout redirect; the webhook is the only trusted
  source of payment confirmation
- **Resend** — confirmation email with QR code attachments
- **jsQR** — in-browser camera QR decoding for `/checkin`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

### 1. Environment variables

| Variable | Where to get it |
|---|---|
| `SITE_URL` | `http://localhost:3000` locally; your production URL once deployed (e.g. `https://thejoyproject.vercel.app`) — server-side only, used to build the Paystack redirect URL |
| `SUPABASE_URL` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API → **service_role** secret (not the publishable/anon key — this app has no buyer auth, so the DB is only ever touched server-side) |
| `PAYSTACK_SECRET_KEY` | Paystack dashboard → Settings → API Keys & Webhooks. Use a **test** key for local dev/Vercel previews, a **live** key only in production |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `EMAIL_FROM` | A verified sending address in Resend, e.g. `"The Joy Project <tickets@yourdomain.com>"` |
| `ORGANIZER_EMAIL` | Where Get Involved form submissions land |
| `ADMIN_PASSWORD` / `CHECKIN_PASSWORD` | Pick two **different** passwords — deliberately separate so a leaked door-volunteer password can't expose sales/revenue data in `/admin` |
| `AUTH_COOKIE_SECRET` / `QR_SIGNING_SECRET` | Any long random string, e.g. `openssl rand -hex 32` |

### 2. Set up the database

Run these two files against your Supabase project, in order, via the SQL
Editor in the Supabase dashboard (or `supabase db push` if you have the CLI
linked):

1. `supabase/migrations/0001_init.sql` — creates the `sessions`,
   `ticket_types`, `orders`, `admissions` tables.
2. `supabase/migrations/0002_functions.sql` — creates
   `process_paystack_order`, the atomic function backing the Paystack
   webhook (capacity-safe seat increments + no-oversell guarantee).

Then seed the real event schedule:

3. `supabase/seed.sql` — the match + three Saturday showings, and the three
   ticket types (₦1,800 combo, ₦1,000 single day). Run once against a fresh
   database.

### 3. Configure the Paystack webhook

In the Paystack dashboard → Settings → API Keys & Webhooks, set the webhook
URL to `https://<your-domain>/api/webhooks/paystack`. Locally, use a tool
like `ngrok`/the Paystack CLI to forward webhooks to
`http://localhost:3000/api/webhooks/paystack` if you need to test a full
payment end-to-end.

### 4. Run it

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Check-in scanner: `http://localhost:3000/checkin` (password: `CHECKIN_PASSWORD`)
- Admin dashboard: `http://localhost:3000/admin` (password: `ADMIN_PASSWORD`)

## Payment fees — a deliberate deviation from TRD §5.3

TRD §5.3 originally called for Paystack's transaction fee to be added on top
of the ticket price at checkout. Per a product decision made during this
build, **the buyer is charged the ticket price only** (₦1,800 / ₦1,000) —
Paystack's fee is absorbed by the organizer rather than passed to the buyer.
`orders.paystack_fee_ngn` is still populated from the webhook's fee data for
bookkeeping/reconciliation, it's just not added to what the buyer pays. If
you want to reinstate a buyer-facing surcharge, that's `amountNgn` in
`src/app/api/checkout/init/route.ts`.

## Open items (flagged, not silently decided)

These were called out as open in `PRD.md` §14 and are placeholdered rather
than guessed:

- **Film titles** for the 3 Saturday showings — `sessions.film_title` is
  `NULL` in the seed data; the Events page displays "Film TBA" until set.
- **Real event photography** — `public/images/placeholders/*.svg` are
  labeled placeholder graphics, referenced through the single
  `src/lib/images.ts` config. Swap files there once real photos exist; no
  layout code needs to change.
- **Domain name** — not yet registered; `SITE_URL` needs updating once
  one exists.
- **Social links** (`src/lib/social.ts`) and the confirmation email's
  "from" address are placeholders — no real handles/domain were provided.

## Architecture notes

- **No pre-checkout seat hold.** Capacity is enforced entirely inside the
  Paystack webhook via a single atomic Postgres function
  (`process_paystack_order`, see `supabase/migrations/0002_functions.sql`):
  it claims exclusive ownership of the order, then does a capacity-checked
  `UPDATE ... WHERE seats_sold + qty <= capacity` per relevant session,
  rolling back any partial increment and marking the order
  `oversold_conflict` (auto-refunded via Paystack, apology email sent) if a
  showing sold out in the meantime. See TRD §4 and the function's comments.
- **Payment status is only ever trusted from the verified webhook** —
  `/api/orders/status` is read-only and the confirmation page polls it
  rather than trusting the Paystack redirect callback.
- **Admin and check-in** use a shared-password + signed-cookie scheme (no
  user accounts) — see `src/lib/auth.ts` and `src/proxy.ts` (Next.js 16's
  renamed `middleware.ts`).

## What hasn't been verified

This was built without live Paystack/Resend credentials, so the checkout →
webhook → email flow has not been exercised against real payment
confirmation. Once real keys are in place, run a full test-mode purchase
before going live: `/get-your-ticket` → Paystack test card → webhook fires →
confirmation email with QR arrives → `/checkin` scan succeeds.

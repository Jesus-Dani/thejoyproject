# The Joy Project — Technical Requirements Document (TRD)

**Status:** Locked scope, ready for implementation
**Companion document:** PRD.md (product requirements)

---

## 1. Architecture Summary

A single Next.js application deployed on Vercel, backed by Supabase (managed Postgres), with Paystack handling all payment collection and Resend handling transactional email. No CMS, no user-facing auth system, no queue infrastructure — the event is short-lived and traffic is expected to be moderate.

```
Browser (buyer / volunteer / admin)
        │
        ▼
  Next.js app (Vercel)
   ├─ Public pages (SSG/ISR): Home, About, Events, Impact, Get Involved, Terms
   ├─ Ticket checkout flow (SSR + API routes)
   ├─ /admin (password-gated)
   └─ /checkin (password-gated)
        │
        ├──► Supabase Postgres (sessions, orders, admissions)
        ├──► Paystack (payment init + webhook)
        └──► Resend (transactional email)
```

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend/framework | Next.js (React), TypeScript | SSG/ISR for marketing pages, SSR/API routes for checkout, admin, check-in |
| Database | Supabase (Postgres) | Chosen for transactional locking support needed to prevent overselling |
| Hosting | Vercel | Production + automatic PR preview deployments (no separate persistent staging) |
| Payments | Paystack | Default Paystack Checkout (card, bank transfer, USSD); NGN only |
| Email | Resend | Transactional email (confirmation, contact form notifications) |
| QR generation | `qrcode` (npm) or equivalent | Server-side generation, embedded in email |
| Styling | Tailwind CSS (recommended) or CSS variables per approved spec | Implements the approved design tokens directly |
| Validation | Zod (recommended) | Shared schema validation on forms and API input |

## 3. Data Model

```
sessions
  id              uuid PK
  type            enum('match','movie_showing')
  name            text                  -- e.g. "Showing 2", "Charity Match"
  film_title      text NULL             -- movie_showing only
  event_date      date
  start_time      time
  end_time        time
  venue           text                  -- "SEAP" / "Main Field"
  capacity        int NULL              -- 100 for movie_showing, NULL = uncapped (match)
  seats_sold      int NOT NULL DEFAULT 0  -- denormalized counter, updated atomically
  display_order   int

ticket_types
  id              uuid PK
  code            enum('COMBO','FRIDAY_ONLY','SATURDAY_ONLY')
  name            text
  price_ngn       numeric               -- 1800 or 1000
  includes_match  boolean
  includes_showing boolean

orders
  id                  uuid PK
  buyer_name          text
  buyer_email         text
  buyer_phone         text
  ticket_type_id      uuid FK -> ticket_types
  showing_id          uuid NULL FK -> sessions   -- required if ticket_type.includes_showing
  quantity            int
  unit_price_ngn      numeric
  paystack_fee_ngn    numeric
  total_amount_ngn    numeric
  paystack_reference  text UNIQUE
  payment_status      enum('pending','success','failed','oversold_conflict')
  created_at          timestamptz
  paid_at             timestamptz NULL

admissions
  id              uuid PK
  order_id        uuid FK -> orders
  session_id      uuid FK -> sessions      -- one row per event a ticket unit admits to
  qr_token        text UNIQUE             -- random, unguessable (UUID v4 or signed token)
  checked_in_at   timestamptz NULL
  checked_in_by   text NULL               -- which volunteer/session context did the scan
```

**Why `admissions` is separate from `orders`:** a combo order of quantity *N* must produce *N* match admissions **and** *N* showing admissions (two separate physical gates, two separate scans), and a single order can have quantity > 1 with no per-ticket name — so each physical seat/entry needs its own scannable QR token regardless of buyer-level data collection. This table is what the check-in scanner and capacity counters operate against.

## 4. Ticketing & Capacity Logic

### 4.1 No pre-checkout seat hold
Per product decision, seats are **not** reserved when checkout starts — only once Paystack confirms payment. This keeps the build simple but means two buyers can simultaneously reach checkout for the last remaining seats of a showing.

### 4.2 Preventing overselling despite no hold
On payment confirmation (webhook, §5), capacity is enforced with a single atomic database operation rather than a read-then-write from application code (which would race):

```sql
UPDATE sessions
SET seats_sold = seats_sold + :quantity
WHERE id = :session_id
  AND (capacity IS NULL OR seats_sold + :quantity <= capacity)
RETURNING seats_sold;
```

If this returns no row, the showing didn't have enough remaining capacity at the moment of confirmation — this is the **oversold conflict** case.

### 4.3 Oversold conflict handling (edge case)
Because there's no hold, in rare cases a payment can succeed with Paystack but the showing sells out microseconds earlier from another concurrent payment. When this happens:
1. The order is marked `oversold_conflict` (not `success`).
2. The system automatically issues a Paystack refund for that order via the Refunds API.
3. The buyer receives an apologetic email explaining the showing sold out moments before their payment cleared, that they've been refunded in full, and inviting them to pick a different showing.
4. This is an **organizer-side safety net**, distinct from the public "no refunds" policy, and should not be described to buyers as a refund option — only triggered automatically by this specific conflict.

Given the product decision that traffic is a "moderate spike, standard build is fine," this conflict is expected to be rare; it does not require a queueing/rate-limiting system, just this atomic-update-plus-refund safety net.

### 4.4 Live seat counts
The Events page and ticket selector read `capacity - seats_sold` per showing for the public-facing counter (e.g. "23/100 left"). This is a simple read query — no caching complexity needed given the traffic profile agreed.

## 5. Payment Integration (Paystack)

### 5.1 Checkout flow
1. Buyer selects ticket type (+ showing, if applicable) and submits buyer info.
2. Server creates an `orders` row with `payment_status = 'pending'`, computing `unit_price_ngn`, `quantity`, and `paystack_fee_ngn` (fee passed to the buyer, so the total charged includes Paystack's transaction fee on top of ticket price).
3. Server calls Paystack's Initialize Transaction API with the computed total, buyer email, and a metadata payload linking back to the `orders.id`; redirects the buyer to Paystack Checkout (or uses Paystack Inline, implementer's choice).
4. On return, the client polls or is shown a "confirming payment" state until the webhook (§5.2) has processed — do **not** trust the client-side redirect alone to mark an order paid.

### 5.2 Webhook verification (source of truth for payment success)
- Endpoint: `POST /api/webhooks/paystack`.
- Verify the `x-paystack-signature` header (HMAC SHA512 of the raw request body using the Paystack secret key) before processing anything; reject unverified requests.
- On a `charge.success` event, look up the order by `paystack_reference`. Treat the webhook as the only trusted source of payment confirmation — never mark an order paid from a client-side callback.
- Idempotency: `paystack_reference` is unique on `orders`; if the order is already `success`, acknowledge and no-op (Paystack retries webhooks).
- On first successful processing: run the atomic capacity update (§4.2) for each relevant session (match session if included, showing session if included), create the corresponding `admissions` rows with generated QR tokens, set `payment_status = 'success'`, and trigger the confirmation email (§6).

### 5.3 Currency & fees
- NGN only.
- Single Paystack account/settlement — no split payments or subaccounts.
- Paystack's transaction fee is calculated and added to the checkout total, not absorbed into the ₦1,800/₦1,000 sticker price.

## 6. Ticket Delivery

- On successful payment, generate one QR code per `admissions` row (an unguessable token, e.g. UUID v4, optionally HMAC-signed to prevent forgery of scannable values).
- Send one confirmation email via Resend containing: order summary, all QR codes belonging to the order (a combo order shows both the match QR(s) and showing QR(s)), and the no-refunds policy line.
- No formal donation receipt — this is a standard order confirmation, matching the product decision that the site is not a donation flow.
- No reminder emails and no SMS in v1.

## 7. Check-in / Scanning System

- Route: `/checkin`, gated by a single shared password (see §9) — one login shared by all door volunteers, no individual staff accounts.
- Volunteer selects the active session context (Match, Showing 1, Showing 2, or Showing 3) before scanning, since a combo ticket's QR tokens are session-specific and a scan must be validated against the correct gate.
- Scanning opens the device camera in-browser (no native app) and decodes the QR token client-side, then calls `POST /api/checkin/scan` with the token and selected session id.
- Server looks up the `admissions` row by `qr_token` and `session_id`:
  - Not found / wrong session → reject, show error.
  - Found, `checked_in_at IS NULL` → mark `checked_in_at = now()`, return success (green state).
  - Found, already checked in → return "already used" (red state) with the original check-in timestamp, to catch duplicate/shared tickets.
- No offline mode in v1 — assumes venue network connectivity at SEAP and Main Field.

## 8. Admin Dashboard

- Route: `/admin`, gated by a shared password (separate from the check-in password, or the same — organizer's call at implementation time).
- Shows, per session (each showing + the match): capacity (if any), tickets sold, seats remaining, checked-in count.
- Shows total revenue across all orders.
- CSV export of `orders` (buyer name/email/phone, ticket type, showing, amount, payment status, timestamp) for reconciliation with The Ezer Foundation.
- No further admin functionality (no manual comp-ticket issuance, no promo codes, no order editing) in v1, matching the "keep it simple" product decision.

## 9. Authentication & Access Control

- **Buyers:** no accounts — guest checkout only.
- **Admin & check-in:** no individual user accounts; each surface is gated by a shared password checked server-side (e.g. Next.js middleware verifying a signed session cookie issued after a correct password submission). Credentials stored as environment variables (hashed), never hardcoded.
- No role system beyond "public," "check-in," and "admin" — deliberately minimal given the one-off nature of the event.

## 10. API Surface (indicative)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/sessions` | GET | Public: list sessions with live remaining-seat counts |
| `/api/checkout/init` | POST | Create pending order, initialize Paystack transaction |
| `/api/webhooks/paystack` | POST | Paystack webhook — source of truth for payment success |
| `/api/checkin/scan` | POST | Validate + mark an admission checked in (checkin-gated) |
| `/api/admin/summary` | GET | Sales/attendance aggregates (admin-gated) |
| `/api/admin/orders/export` | GET | CSV export (admin-gated) |
| `/api/contact` | POST | Partner/sponsor inquiry form → email to organizers |

## 11. Non-Functional Requirements

- **Performance:** marketing pages (Home, About, Impact) statically generated or ISR'd; checkout, admin, and check-in are dynamic. Mobile-first — this is the primary target given expected traffic patterns.
- **Availability:** no formal uptime SLA or monitoring/alerting configured for v1 (explicit product decision) — Vercel's platform-level reliability is considered sufficient for a short-lived event site.
- **Traffic:** moderate on-sale spike expected; standard Vercel/Supabase scaling plus the atomic-update capacity safeguard (§4) is sufficient — no queueing or rate-limiting layer planned for v1.
- **Accessibility:** good-faith basics — semantic HTML, keyboard navigation, visible focus states, sufficient color contrast, alt text on meaningful images, reduced-motion support, accessible button labels, proper heading hierarchy. No formal WCAG 2.1 AA audit.
- **Security:** Paystack webhook signature verification mandatory; no card data ever touches the application (Paystack-hosted checkout handles PCI scope); QR tokens are unguessable and single-use; all secrets in environment variables; input validation on every form (Zod recommended).
- **Browser support:** modern evergreen browsers, mobile Safari/Chrome prioritized.
- **Language:** English only.

## 12. Environments & Deployment

- **Production:** Vercel production deployment on the organizer's chosen domain, connected to the production Supabase project, live Paystack keys.
- **Preview:** Vercel's automatic per-branch/PR preview deployments serve as the de facto staging environment — no separate persistent staging site or database. Preview deployments should use **Paystack test-mode keys** to avoid real charges during development/QA.
- **Ownership:** the organizing team creates and owns the Vercel, Supabase, Paystack, and domain accounts.
- **Monitoring:** none configured for v1 (explicit product decision) — issues are checked manually.

## 13. Third-Party Services Summary

| Service | Purpose | Key concern |
|---|---|---|
| Paystack | Payment collection, refunds (oversold edge case) | Webhook signature verification; test vs. live keys per environment |
| Supabase | Postgres database | Row-locking/atomic updates for capacity enforcement |
| Vercel | Hosting/deployment | Production + preview only, no dedicated staging |
| Resend | Transactional email | Confirmation email deliverability |

## 14. Known Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Overselling a showing due to no pre-checkout seat hold | Atomic capacity-checked UPDATE at webhook time; automatic refund + apology email for the rare conflict case (§4.3) |
| Client-side payment callback spoofing / trusting the redirect alone | Webhook is the only source of truth for `payment_status = 'success'` |
| Duplicate ticket use (screenshot shared with a friend) | Each `admissions` row is single-use; second scan returns "already used" with original timestamp |
| Paystack webhook delivery failure/delay | Idempotent processing keyed on `paystack_reference`; consider a manual "reconcile from Paystack dashboard" fallback for admins |
| Barbie IP/copyright exposure | Confirmed out of scope for this build — rights handled by the organizing team offline; site still follows the approved spec's direction to read as *The Joy Project*, not an official Barbie site |
| Placeholder photography at launch | Image assets structured for easy replacement (e.g. a single images config/folder) so real event photography can be swapped in without a rebuild of layout code |

## 15. Out of Scope / Future Considerations

- User accounts, order history, ticket transfer/resale.
- SMS notifications, reminder emails.
- Multi-currency support.
- Formal WCAG 2.1 AA compliance.
- Dedicated staging environment/database.
- Uptime monitoring/alerting.
- Vendor registration/payment for Meet & Shop.
- Discount codes, comp tickets, group/sponsor ticket flows.

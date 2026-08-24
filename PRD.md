# The Joy Project — Product Requirements Document (PRD)

**Status:** Locked scope, ready for design/build handoff
**Companion document:** TRD.md (technical requirements)
**Design source of truth:** `thejoyprojectapprovedwebsitebuildguide.md` (approved build spec) + this PRD. Where the two conflict, this PRD and the decisions below win — the approved build spec's example dates/times/venue names are placeholders from the mockup, not final content.

---

## 1. Overview

The Joy Project is a university event website built around two ticketed experiences held on consecutive days, run in partnership with **The Ezer Foundation** to raise awareness and funds supporting children with disabilities:

1. **Barbie Movie Marathon** — Saturday, September 26, 2026
2. **Charity Football Match** — Friday, September 25, 2026

A third, non-ticketed element — **Meet & Shop**, a two-day vendor pop-up run with **RUN Marketplace** (an on-campus commerce community) — runs alongside the main events but is *not* one of the two core "events" in the site's design system.

The site's single primary conversion is **ticket purchase**. It is explicitly **not** a donation website: no donation CTA, thermometer, or fundraising counter anywhere on the site.

## 2. Goals

- Sell tickets to both events (and combo tickets) through a fast, mobile-first checkout powered by Paystack.
- Communicate the event's tone accurately: nostalgic, fun, inclusive, student-run — not a traditional NGO or a Barbie-branded fan site.
- Make capacity constraints (100 seats/movie showing) transparent and prevent overselling.
- Get tickets into attendees' hands (QR code by email) and let volunteers check people in quickly at the door.
- Give organizers just enough visibility (a lightweight admin dashboard) to track sales and attendance without building a full back office.

## 3. Non-Goals (v1)

- No donation/fundraising functionality of any kind.
- No user accounts, login, or buyer order history.
- No seat maps / assigned seating.
- No ticket transfer, resale, or refund self-service.
- No SMS messaging.
- No multi-language support.
- No vendor registration/payment system for Meet & Shop (it's free/open, informational only).
- No formal WCAG audit (good-faith accessibility basics only).

## 4. Audience

Primary audience: university students. The approved brand spec is explicit that both events must visually and narratively read as mixed-gender and inclusive — the Barbie marathon is not "a girls' event" and the football match is not "boys play, girls watch." Everyone is invited to both.

## 5. Events, Schedule & Venues

### 5.1 Charity Football Match
- **Date:** Friday, September 25, 2026
- **Kickoff:** 3:00 PM
- **Venue:** Main Field
- **Attendance:** Open/uncapped — the match ticket is an entry token, not a capacity control.

### 5.2 Barbie Movie Marathon
- **Date:** Saturday, September 26, 2026
- **Venue:** SEAP
- **Format:** 3 showings, each a different film (exact titles TBD — to be selected from the Barbie film catalog; rights/licensing confirmed as handled by the organizing team). Each showing block is 2 hours 20 minutes, with a 15-minute changeover between showings. All showings finish by 7:00 PM.

| Showing | Window |
|---|---|
| 1 | 10:00 AM – 12:20 PM |
| *changeover* | 12:20 – 12:35 PM |
| 2 | 12:35 – 2:55 PM |
| *changeover* | 2:55 – 3:10 PM |
| 3 | 3:10 – 5:30 PM |

5:30–7:00 PM is unused buffer, satisfying the "spanning 10am to 7pm, finishing by 7pm" constraint.

- **Capacity:** 100 seats per showing, general admission (no assigned seats). A Saturday-inclusive ticket (single-day or combo) requires the buyer to select exactly one of the three showings at checkout — it does not grant access to all three.

### 5.3 Meet & Shop (RUN Marketplace pop-up)
- **Dates:** Both event days — Friday 25th and Saturday 26th September 2026, at or near the main venues.
- **Access:** Free and open to anyone; no ticket required.
- **Site treatment:** Not a homepage "event card" (the approved design system is built around exactly two event cards). Instead, it's covered on the **Get Involved** page alongside partner/sponsor information.

## 6. Ticketing Model

| Ticket | Price | Grants |
|---|---|---|
| 2-Day Combo | ₦1,800 | Friday match entry + one selected Saturday showing |
| Single Day | ₦1,000 | Either Friday match entry **or** one selected Saturday showing (same price either day) |

Rules locked for v1:
- General admission only — no seat selection UI.
- No maximum ticket quantity per order.
- No waitlist — a sold-out showing simply shows "Sold Out" and disables checkout for that showing.
- Tickets are non-transferable (locked to the buyer named at checkout) and there is no self-service resale/transfer flow.
- **All sales are final — no refunds**, except the narrow organizer-side edge case described in TRD §8 (a payment race condition oversells a showing). This exception is an engineering safety net, not a buyer-facing refund policy, and should not be advertised as one.
- Orders collect buyer info only (name, email, phone) — not a name per individual ticket in a multi-ticket order.
- No group/corporate/sponsor ticket flows, discount codes, or comp-ticket flow in v1.
- Live remaining-seat counts are shown per Saturday showing (e.g. "23/100 left"); the Friday match shows no counter since it's uncapped.
- Seats are **not** provisionally held during checkout — a seat is only confirmed once Paystack confirms payment (see TRD §8 for how overselling is still prevented).
- Paystack's transaction fee is added on top of the ticket price at checkout (not absorbed into the ₦1,800/₦1,000 price).

## 7. User Journeys

### 7.1 Buyer journey
Homepage → discover the two events → view schedule/details → choose ticket type (combo / Friday-only / Saturday-only, selecting a showing if Saturday is included) → guest checkout (name, email, phone) → Paystack payment → confirmation page + confirmation email containing QR code(s) → attend, QR scanned at the door.

### 7.2 Door volunteer journey
Open check-in page on phone → log in with the shared check-in password → select the current gate/session context (Match, Showing 1/2/3) → scan attendee QR → see instant valid/already-used result.

### 7.3 Organizer journey
Log into admin dashboard → see tickets sold and remaining per showing/match, total revenue, and check-in counts → export orders as CSV if needed for reconciliation with The Ezer Foundation.

### 7.4 Partner/vendor journey
Visit Get Involved page → read about Meet & Shop and partnership opportunities → submit an inquiry via the partner/sponsor contact form → receives a reply from the organizing team offline.

## 8. Site Structure

Primary navigation (fixed per the approved brand spec): **Home · About · Events · Impact · Get Involved · Get Your Ticket**

| Page | Purpose |
|---|---|
| Home | Approved single-page composition: Nav → Hero → Events Intro → 2 Event Cards → Why We're Doing This → Final CTA → Footer. No sections beyond this list. |
| About | The Joy Project story and its partnership with The Ezer Foundation. |
| Events | Full detail for each event: schedule table (all 3 Saturday showings + Friday match), venue, and the ticket purchase entry point. Functions as the "schedule" page. |
| Impact | Expands on "why we're doing this" — inclusion-forward, dignity-first messaging per the approved copy direction; explicitly avoids pity-based imagery. |
| Get Involved | Partner/sponsor inquiry form + Meet & Shop / RUN Marketplace information. No volunteer sign-up in v1. |
| Get Your Ticket | Ticket selection → checkout flow → Paystack → confirmation. |
| Terms & FAQ *(footer link, not primary nav)* | No-refunds policy, privacy policy, general liability disclaimer, common questions. |
| Admin dashboard *(unlisted, password-protected)* | Sales/attendance overview, CSV export. |
| Check-in scanner *(unlisted, password-protected)* | QR scanning for door volunteers. |

## 9. Content & Design Requirements

Full visual system (colors, typography, layout, copy, motion, accessibility, component architecture) is defined in the approved build spec and should be treated as authoritative for anything not explicitly overridden by this PRD. Key points carried into scope:

- Warm cream background, navy/pink/green/blue/yellow accent system; Inter for body/UI, Caveat for handwritten accents.
- Scrapbook/memory aesthetic (Polaroid photos, tape, hand-drawn underlines) used restrained — roughly 80–90% clean interface, 10–20% handmade detail.
- Mobile-first responsive design; the mobile layout is intentionally recomposed (not just scaled down) per the approved spec's mobile order.
- Real event photography is preferred per the approved spec's "no stock, no AI-looking people" direction; **v1 will launch with placeholder imagery** (real photos aren't available yet) in an easily swappable location, and photography will be replaced once real event photos exist.
- No donation dashboard, donation CTA, or "Donate Now" button anywhere.

## 10. Admin & Operations Requirements

- A simple, password-protected admin dashboard showing: tickets sold and remaining per showing and for the match, total revenue, check-in counts, and a CSV export of orders.
- A web-based QR check-in scanner (opens the phone camera in-browser), password-protected, with one shared login for all door volunteers.

## 11. Notifications

- Order confirmation email only (containing the QR code(s)), sent immediately after successful payment.
- No reminder emails and no SMS in v1 — phone numbers are collected for contact/emergency purposes only.
- Partner/sponsor form submissions are emailed to the organizing team.

## 12. Legal & Compliance

- A Privacy Policy covering collection/use of name, email, phone, and payment data (payment data itself is handled entirely by Paystack — the site never stores card details).
- A general liability disclaimer (attendance at your own risk) covers both events; no formal signed waiver and no age gate in v1.
- Public performance rights for the films screened, and any use of Barbie-related name/imagery, are confirmed as cleared/handled by the organizing team outside this build. (Note: the approved design spec still directs the site to read as *The Joy Project*, not as an official Barbie-branded site — Barbie is one component of the story, not the whole brand.)
- The Ezer Foundation is the named charitable beneficiary/partner and should appear in the footer, About page, and Terms page as appropriate.

## 13. Success Metrics

- Tickets sold vs. 100-seat capacity per showing (and total Friday attendance via ticket count, since uncapped).
- Checkout completion rate (started checkout → completed payment).
- Page load performance and mobile usability (given mobile-first priority).
- Zero overselling incidents beyond the documented edge case in TRD §8.

## 14. Open Items Carried Into Build

- Final film titles for the 3 Saturday showings (to be selected from the Barbie catalog).
- Real event photography to replace placeholder imagery.
- Exact copy/details for the About and Impact pages beyond the approved spec's direction.
- Domain name (hosting on Vercel is decided; domain registration is still the organizer's task).

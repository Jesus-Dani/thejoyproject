export const SITE_NAME = "The Joy Project";

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
] as const;

export const TICKET_CTA = { href: "/get-your-ticket", label: "Get Your Ticket" } as const;

// Static event facts for marketing copy (Home, event cards). The Events page
// and checkout flow pull live seat counts from /api/sessions, these are
// display-only and mirror PRD §5 / the seeded `sessions` rows.
export const MATCH_EVENT = {
  title: "CHARITY MATCH",
  subtitle: "pick your team. bring the noise.",
  date: "Friday, September 25, 2026",
  time: "Kickoff 3:00 PM",
  venue: "Main Field",
} as const;

export const MOVIE_EVENT = {
  title: "BARBIE MOVIE MARATHON",
  subtitle: "popcorn. pink. questionable singing.",
  date: "Saturday, September 26, 2026",
  time: "Showings from 10:00 AM",
  venue: "SEAP",
} as const;

export const MOVIE_SHOWING_WINDOWS = [
  { name: "Showing 1", window: "10:00 AM – 12:20 PM" },
  { name: "Showing 2", window: "12:35 PM – 2:55 PM" },
  { name: "Showing 3", window: "3:10 PM – 5:30 PM" },
] as const;

export const TICKET_PRICES = {
  COMBO: 2200,
  FRIDAY_ONLY: 1000,
  SATURDAY_ONLY: 1500,
} as const;

export const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

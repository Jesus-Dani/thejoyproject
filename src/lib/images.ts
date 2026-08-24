/**
 * Single place mapping named image slots to files. All layout code should
 * import from here rather than hardcoding paths — swapping placeholder
 * imagery for real event photography later means editing this file only.
 */
export const IMAGES = {
  heroBarbie: { src: "/images/hero-barbie.jpeg", alt: "A crowd of students watching an outdoor movie screening at sunset" },
  heroFootball: { src: "/images/placeholders/hero-football.svg", alt: "Students playing football together" },
  barbieCard: { src: "/images/events/barbie-ticket.png", alt: "Barbie Movie Marathon ticket — Saturday, September 26, SEAP" },
  matchCard: { src: "/images/events/charity-match-ticket.png", alt: "Charity Match ticket — Friday, September 25, 3:00 PM, Main Field" },
  impact: { src: "/images/placeholders/impact.svg", alt: "Joyful, inclusive group of students together" },
  ctaMovieNight: { src: "/images/placeholders/cta-movie-night.svg", alt: "Memory from a past movie night" },
  ctaFootball: { src: "/images/placeholders/cta-football.svg", alt: "Memory from a past football match" },
  ctaTogether: { src: "/images/placeholders/cta-together.svg", alt: "Students together" },
  about: { src: "/images/placeholders/about.svg", alt: "The Joy Project and The Ezer Foundation" },
  getInvolved: { src: "/images/placeholders/get-involved.svg", alt: "Meet & Shop, the RUN Marketplace pop-up" },
} as const;

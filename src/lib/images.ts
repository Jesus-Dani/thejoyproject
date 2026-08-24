/**
 * Single place mapping named image slots to files. All layout code should
 * import from here rather than hardcoding paths — swapping placeholder
 * imagery for real event photography later means editing this file only.
 */
export const IMAGES = {
  heroBarbie: { src: "/images/placeholders/hero-barbie.svg", alt: "University students watching the Barbie marathon together" },
  heroFootball: { src: "/images/placeholders/hero-football.svg", alt: "Students playing football together" },
  barbieCard: { src: "/images/placeholders/barbie-card.svg", alt: "A mixed group of students at the Barbie movie marathon" },
  matchCard: { src: "/images/placeholders/match-card.svg", alt: "A mixed group of students playing the charity football match" },
  impact: { src: "/images/placeholders/impact.svg", alt: "Joyful, inclusive group of students together" },
  ctaMovieNight: { src: "/images/placeholders/cta-movie-night.svg", alt: "Memory from a past movie night" },
  ctaFootball: { src: "/images/placeholders/cta-football.svg", alt: "Memory from a past football match" },
  ctaTogether: { src: "/images/placeholders/cta-together.svg", alt: "Students together" },
  about: { src: "/images/placeholders/about.svg", alt: "The Joy Project and The Ezer Foundation" },
  getInvolved: { src: "/images/placeholders/get-involved.svg", alt: "Meet & Shop, the RUN Marketplace pop-up" },
} as const;

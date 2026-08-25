/**
 * Single place mapping named image slots to files. All layout code should
 * import from here rather than hardcoding paths, so swapping placeholder
 * imagery for real event photography later means editing this file only.
 */
export const IMAGES = {
  heroBarbie: { src: "/images/hero-barbie.jpeg", alt: "A crowd of students watching an outdoor movie screening at sunset" },
  heroFootball: { src: "/images/football-match.jpeg", alt: "Cleats and a football on the pitch at sunset" },
  barbieCard: { src: "/images/events/barbie-ticket.png", alt: "Barbie Movie Marathon ticket, Saturday, September 26, SEAP" },
  matchCard: { src: "/images/events/charity-match-ticket.png", alt: "Charity Match ticket, Friday, September 25, 3:00 PM, Main Field" },
  impact: { src: "/images/impact-inclusion.jpeg", alt: "A joyful boy smiling in his wheelchair" },
  ctaMovieNight: { src: "/images/movie-night.jpeg", alt: "Friends sharing popcorn at the movies" },
  ctaFootball: { src: "/images/football-match.jpeg", alt: "Cleats and a football on the pitch at sunset" },
  ctaTogether: { src: "/images/students-hanging-out.jpeg", alt: "A big group of students together at an outdoor movie night" },
  about: { src: "/images/about.jpeg", alt: "A group of friends laughing together" },
  meetShop: { src: "/images/meet-and-shop.jpeg", alt: "Students browsing vendor tables at a RUN Marketplace pop-up" },
  foodCourt1: { src: "/images/ice-cream.jpeg", alt: "Cups of ice cream" },
  foodCourt2: { src: "/images/corndogs.jpeg", alt: "Corndogs with ketchup and mustard" },
  foodCourt3: { src: "/images/shawarma.jpeg", alt: "A loaded shawarma wrap" },
  foodCourt4: { src: "/images/spaghetti.jpeg", alt: "A plate of spaghetti with peppers" },
  foodCourt5: { src: "/images/cake.jpeg", alt: "Cups of layered cake dessert" },
} as const;

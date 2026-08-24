import Hero from "@/components/hero/Hero";
import EventsIntro from "@/components/events/EventsIntro";
import EventCard from "@/components/events/EventCard";
import ImpactSection from "@/components/impact/ImpactSection";
import FinalCta from "@/components/home/FinalCta";
import { IMAGES } from "@/lib/images";
import { MATCH_EVENT, MOVIE_EVENT } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.85fr_1.15fr_1.15fr] lg:items-start lg:gap-8">
          <EventsIntro />
          <EventCard
            number="01"
            title={MOVIE_EVENT.title}
            description={MOVIE_EVENT.subtitle}
            image={IMAGES.barbieCard.src}
            imageAlt={IMAGES.barbieCard.alt}
            theme="pink"
            date={MOVIE_EVENT.date}
            time={MOVIE_EVENT.time}
            location={MOVIE_EVENT.venue}
            href="/events#barbie"
          />
          <EventCard
            number="02"
            title={MATCH_EVENT.title}
            description={MATCH_EVENT.subtitle}
            image={IMAGES.matchCard.src}
            imageAlt={IMAGES.matchCard.alt}
            theme="green"
            date={MATCH_EVENT.date}
            time={MATCH_EVENT.time}
            location={MATCH_EVENT.venue}
            href="/events#match"
          />
        </div>
      </section>

      <ImpactSection />
      <FinalCta />
    </>
  );
}

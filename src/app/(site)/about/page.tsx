import type { Metadata } from "next";
import Image from "next/image";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "About: The Joy Project" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">about the joy project</h1>
        <HandDrawnUnderline color="pink" className="mt-3 w-32" />
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="relative mx-auto w-full max-w-[320px] lg:order-2 lg:mx-0">
          <div className="overflow-hidden rounded-[4px] border-[6px] border-white bg-cream shadow-[0_18px_40px_rgba(16,34,56,0.22)]">
            <Image
              src={IMAGES.about.src}
              alt={IMAGES.about.alt}
              width={854}
              height={1280}
              sizes="320px"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-navy/80 lg:order-1">
          <p>
            The Joy Project started as a simple idea: bring back the things
            that made growing up on campus feel good, movie nights, football
            with your friends, an excuse to be a little ridiculous together,
            and point that energy somewhere that matters.
          </p>
          <p>
            So we built two days around it. A Barbie movie marathon that
            everyone is invited to, boys and girls alike, and a charity
            football match where the same is true on the pitch. No one sits
            out because of who they are.
          </p>
          <p>
            We&rsquo;re running both events in partnership with{" "}
            <strong className="text-navy">The Ezer Foundation</strong>, which
            supports and empowers children with disabilities. Every ticket
            sold helps fund that work, not as an afterthought, but as the
            actual reason the two days exist.
          </p>
          <p>
            This isn&rsquo;t a donation drive dressed up as an event. It&rsquo;s
            a real event, worth attending on its own, that happens to be
            doing something good on the side.
          </p>
        </div>
      </div>
    </div>
  );
}

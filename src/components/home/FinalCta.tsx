import PrimaryButton from "@/components/ui/PrimaryButton";
import Polaroid from "@/components/ui/Polaroid";
import { IMAGES } from "@/lib/images";

function CirclePart() {
  return (
    <span className="relative inline-block px-1">
      part
      <svg
        viewBox="0 0 90 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 -inset-y-2"
      >
        <path
          d="M6 20 C 4 6, 30 2, 45 3 C 68 4, 86 10, 84 21 C 82 33, 55 38, 40 37 C 18 36, 4 30, 6 20 Z"
          fill="none"
          stroke="var(--color-yellow)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function FinalCta() {
  return (
    <section className="bg-blue">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-16 sm:px-10 md:px-16 md:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <h2 className="max-w-sm text-3xl font-extrabold leading-tight text-cream sm:text-4xl">
          come watch.
          <br />
          come play.
          <br />
          come be <CirclePart /> of it.
        </h2>

        <div className="relative mx-auto flex h-56 w-full max-w-xs items-center justify-center sm:h-64 sm:max-w-sm lg:mx-0 lg:h-72 lg:max-w-none lg:flex-1">
          <Polaroid
            image={IMAGES.ctaMovieNight.src}
            alt={IMAGES.ctaMovieNight.alt}
            rotation={-8}
            className="absolute left-[6%] top-0 w-36 sm:w-44"
          />
          <Polaroid
            image={IMAGES.ctaFootball.src}
            alt={IMAGES.ctaFootball.alt}
            rotation={5}
            className="absolute right-[8%] top-4 w-36 sm:w-44"
          />
          <Polaroid
            image={IMAGES.ctaTogether.src}
            alt={IMAGES.ctaTogether.alt}
            rotation={-2}
            className="absolute bottom-0 left-1/2 w-36 -translate-x-1/2 sm:w-44"
          />
        </div>

        <div className="max-w-xs">
          <p className="text-xl leading-snug text-cream/95">
            grab your ticket and let&rsquo;s make it a day to remember.
          </p>
          <PrimaryButton
            label="GET YOUR TICKET →"
            href="/get-your-ticket"
            variant="navy"
            className="mt-6 ring-2 ring-yellow/70 ring-offset-2 ring-offset-blue"
          />
        </div>
      </div>
    </section>
  );
}

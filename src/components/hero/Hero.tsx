import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import HeroPhoto from "./HeroPhoto";

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-10 md:px-16 md:pb-24 md:pt-16">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[2fr_3fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <h1 className="text-[3rem] font-extrabold leading-[0.98] tracking-tight text-navy sm:text-[3.75rem] lg:text-[4.5rem]">
            remember
            <br />
            when joy
            <br />
            was this
            <br />
            easy?
          </h1>
          <HandDrawnUnderline color="pink" className="mt-3 w-40" />

          <p className="mt-8 max-w-xs font-hand text-2xl leading-snug text-blue">
            <span aria-hidden="true" className="mr-1">
              ↳
            </span>
            and yes,
            <br />
            Barbie is
            <br />
            involved. <span className="text-pink">♥</span>
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <HeroPhoto />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <p className="max-w-md text-lg leading-relaxed text-navy/80 sm:text-xl">
            We&rsquo;re bringing back the things we loved growing up:
            movies, football, friends and feel-good chaos. All for a reason
            that matters.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryButton label="JOIN THE JOY" href="/get-your-ticket" variant="pink" />
            <Link
              href="/events"
              className="text-sm font-bold text-navy underline decoration-blue decoration-2 underline-offset-4 hover:text-navy/80"
            >
              See the events →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

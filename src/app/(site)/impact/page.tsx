import type { Metadata } from "next";
import Image from "next/image";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import HandwrittenNote from "@/components/ui/HandwrittenNote";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "Impact: The Joy Project" };

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">inclusion is part of joy.</h1>
        <HandDrawnUnderline color="blue" className="mt-3 w-32" />
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="space-y-5 text-lg leading-relaxed text-navy/80">
          <p>
            The Joy Project exists to create moments of happiness and
            connection, and to use those moments to support and empower
            children with disabilities.
          </p>
          <p>
            Through these events, we&rsquo;re raising awareness and funds to
            help create a more inclusive world where every child has the
            chance to thrive.
          </p>
          <p>
            That&rsquo;s not a slogan we attach to a fun weekend to make it
            feel worthwhile, it&rsquo;s the actual point. In partnership with{" "}
            <strong className="text-navy">The Ezer Foundation</strong>, every
            ticket goes toward programs that give kids with disabilities the
            same shot at joy, friendship and participation that the rest of
            us take for granted.
          </p>
          <p>
            We&rsquo;re not asking you to feel sorry for anyone. We&rsquo;re
            asking you to come have a genuinely good time, and in doing
            that, you&rsquo;re already part of the work.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[320px] lg:mx-0">
          <div className="overflow-hidden rounded-[4px] border-[6px] border-white bg-cream shadow-[0_18px_40px_rgba(16,34,56,0.22)]">
            <Image
              src={IMAGES.impact.src}
              alt={IMAGES.impact.alt}
              width={667}
              height={1000}
              sizes="320px"
              className="h-auto w-full object-contain"
            />
          </div>
          <HandwrittenNote
            text={"joy shared\nis joy\nmultiplied. :)"}
            background="yellow"
            rotation={-3}
            className="absolute -bottom-6 -right-4 w-40 sm:-right-6"
          />
        </div>
      </div>
    </div>
  );
}

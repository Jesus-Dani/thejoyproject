import Image from "next/image";
import { IMAGES } from "@/lib/images";
import HandwrittenNote from "@/components/ui/HandwrittenNote";

export default function ImpactSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-24">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-8">
        <h2 className="font-hand text-4xl font-bold text-navy sm:text-5xl lg:col-start-1 lg:row-start-1">
          why we&rsquo;re doing this
        </h2>

        <div className="relative lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
            <Image src={IMAGES.impact.src} alt={IMAGES.impact.alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:-right-6">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-2 left-1/2 h-5 w-12 -translate-x-1/2 -rotate-2 bg-yellow/80"
              />
              <HandwrittenNote
                text={"joy shared\nis joy\nmultiplied. :)"}
                background="yellow"
                rotation={4}
                className="w-40"
              />
            </div>
          </div>
        </div>

        <div className="max-w-lg space-y-5 text-lg leading-relaxed text-navy/80 lg:col-start-1 lg:row-start-2">
          <p>
            The Joy Project exists to create moments of happiness and
            connection — and to use those moments to support and empower
            children with disabilities.
          </p>
          <p>
            Through these events, we&rsquo;re raising awareness and funds to
            help create a more inclusive world where every child has the
            chance to thrive.
          </p>
        </div>
      </div>
    </section>
  );
}

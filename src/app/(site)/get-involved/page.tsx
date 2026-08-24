import type { Metadata } from "next";
import Image from "next/image";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import ContactForm from "./ContactForm";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "Get Involved — The Joy Project" };

export default function GetInvolvedPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">get involved</h1>
        <HandDrawnUnderline color="pink" className="mt-3 w-32" />
      </header>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:order-2">
          <Image src={IMAGES.getInvolved.src} alt={IMAGES.getInvolved.alt} fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
        </div>
        <div className="lg:order-1">
          <h2 className="text-2xl font-extrabold text-navy">Meet &amp; Shop</h2>
          <p className="mt-1 font-hand text-xl text-blue">a pop-up with RUN Marketplace</p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-navy/80">
            Alongside both event days, <strong className="text-navy">RUN Marketplace</strong> — our
            on-campus commerce community — is running a two-day vendor
            pop-up at the venues. It&rsquo;s free and open to everyone, no
            ticket required: come browse, shop, and support student
            businesses between the movie showings or before kickoff.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-navy/70">
            <li>Friday, September 25, 2026 — alongside the Charity Match, Main Field</li>
            <li>Saturday, September 26, 2026 — alongside the Barbie Marathon, SEAP</li>
          </ul>
        </div>
      </section>

      <section className="mt-16 max-w-xl">
        <h2 className="text-2xl font-extrabold text-navy">Partner or sponsor with us</h2>
        <p className="mt-2 text-navy/70">
          Brand, vendor, or organization interested in partnering with The
          Joy Project? Tell us a bit about what you have in mind.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

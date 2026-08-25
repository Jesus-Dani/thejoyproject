import type { Metadata } from "next";
import Link from "next/link";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Get Involved — The Joy Project" };

export default function GetInvolvedPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">get involved</h1>
        <HandDrawnUnderline color="pink" className="mt-3 w-32" />
        <p className="mt-6 text-lg text-navy/80">
          Looking for Meet &amp; Shop, the RUN Marketplace vendor pop-up? See{" "}
          <Link href="/events#also-happening" className="font-semibold text-navy underline underline-offset-4">
            what&rsquo;s also happening
          </Link>{" "}
          on the Events page.
        </p>
      </header>

      <section className="mt-14 max-w-xl">
        <h2 className="text-2xl font-extrabold text-navy">Partner or sponsor with us</h2>
        <p className="mt-2 text-navy/70">
          Brand, vendor, or organization interested in partnering with The
          Joy Project — including a table at Meet &amp; Shop? Tell us a bit
          about what you have in mind.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

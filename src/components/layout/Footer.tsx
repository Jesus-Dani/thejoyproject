import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";

export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-cream">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-5 py-12 text-center sm:px-10 md:flex-row md:items-start md:justify-between md:px-16 md:text-left">
        <p className="text-base font-bold text-navy">the joy project ♡</p>

        <nav aria-label="Social" className="flex flex-col items-center gap-2 md:items-start">
          <ul className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-navy/80 md:justify-start">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-navy" target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link href="/terms" className="text-xs font-medium text-navy/50 hover:text-navy/80">
            Terms &amp; FAQ
          </Link>
        </nav>

        <div className="max-w-[220px]">
          <p className="font-hand text-xl leading-tight text-navy">
            made for good times
            <br />
            and greater things.
          </p>
          <HandDrawnUnderline color="blue" className="mt-1 w-24" />
        </div>
      </div>
    </footer>
  );
}

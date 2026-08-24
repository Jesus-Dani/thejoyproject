"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, TICKET_CTA } from "@/lib/constants";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";

function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="text-pink">
      <path
        d="M12 2 L14.2 9.2 L21.5 9.5 L15.6 14 L17.8 21 L12 16.8 L6.2 21 L8.4 14 L2.5 9.5 L9.8 9.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-20 border-b border-navy/10 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-10 md:px-16">
        <Link href="/" className="flex items-baseline gap-1.5 text-base font-extrabold leading-none text-navy">
          <span>
            the joy
            <br className="hidden" /> project
          </span>
          <Star />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="relative pb-1 text-sm font-semibold text-navy/80 hover:text-navy"
          >
            Home
            {isActive("/") && (
              <HandDrawnUnderline color="blue" className="absolute -bottom-0.5 left-0" />
            )}
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative pb-1 text-sm font-semibold text-navy/80 hover:text-navy"
            >
              {link.label}
              {isActive(link.href) && (
                <HandDrawnUnderline color="blue" className="absolute -bottom-0.5 left-0" />
              )}
            </Link>
          ))}
          <Link
            href={TICKET_CTA.href}
            className="relative rounded-button bg-navy px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-navy/90"
          >
            {TICKET_CTA.label}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="z-50 flex flex-col gap-1 border-t border-navy/10 bg-cream px-5 py-4 md:hidden"
        >
          <Link href="/" onClick={() => setOpen(false)} className="rounded-button px-2 py-3 text-base font-semibold text-navy">
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-button px-2 py-3 text-base font-semibold text-navy"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={TICKET_CTA.href}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-button bg-navy px-4 py-3 text-center text-base font-bold text-cream"
          >
            {TICKET_CTA.label}
          </Link>
        </nav>
      )}
    </header>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

export type PrimaryButtonProps = {
  label: string;
  href: string;
  variant?: "pink" | "navy" | "ghost";
  className?: string;
  icon?: ReactNode;
};

const VARIANTS: Record<string, string> = {
  navy: "bg-navy text-cream hover:bg-navy/90",
  pink: "bg-pink text-navy hover:bg-pink/90",
  ghost: "bg-transparent text-navy border-2 border-navy hover:bg-navy/5",
};

/** Squared-off, paper-like button — never an oversized pill. */
export default function PrimaryButton({
  label,
  href,
  variant = "navy",
  className = "",
  icon,
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-button px-6 py-3.5 text-sm font-bold tracking-wide transition-colors duration-[180ms] ${VARIANTS[variant]} ${className}`}
    >
      {label}
      {icon}
    </Link>
  );
}

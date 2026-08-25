import type { Metadata } from "next";
import { Comic_Neue, Caveat } from "next/font/google";
import "./globals.css";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Joy Project",
  description:
    "Remember when joy was this easy? Barbie Movie Marathon and Charity Football Match: two days of joy, friendship and purpose, in partnership with The Ezer Foundation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${comicNeue.variable} ${caveat.variable}`}>
      <body className="min-h-dvh bg-cream text-navy antialiased">{children}</body>
    </html>
  );
}

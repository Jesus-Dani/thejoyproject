import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import { getSupabaseAdmin } from "@/lib/supabase";
import { IMAGES } from "@/lib/images";
import type { SessionRow } from "@/lib/database.types";

export const metadata: Metadata = { title: "Events — The Joy Project" };
export const revalidate = 0;

export default async function EventsPage() {
  const supabase = getSupabaseAdmin();
  const { data: sessionsData } = await supabase
    .from("sessions")
    .select("*")
    .order("display_order", { ascending: true });
  const sessions = sessionsData as unknown as SessionRow[] | null;

  const match = sessions?.find((s) => s.type === "match");
  const showings = sessions?.filter((s) => s.type === "movie_showing") ?? [];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">the full schedule</h1>
        <HandDrawnUnderline color="blue" className="mt-3 w-32" />
        <p className="mt-6 text-lg text-navy/80">
          One match, three showings, two very different kinds of chaos. Pick
          your day (or grab the combo) and lock in a seat.
        </p>
      </header>

      <section id="match" className="mt-14 grid gap-8 rounded-card border border-navy/10 bg-white p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card md:order-2">
          <Image src={IMAGES.matchCard.src} alt={IMAGES.matchCard.alt} fill sizes="(min-width:768px) 480px, 100vw" className="object-cover" />
        </div>
        <div className="md:order-1">
          <span className="inline-block rounded-[3px] bg-green px-2 py-1 text-xs font-extrabold text-navy">02</span>
          <h2 className="mt-3 text-2xl font-extrabold text-navy">CHARITY MATCH</h2>
          <p className="mt-1 font-hand text-xl text-blue">pick your team. bring the noise.</p>
          {match && (
            <dl className="mt-4 space-y-1 text-sm text-navy/80">
              <div>{formatDate(match.event_date)}</div>
              <div>Kickoff {formatTime(match.start_time)}</div>
              <div>{match.venue}</div>
              <div className="pt-1 font-semibold text-navy">Open admission — no seat limit</div>
            </dl>
          )}
          <PrimaryButton label="Get a ticket" href="/get-your-ticket?type=FRIDAY_ONLY" variant="navy" className="mt-6" />
        </div>
      </section>

      <section id="barbie" className="mt-10 rounded-card border border-navy/10 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-block rounded-[3px] bg-pink px-2 py-1 text-xs font-extrabold text-navy">01</span>
            <h2 className="mt-3 text-2xl font-extrabold text-navy">BARBIE MOVIE MARATHON</h2>
            <p className="mt-1 font-hand text-xl text-blue">popcorn. pink. questionable singing.</p>
            {showings[0] && (
              <p className="mt-3 text-sm text-navy/70">{formatDate(showings[0].event_date)} · {showings[0].venue} · 100 seats per showing</p>
            )}
          </div>
          <PrimaryButton label="Get a ticket" href="/get-your-ticket?type=SATURDAY_ONLY" variant="pink" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {showings.map((s, i) => {
            const remaining = s.capacity === null ? null : Math.max(0, s.capacity - s.seats_sold);
            const soldOut = remaining === 0;
            return (
              <div key={s.id} className="rounded-card border border-navy/10 bg-cream p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Showing {i + 1}</p>
                <p className="mt-1 font-semibold text-navy">
                  {formatTime(s.start_time)}–{formatTime(s.end_time)}
                </p>
                <p className="mt-1 text-sm text-navy/60">{s.film_title ?? "Film TBA"}</p>
                <p className={`mt-3 text-sm font-bold ${soldOut ? "text-red-700" : "text-navy"}`}>
                  {soldOut ? "Sold Out" : remaining !== null ? `${remaining}/${s.capacity} left` : ""}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link href="/terms" className="text-sm font-semibold text-navy/60 underline underline-offset-4 hover:text-navy">
          Read the no-refunds policy and FAQ →
        </Link>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

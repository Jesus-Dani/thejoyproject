import Image from "next/image";
import Link from "next/link";

export type EventCardProps = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  theme: "pink" | "green";
  date: string;
  time: string;
  location: string;
  href: string;
};

const THEME = {
  pink: { chip: "bg-pink text-navy", panel: "bg-pink/25" },
  green: { chip: "bg-green text-navy", panel: "bg-green/30" },
};

/** An event poster, not a SaaS card: image up top, paper-like info area below. */
export default function EventCard({
  number,
  title,
  description,
  image,
  imageAlt,
  theme,
  date,
  time,
  location,
  href,
}: EventCardProps) {
  const t = THEME[theme];
  return (
    <article className="group overflow-hidden rounded-card border border-navy/10 bg-white transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
      <Link href={href} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
          <span
            className={`absolute left-3 top-3 rounded-[3px] px-2 py-1 text-xs font-extrabold ${t.chip}`}
          >
            {number}
          </span>
        </div>
        <div className={`p-5 ${t.panel}`}>
          <h3 className="text-lg font-extrabold tracking-wide text-navy">{title}</h3>
          <p className="mt-1 font-hand text-xl text-blue">{description}</p>
          <dl className="mt-3 grid gap-0.5 text-sm text-navy/70">
            <div className="flex gap-1">
              <dt className="sr-only">Date</dt>
              <dd>{date}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Time</dt>
              <dd>{time}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Location</dt>
              <dd>{location}</dd>
            </div>
          </dl>
          <span className="mt-4 inline-block text-sm font-bold text-navy underline decoration-blue decoration-2 underline-offset-4">
            GET THE DETAILS →
          </span>
        </div>
      </Link>
    </article>
  );
}

import Image from "next/image";

export type PolaroidProps = {
  image: string;
  alt: string;
  rotation?: number;
  tape?: boolean;
  tapeColor?: string;
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** A photograph framed like a physical print, pinned to the page. */
export default function Polaroid({
  image,
  alt,
  rotation = -4,
  tape = false,
  tapeColor = "var(--color-yellow)",
  caption,
  className = "",
  sizes = "(min-width: 768px) 320px, 60vw",
  priority = false,
}: PolaroidProps) {
  // A CSS position utility (e.g. "absolute" from a caller doing manual
  // placement) must fully replace the default "relative" rather than
  // combine with it: two position classes on one element is a same-
  // specificity conflict resolved by Tailwind's internal stylesheet order,
  // not by the order classes appear here, so it's not safe to just
  // concatenate both.
  const hasPositionOverride = /(^|\s)(static|relative|absolute|fixed|sticky)(\s|$)/.test(className);

  return (
    <figure
      className={`${hasPositionOverride ? "" : "relative "}bg-white p-2.5 pb-8 rounded-[2px] shadow-[0_10px_24px_rgba(16,34,56,0.18)] ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {tape && (
        <span
          aria-hidden="true"
          className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 opacity-85"
          style={{ background: tapeColor }}
        />
      )}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1px] bg-cream">
        <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-hand text-lg text-navy/80">{caption}</figcaption>
      )}
    </figure>
  );
}

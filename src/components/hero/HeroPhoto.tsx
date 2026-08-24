import Image from "next/image";
import { IMAGES } from "@/lib/images";
import MemoryNote from "./MemoryNote";

/**
 * The layered scrapbook photo composition on the hero's right side: a large
 * rotated main photograph, a smaller football photo overlapping it, and the
 * memory note pinned over the bottom.
 */
export default function HeroPhoto() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] border-[6px] border-white bg-cream shadow-[0_18px_40px_rgba(16,34,56,0.22)]"
        style={{ transform: "rotate(2deg)" }}
      >
        <Image src={IMAGES.heroBarbie.src} alt={IMAGES.heroBarbie.alt} fill priority sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
      </div>

      <div
        className="absolute -bottom-6 -left-8 w-[42%] overflow-hidden rounded-[4px] border-[5px] border-white shadow-[0_14px_30px_rgba(16,34,56,0.22)] sm:-left-10"
        style={{ transform: "rotate(-6deg)" }}
      >
        <div className="relative aspect-[4/3] w-full bg-cream">
          <Image src={IMAGES.heroFootball.src} alt={IMAGES.heroFootball.alt} fill sizes="240px" className="object-cover" />
        </div>
      </div>

      <MemoryNote className="absolute -bottom-8 right-1 sm:right-4" />
    </div>
  );
}

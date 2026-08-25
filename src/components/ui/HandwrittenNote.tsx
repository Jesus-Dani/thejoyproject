export type HandwrittenNoteProps = {
  text: string;
  rotation?: number;
  background?: "paper" | "yellow" | "pink";
  className?: string;
};

const BACKGROUNDS: Record<string, string> = {
  paper: "bg-[repeating-linear-gradient(var(--color-cream),var(--color-cream)_27px,rgba(16,34,56,0.08)_28px)] bg-white",
  yellow: "bg-yellow",
  pink: "bg-pink",
};

/** A small paper note with handwritten type: used sparingly, never for essential info. */
export default function HandwrittenNote({
  text,
  rotation = 3,
  background = "yellow",
  className = "",
}: HandwrittenNoteProps) {
  return (
    <div
      className={`whitespace-pre-line rounded-[2px] px-4 py-3 font-hand text-xl leading-tight text-navy shadow-[0_8px_18px_rgba(16,34,56,0.16)] ${BACKGROUNDS[background]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {text}
    </div>
  );
}

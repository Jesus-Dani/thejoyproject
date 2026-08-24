const PATHS: Record<string, string> = {
  a: "M2 5 Q 30 1, 55 4 T 98 3",
  b: "M2 4 Q 25 7, 50 3 T 98 5",
  c: "M2 5 Q 35 2, 60 5 T 98 2",
};

type HandDrawnUnderlineProps = {
  color?: "pink" | "blue" | "yellow" | "navy";
  variant?: "a" | "b" | "c";
  className?: string;
};

const STROKE: Record<string, string> = {
  pink: "var(--color-pink)",
  blue: "var(--color-blue)",
  yellow: "var(--color-yellow)",
  navy: "var(--color-navy)",
};

/** Imperfect hand-drawn underline — never a straight CSS border. */
export default function HandDrawnUnderline({
  color = "blue",
  variant = "a",
  className = "",
}: HandDrawnUnderlineProps) {
  return (
    <svg
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-[8px] ${className}`}
    >
      <path
        d={PATHS[variant]}
        fill="none"
        stroke={STROKE[color]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

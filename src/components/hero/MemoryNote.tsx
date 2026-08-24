export default function MemoryNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-[220px] rounded-[2px] bg-[repeating-linear-gradient(var(--color-cream),var(--color-cream)_22px,rgba(16,34,56,0.09)_23px)] bg-white p-4 shadow-[0_10px_22px_rgba(16,34,56,0.2)] ${className}`}
      style={{ transform: "rotate(-2deg)" }}
    >
      <p className="font-hand text-2xl leading-tight text-navy">
        good friends.
        <br />
        great times.
        <br />
        bigger purpose.
      </p>
      <span aria-hidden="true" className="absolute -bottom-2 -right-2 text-2xl text-pink">
        ♥
      </span>
    </div>
  );
}

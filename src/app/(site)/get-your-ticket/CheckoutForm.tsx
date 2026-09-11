"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import { TICKET_TYPES, type TicketTypeCode } from "@/lib/ticketTypes";
import { NGN } from "@/lib/constants";

type LiveSession = {
  id: string;
  type: "match" | "movie_showing";
  name: string;
  filmTitle: string | null;
  startTime: string;
  endTime: string;
  remaining: number | null;
  soldOut: boolean;
};

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as TicketTypeCode) ?? "COMBO";

  const [ticketTypeCode, setTicketTypeCode] = useState<TicketTypeCode>(
    TICKET_TYPES.some((t) => t.code === initialType) ? initialType : "COMBO"
  );
  const [showingId, setShowingId] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState("1");
  const quantity = Math.min(20, Math.max(1, parseInt(quantityInput, 10) || 1));
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => setError("Couldn't load live seat counts. You can still try checking out."))
      .finally(() => setLoadingSessions(false));
  }, []);

  const ticketType = TICKET_TYPES.find((t) => t.code === ticketTypeCode)!;
  const showings = sessions.filter((s) => s.type === "movie_showing");
  const total = ticketType.priceNgn * quantity;

  function selectTicketType(code: TicketTypeCode) {
    setTicketTypeCode(code);
    const nextType = TICKET_TYPES.find((t) => t.code === code)!;
    if (!nextType.includesShowing) setShowingId("");
  }

  const canSubmit = useMemo(() => {
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) return false;
    if (ticketType.includesShowing && !showingId) return false;
    return true;
  }, [buyerName, buyerEmail, buyerPhone, ticketType.includesShowing, showingId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          buyerPhone,
          ticketTypeCode,
          showingId: ticketType.includesShowing ? showingId : undefined,
          quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong, please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.authorizationUrl;
    } catch {
      setError("Something went wrong, please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-10 md:py-20">
      <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">get your ticket</h1>
      <HandDrawnUnderline color="pink" className="mt-3 w-32" />

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wide text-navy/60">Ticket type</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {TICKET_TYPES.map((t) => (
              <label
                key={t.code}
                className={`cursor-pointer rounded-card border-2 p-4 transition-colors ${
                  ticketTypeCode === t.code ? "border-navy bg-navy/5" : "border-navy/15"
                }`}
              >
                <input
                  type="radio"
                  name="ticketType"
                  value={t.code}
                  checked={ticketTypeCode === t.code}
                  onChange={() => selectTicketType(t.code)}
                  className="sr-only"
                />
                <p className="font-bold text-navy">{t.name}</p>
                <p className="mt-1 text-sm text-navy/60">{t.blurb}</p>
                <p className="mt-2 font-extrabold text-navy">{NGN.format(t.priceNgn)}</p>
              </label>
            ))}
          </div>
        </fieldset>

        {ticketType.includesShowing && (
          <fieldset>
            <legend className="text-sm font-bold uppercase tracking-wide text-navy/60">Choose a showing</legend>
            {loadingSessions ? (
              <p className="mt-3 text-sm text-navy/60">Loading live seat counts…</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {showings.map((s) => (
                  <label
                    key={s.id}
                    className={`rounded-card border-2 p-3 text-sm transition-colors ${
                      s.soldOut
                        ? "cursor-not-allowed border-navy/10 bg-navy/5 text-navy/40"
                        : showingId === s.id
                          ? "cursor-pointer border-navy bg-navy/5"
                          : "cursor-pointer border-navy/15"
                    }`}
                  >
                    <input
                      type="radio"
                      name="showing"
                      value={s.id}
                      disabled={s.soldOut}
                      checked={showingId === s.id}
                      onChange={() => setShowingId(s.id)}
                      className="sr-only"
                    />
                    <p className="font-semibold text-navy">{s.name}</p>
                    <p>
                      {formatTime(s.startTime)}–{formatTime(s.endTime)}
                    </p>
                    <p className="mt-1 font-bold">{s.soldOut ? "Sold Out" : `${s.remaining}/100 left`}</p>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        )}

        <div className="grid gap-2 sm:w-40">
          <label htmlFor="quantity" className="text-sm font-bold uppercase tracking-wide text-navy/60">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={20}
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            onBlur={() => setQuantityInput(String(quantity))}
            className="rounded-button border border-navy/20 bg-white px-3 py-2 text-navy"
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-bold uppercase tracking-wide text-navy/60">Your details</legend>
          <div>
            <label htmlFor="buyerName" className="text-sm font-medium text-navy/70">
              Full name
            </label>
            <input
              id="buyerName"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="mt-1 w-full rounded-button border border-navy/20 bg-white px-3 py-2.5 text-navy"
            />
          </div>
          <div>
            <label htmlFor="buyerEmail" className="text-sm font-medium text-navy/70">
              Email: your ticket QR codes go here
            </label>
            <input
              id="buyerEmail"
              type="email"
              required
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="mt-1 w-full rounded-button border border-navy/20 bg-white px-3 py-2.5 text-navy"
            />
          </div>
          <div>
            <label htmlFor="buyerPhone" className="text-sm font-medium text-navy/70">
              Phone
            </label>
            <input
              id="buyerPhone"
              type="tel"
              required
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className="mt-1 w-full rounded-button border border-navy/20 bg-white px-3 py-2.5 text-navy"
            />
          </div>
        </fieldset>

        <div className="rounded-card bg-navy/5 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-navy/70">Total</span>
            <span className="text-2xl font-extrabold text-navy">{NGN.format(total)}</span>
          </div>
          <p className="mt-1 text-xs text-navy/50">Paystack may add its own processing fee at checkout.</p>
        </div>

        {error && <p className="rounded-button bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full rounded-button bg-navy px-6 py-4 text-base font-bold text-cream transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Redirecting to payment…" : "Continue to payment"}
        </button>

        <p className="text-center text-xs text-navy/50">
          All sales are final, no refunds. See our{" "}
          <a href="/terms" className="underline">
            Terms &amp; FAQ
          </a>
          .
        </p>
      </form>
    </div>
  );
}

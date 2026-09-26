"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NGN } from "@/lib/constants";

type Status = "pending" | "success" | "failed" | "oversold_conflict";

type OrderStatusResponse = {
  status: Status;
  buyerName: string;
  quantity: number;
  totalAmountNgn: number;
};

const POLL_INTERVAL_MS = 2500;
// Bank transfer / USSD payments can take several minutes for Paystack to
// confirm (unlike card payments, which resolve in seconds) — a short
// timeout here reads as "broken" to a buyer who genuinely just paid slowly.
const TIMEOUT_MS = 5 * 60_000;

export default function ConfirmStatus() {
  const reference = useSearchParams().get("reference");
  const [data, setData] = useState<OrderStatusResponse | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [resumeKey, setResumeKey] = useState(0);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await fetch(`/api/orders/status?reference=${encodeURIComponent(reference!)}`);
        if (res.ok) {
          const json = (await res.json()) as OrderStatusResponse;
          if (!cancelled) setData(json);
          if (json.status !== "pending") return;
        }
      } catch {
        // keep polling
      }
      if (cancelled) return;
      if (Date.now() - startedAt > TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    setTimedOut(false);
    poll();
    return () => {
      cancelled = true;
    };
  }, [reference, resumeKey]);

  if (!reference) {
    return <p className="text-navy/70">Missing order reference.</p>;
  }

  if (!data || data.status === "pending") {
    if (timedOut) {
      return (
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Still confirming…</h1>
          <p className="mt-4 max-w-md text-navy/70">
            This is taking longer than usual — common with bank transfer or
            USSD payments, which can take a few minutes to clear. Please
            don&rsquo;t pay again. Tap below to check once more, or come back
            to this page later using the same link.
          </p>
          <button
            type="button"
            onClick={() => setResumeKey((k) => k + 1)}
            className="mt-6 rounded-button bg-navy px-6 py-3 text-sm font-bold text-cream hover:bg-navy/90"
          >
            Check again
          </button>
        </div>
      );
    }
    return (
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Confirming your payment…</h1>
        <p className="mt-4 text-navy/70">
          Hang tight — this is usually quick, but bank transfer or USSD
          payments can take a few minutes.
        </p>
      </div>
    );
  }

  if (data.status === "success") {
    return (
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Thank you for your purchase</h1>
        <p className="mt-4 max-w-md text-navy/70">
          Your ticket will be sent soon.
        </p>
        <p className="mt-4 max-w-md text-navy/70">
          {data.quantity} ticket{data.quantity > 1 ? "s" : ""} confirmed:{" "}
          {NGN.format(data.totalAmountNgn)} total.
        </p>
        <Link href="/" className="mt-8 inline-block font-bold text-navy underline decoration-blue decoration-2 underline-offset-4">
          Back to home
        </Link>
      </div>
    );
  }

  if (data.status === "oversold_conflict") {
    return (
      <div>
        <h1 className="text-3xl font-extrabold text-navy">That showing just sold out</h1>
        <p className="mt-4 max-w-md text-navy/70">
          You&rsquo;ve been refunded in full. Check your email for details.
          Sorry about that! Feel free to pick a different showing.
        </p>
        <Link
          href="/get-your-ticket"
          className="mt-8 inline-block font-bold text-navy underline decoration-blue decoration-2 underline-offset-4"
        >
          Try another showing
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy">Payment didn&rsquo;t go through</h1>
      <p className="mt-4 max-w-md text-navy/70">No charge was made. Please try again.</p>
      <Link href="/get-your-ticket" className="mt-8 inline-block font-bold text-navy underline decoration-blue decoration-2 underline-offset-4">
        Back to ticket selection
      </Link>
    </div>
  );
}

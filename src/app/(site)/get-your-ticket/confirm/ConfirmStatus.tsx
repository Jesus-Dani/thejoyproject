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
const TIMEOUT_MS = 90_000;

export default function ConfirmStatus() {
  const reference = useSearchParams().get("reference");
  const [data, setData] = useState<OrderStatusResponse | null>(null);
  const [timedOut, setTimedOut] = useState(false);

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

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (!reference) {
    return <p className="text-navy/70">Missing order reference.</p>;
  }

  if (!data || data.status === "pending") {
    if (timedOut) {
      return (
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Still confirming…</h1>
          <p className="mt-4 max-w-md text-navy/70">
            This is taking longer than usual. If Paystack already charged
            you, your ticket confirmation will still arrive by email shortly.
            No need to pay again.
          </p>
        </div>
      );
    }
    return (
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Confirming your payment…</h1>
        <p className="mt-4 text-navy/70">Hang tight, this only takes a moment.</p>
      </div>
    );
  }

  if (data.status === "success") {
    return (
      <div>
        <h1 className="text-3xl font-extrabold text-navy">You&rsquo;re in, {data.buyerName.split(" ")[0]} 🎉</h1>
        <p className="mt-4 max-w-md text-navy/70">
          {data.quantity} ticket{data.quantity > 1 ? "s" : ""} confirmed:{" "}
          {NGN.format(data.totalAmountNgn)} total. Your QR code
          {data.quantity > 1 ? "s are" : " is"} on the way to your inbox.
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

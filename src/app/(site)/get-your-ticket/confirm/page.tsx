import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmStatus from "./ConfirmStatus";

export const metadata: Metadata = { title: "Confirming your order: The Joy Project" };

export default function ConfirmPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 sm:px-10">
      <Suspense fallback={<p className="text-navy/70">Loading…</p>}>
        <ConfirmStatus />
      </Suspense>
    </div>
  );
}

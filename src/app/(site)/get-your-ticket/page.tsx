import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "Get Your Ticket: The Joy Project" };

export default function GetYourTicketPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}

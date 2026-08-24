import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

async function paystackFetch(path: string, init: RequestInit) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.json();
  if (!res.ok || body.status === false) {
    throw new Error(`Paystack ${path} failed: ${body.message ?? res.statusText}`);
  }
  return body;
}

/**
 * Charges the ticket price only — no buyer-facing markup for Paystack's fee
 * (product decision; see README "Payment fees" note). `amountNgn` is whole
 * naira; Paystack expects kobo.
 */
export async function initializeTransaction(params: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  const body = await paystackFetch("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNgn * 100),
      reference: params.reference,
      callback_url: params.callbackUrl,
      currency: "NGN",
      metadata: params.metadata,
    }),
  });
  return body.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyTransaction(reference: string) {
  const body = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
  });
  return body.data as {
    status: string;
    reference: string;
    amount: number;
    fees: number | null;
    metadata: Record<string, unknown>;
  };
}

/** Full refund for the oversold-conflict safety net (TRD §4.3). */
export async function refundTransaction(reference: string) {
  return paystackFetch("/refund", {
    method: "POST",
    body: JSON.stringify({ transaction: reference }),
  });
}

/**
 * Verifies `x-paystack-signature`: HMAC-SHA512 of the raw request body using
 * the secret key. Must run against the raw (unparsed) body — do not verify
 * against a re-serialized JSON object.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signatureHeader, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

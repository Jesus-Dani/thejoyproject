import "server-only";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import QRCode from "qrcode";

function getSecret(): string {
  const secret = process.env.QR_SIGNING_SECRET;
  if (!secret) throw new Error("QR_SIGNING_SECRET is not set");
  return secret;
}

function sign(token: string): string {
  return createHmac("sha256", getSecret()).update(token).digest("hex").slice(0, 24);
}

/** A fresh unguessable admission token (stored as `admissions.qr_token`). */
export function generateAdmissionToken(): string {
  return randomUUID();
}

/**
 * The value actually encoded in the QR image: `token.signature`. Cheap
 * defense-in-depth (TRD §6) — the scan endpoint rejects a bad signature
 * before ever hitting the database.
 */
export function buildQrPayload(token: string): string {
  return `${token}.${sign(token)}`;
}

/** Returns the token if the payload's signature is valid, else null. */
export function parseQrPayload(payload: string): string | null {
  const [token, sig] = payload.split(".");
  if (!token || !sig) return null;
  const expected = sign(token);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return token;
}

/**
 * PNG buffer for email attachment. Attached (not inlined as a data URI) —
 * several major email clients strip/block data: URIs in HTML bodies, so an
 * attachment is the reliable delivery path for TRD §6.
 */
export async function qrPngBuffer(payload: string): Promise<Buffer> {
  return QRCode.toBuffer(payload, { margin: 1, width: 320 });
}

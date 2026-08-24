// Shared-password auth for /admin and /checkin (TRD §9). No accounts, no
// sessions table — a signed cookie issued after a correct password check.
// Uses Web Crypto (`crypto.subtle`) rather than `node:crypto` so the same
// code verifies cookies in both the Node API routes and the Edge middleware.

export type AuthRole = "admin" | "checkin";

const COOKIE_NAMES: Record<AuthRole, string> = {
  admin: "tjp_admin_session",
  checkin: "tjp_checkin_session",
};

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h — a single event day's shift

export function cookieNameFor(role: AuthRole) {
  return COOKIE_NAMES[role];
}

function getSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret) throw new Error("AUTH_COOKIE_SECRET is not set");
  return secret;
}

// base64url helpers built on Uint8Array + btoa/atob rather than `Buffer` —
// `Buffer` isn't reliably available in the Edge runtime this file also runs
// in (via middleware.ts), while btoa/atob are standard in both.
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function utf8ToBase64Url(text: string): string {
  return bytesToBase64Url(new TextEncoder().encode(text));
}

function base64UrlToUtf8(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToBase64Url(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkPassword(role: AuthRole, password: string): boolean {
  const expected = role === "admin" ? process.env.ADMIN_PASSWORD : process.env.CHECKIN_PASSWORD;
  if (!expected) throw new Error(`${role.toUpperCase()}_PASSWORD is not set`);
  return timingSafeEqual(password, expected);
}

export async function createSessionCookieValue(role: AuthRole): Promise<string> {
  const payload = { role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = utf8ToBase64Url(JSON.stringify(payload));
  const sig = await hmac(body, getSecret());
  return `${body}.${sig}`;
}

export async function verifySessionCookieValue(
  value: string | undefined,
  expectedRole: AuthRole
): Promise<boolean> {
  if (!value) return false;
  const [body, sig] = value.split(".");
  if (!body || !sig) return false;

  const expectedSig = await hmac(body, getSecret());
  if (!timingSafeEqual(sig, expectedSig)) return false;

  try {
    const payload = JSON.parse(base64UrlToUtf8(body)) as {
      role: AuthRole;
      exp: number;
    };
    if (payload.role !== expectedRole) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

import "server-only";
import { Resend } from "resend";
import { NGN } from "./constants";
import type { SessionRow } from "./database.types";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function getFrom(): string {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is not set");
  return from;
}

function sessionLabel(session: SessionRow): string {
  const kind = session.type === "match" ? "Charity Match" : `Barbie Marathon — ${session.name}`;
  return `${kind} · ${session.event_date} · ${session.start_time}–${session.end_time} · ${session.venue}`;
}

export async function sendConfirmationEmail(params: {
  to: string;
  buyerName: string;
  ticketTypeName: string;
  quantity: number;
  totalAmountNgn: number;
  admissions: Array<{ session: SessionRow; qrBuffer: Buffer }>;
}) {
  const { to, buyerName, ticketTypeName, quantity, totalAmountNgn, admissions } = params;

  const bySession = new Map<string, { session: SessionRow; count: number }>();
  for (const a of admissions) {
    const existing = bySession.get(a.session.id);
    if (existing) existing.count += 1;
    else bySession.set(a.session.id, { session: a.session, count: 1 });
  }

  const linesHtml = [...bySession.values()]
    .map(
      ({ session, count }) =>
        `<li>${sessionLabel(session)} — ${count} ticket${count > 1 ? "s" : ""} attached</li>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#102238;max-width:520px;margin:0 auto">
      <h1 style="font-size:20px">You&rsquo;re in, ${escapeHtml(buyerName)} 🎉</h1>
      <p>Thanks for grabbing a ticket to The Joy Project. Here's your order:</p>
      <p><strong>${escapeHtml(ticketTypeName)}</strong> — ${quantity} × — ${NGN.format(totalAmountNgn)} total</p>
      <ul>${linesHtml}</ul>
      <p>Your QR code${admissions.length > 1 ? "s are" : " is"} attached to this email — one per admission. Show it at the door; each code can only be scanned once.</p>
      <p style="color:#6b6b6b;font-size:13px;margin-top:24px">All sales are final — no refunds, except in the rare case a showing sells out in the seconds before your payment clears (you'd be refunded automatically and notified separately). See our Terms &amp; FAQ page for details.</p>
      <p style="margin-top:24px">See you there — the joy project ♡</p>
    </div>
  `;

  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Your Joy Project ticket confirmation",
    html,
    attachments: admissions.map((a, i) => ({
      filename: `ticket-${i + 1}-${a.session.type}.png`,
      content: a.qrBuffer,
    })),
  });
}

export async function sendOversoldApologyEmail(params: {
  to: string;
  buyerName: string;
  showingLabel: string;
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;color:#102238;max-width:520px;margin:0 auto">
      <h1 style="font-size:20px">We&rsquo;re sorry, ${escapeHtml(params.buyerName)}</h1>
      <p>${escapeHtml(params.showingLabel)} sold out moments before your payment cleared. We know that's frustrating — you've been refunded in full, and the refund should land back on your original payment method shortly.</p>
      <p>We&rsquo;d love to have you at a different showing or the match instead — head back to the site whenever you're ready to pick another time.</p>
      <p style="margin-top:24px">Sorry again, and thank you for your patience — the joy project ♡</p>
    </div>
  `;
  await getResend().emails.send({
    from: getFrom(),
    to: params.to,
    subject: "Your Joy Project order — refunded (showing sold out)",
    html,
  });
}

export async function sendContactNotification(params: {
  name: string;
  email: string;
  organization?: string;
  message: string;
}) {
  const to = process.env.ORGANIZER_EMAIL;
  if (!to) throw new Error("ORGANIZER_EMAIL is not set");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#102238">
      <h1 style="font-size:18px">New partner/sponsor inquiry</h1>
      <p><strong>${escapeHtml(params.name)}</strong> (${escapeHtml(params.email)})${
    params.organization ? ` — ${escapeHtml(params.organization)}` : ""
  }</p>
      <p style="white-space:pre-wrap">${escapeHtml(params.message)}</p>
    </div>
  `;

  await getResend().emails.send({
    from: getFrom(),
    to,
    replyTo: params.email,
    subject: `Get Involved inquiry from ${params.name}`,
    html,
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

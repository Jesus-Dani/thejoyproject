import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  try {
    await sendContactNotification(parsed.data);
  } catch (err) {
    console.error("Contact notification failed", err);
    return NextResponse.json({ error: "Could not send your message — please try again" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

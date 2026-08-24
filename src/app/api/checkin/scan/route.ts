import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieNameFor, verifySessionCookieValue } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { parseQrPayload } from "@/lib/qr";
import { checkinScanSchema } from "@/lib/validation";
import type { AdmissionRow } from "@/lib/database.types";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const authed = await verifySessionCookieValue(cookieStore.get(cookieNameFor("checkin"))?.value, "checkin");
  if (!authed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = checkinScanSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid scan payload" }, { status: 400 });
  }

  const token = parseQrPayload(parsed.data.token);
  if (!token) {
    return NextResponse.json({ result: "invalid", message: "Not a valid Joy Project ticket" }, { status: 200 });
  }

  const supabase = getSupabaseAdmin();
  const { data: admissionData } = await supabase
    .from("admissions")
    .select("*")
    .eq("qr_token", token)
    .eq("session_id", parsed.data.sessionId)
    .single();
  const admission = admissionData as unknown as AdmissionRow | null;

  if (!admission) {
    return NextResponse.json(
      { result: "invalid", message: "Not valid for this gate" },
      { status: 200 }
    );
  }

  if (admission.checked_in_at) {
    return NextResponse.json(
      { result: "already_used", message: "Already checked in", checkedInAt: admission.checked_in_at },
      { status: 200 }
    );
  }

  const { error: updateError } = await supabase
    .from("admissions")
    .update({ checked_in_at: new Date().toISOString(), checked_in_by: "checkin-scanner" })
    .eq("id", admission.id)
    .is("checked_in_at", null);

  if (updateError) {
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }

  return NextResponse.json({ result: "ok", message: "Checked in" });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieNameFor, verifySessionCookieValue } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { OrderRow, SessionRow, AdmissionRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const authed = await verifySessionCookieValue(cookieStore.get(cookieNameFor("admin"))?.value, "admin");
  if (!authed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const [
    { data: sessionsData },
    { data: ordersData },
    { data: admissionsData },
  ] = await Promise.all([
    supabase.from("sessions").select("*").order("display_order", { ascending: true }),
    supabase.from("orders").select("total_amount_ngn, payment_status"),
    supabase.from("admissions").select("session_id, checked_in_at"),
  ]);
  const sessions = sessionsData as unknown as SessionRow[] | null;
  const orders = ordersData as unknown as Pick<OrderRow, "total_amount_ngn" | "payment_status">[] | null;
  const admissions = admissionsData as unknown as Pick<AdmissionRow, "session_id" | "checked_in_at">[] | null;

  const checkedInBySession = new Map<string, number>();
  for (const a of admissions ?? []) {
    if (a.checked_in_at) checkedInBySession.set(a.session_id, (checkedInBySession.get(a.session_id) ?? 0) + 1);
  }

  const sessionSummaries = (sessions ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    eventDate: s.event_date,
    capacity: s.capacity,
    seatsSold: s.seats_sold,
    remaining: s.capacity === null ? null : Math.max(0, s.capacity - s.seats_sold),
    checkedIn: checkedInBySession.get(s.id) ?? 0,
  }));

  const totalRevenueNgn = (orders ?? [])
    .filter((o) => o.payment_status === "success")
    .reduce((sum, o) => sum + Number(o.total_amount_ngn), 0);

  return NextResponse.json({
    sessions: sessionSummaries,
    totalRevenueNgn,
    totalOrders: (orders ?? []).filter((o) => o.payment_status === "success").length,
  });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieNameFor, verifySessionCookieValue } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET() {
  const cookieStore = await cookies();
  const authed = await verifySessionCookieValue(cookieStore.get(cookieNameFor("admin"))?.value, "admin");
  if (!authed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, ticket_types(name), sessions(name)")
    .order("created_at", { ascending: true });

  const header = [
    "order_id",
    "buyer_name",
    "buyer_email",
    "buyer_phone",
    "ticket_type",
    "showing",
    "quantity",
    "total_amount_ngn",
    "payment_status",
    "created_at",
    "paid_at",
  ];

  type OrderWithJoins = {
    id: string;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    quantity: number;
    total_amount_ngn: number;
    payment_status: string;
    created_at: string;
    paid_at: string | null;
    ticket_types: { name: string } | null;
    sessions: { name: string } | null;
  };

  const rows = ((orders ?? []) as unknown as OrderWithJoins[]).map((o) =>
    [
      o.id,
      o.buyer_name,
      o.buyer_email,
      o.buyer_phone,
      o.ticket_types?.name ?? "",
      o.sessions?.name ?? "",
      o.quantity,
      o.total_amount_ngn,
      o.payment_status,
      o.created_at,
      o.paid_at ?? "",
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="joy-project-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

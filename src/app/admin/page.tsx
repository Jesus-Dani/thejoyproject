import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NGN } from "@/lib/constants";
import type { OrderRow, SessionRow, AdmissionRow } from "@/lib/database.types";

export const metadata: Metadata = { title: "Admin — The Joy Project" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  const successfulOrders = (orders ?? []).filter((o) => o.payment_status === "success");
  const totalRevenueNgn = successfulOrders.reduce((sum, o) => sum + Number(o.total_amount_ngn), 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-navy">Admin dashboard</h1>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/orders/export"
            className="rounded-button bg-navy px-4 py-2.5 text-sm font-bold text-cream hover:bg-navy/90"
          >
            Export orders (CSV)
          </a>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="text-sm font-semibold text-navy/60 underline hover:text-navy">
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-navy/10 bg-white p-5">
          <p className="text-sm text-navy/60">Total revenue</p>
          <p className="mt-1 text-3xl font-extrabold text-navy">{NGN.format(totalRevenueNgn)}</p>
        </div>
        <div className="rounded-card border border-navy/10 bg-white p-5">
          <p className="text-sm text-navy/60">Paid orders</p>
          <p className="mt-1 text-3xl font-extrabold text-navy">{successfulOrders.length}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-navy/10 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Capacity</th>
              <th className="px-4 py-3 font-semibold">Sold</th>
              <th className="px-4 py-3 font-semibold">Remaining</th>
              <th className="px-4 py-3 font-semibold">Checked in</th>
            </tr>
          </thead>
          <tbody>
            {(sessions ?? []).map((s) => (
              <tr key={s.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">
                  {s.name} <span className="text-navy/50">· {s.event_date}</span>
                </td>
                <td className="px-4 py-3 text-navy/70">{s.capacity ?? "Uncapped"}</td>
                <td className="px-4 py-3 text-navy/70">{s.seats_sold}</td>
                <td className="px-4 py-3 text-navy/70">{s.capacity === null ? "—" : Math.max(0, s.capacity - s.seats_sold)}</td>
                <td className="px-4 py-3 text-navy/70">{checkedInBySession.get(s.id) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

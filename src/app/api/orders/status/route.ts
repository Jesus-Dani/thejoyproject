import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { OrderRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

// Read-only. The client-side Paystack redirect is never trusted as proof of
// payment (TRD §5.1.4): this just reflects whatever the webhook has
// written to `orders.payment_status`.
export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: orderData, error } = await supabase
    .from("orders")
    .select("payment_status, buyer_name, quantity, total_amount_ngn")
    .eq("paystack_reference", reference)
    .single();
  const order = orderData as unknown as Pick<
    OrderRow,
    "payment_status" | "buyer_name" | "quantity" | "total_amount_ngn"
  > | null;

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: order.payment_status,
    buyerName: order.buyer_name,
    quantity: order.quantity,
    totalAmountNgn: order.total_amount_ngn,
  });
}

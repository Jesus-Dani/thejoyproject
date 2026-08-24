import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { initializeTransaction } from "@/lib/paystack";
import { checkoutInitSchema } from "@/lib/validation";
import type { OrderRow, SessionRow, TicketTypeRow } from "@/lib/database.types";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = checkoutInitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;

  const supabase = getSupabaseAdmin();

  const { data: ticketTypeData, error: ticketTypeError } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("code", input.ticketTypeCode)
    .single();
  const ticketType = ticketTypeData as unknown as TicketTypeRow | null;

  if (ticketTypeError || !ticketType) {
    return NextResponse.json({ error: "Unknown ticket type" }, { status: 400 });
  }

  let showingId: string | null = null;
  if (ticketType.includes_showing) {
    if (!input.showingId) {
      return NextResponse.json({ error: "Select a showing" }, { status: 400 });
    }
    const { data: showingData, error: showingError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", input.showingId)
      .eq("type", "movie_showing")
      .single();
    const showing = showingData as unknown as SessionRow | null;

    if (showingError || !showing) {
      return NextResponse.json({ error: "Selected showing not found" }, { status: 400 });
    }
    // Fail-fast UX check only — NOT the real capacity guard. The webhook's
    // atomic UPDATE (TRD §4.2) is the actual source of truth at payment time.
    if (showing.capacity !== null && showing.seats_sold + input.quantity > showing.capacity) {
      return NextResponse.json({ error: "That showing doesn't have enough seats left" }, { status: 409 });
    }
    showingId = showing.id;
  }

  const unitPriceNgn = Number(ticketType.price_ngn);
  const totalAmountNgn = unitPriceNgn * input.quantity;
  const reference = `tjp_${randomUUID()}`;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_name: input.buyerName,
      buyer_email: input.buyerEmail,
      buyer_phone: input.buyerPhone,
      ticket_type_id: ticketType.id,
      showing_id: showingId,
      quantity: input.quantity,
      unit_price_ngn: unitPriceNgn,
      total_amount_ngn: totalAmountNgn,
      paystack_reference: reference,
      payment_status: "pending",
    })
    .select()
    .single();
  const order = orderData as unknown as OrderRow | null;

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const tx = await initializeTransaction({
      email: input.buyerEmail,
      amountNgn: totalAmountNgn,
      reference,
      callbackUrl: `${siteUrl}/get-your-ticket/confirm?reference=${reference}`,
      metadata: { order_id: order.id },
    });
    return NextResponse.json({ authorizationUrl: tx.authorization_url });
  } catch {
    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: "Could not start payment — please try again" }, { status: 502 });
  }
}

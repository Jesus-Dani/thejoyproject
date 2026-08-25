import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyWebhookSignature, refundTransaction } from "@/lib/paystack";
import { generateAdmissionToken, buildQrPayload, qrPngBuffer } from "@/lib/qr";
import { sendConfirmationEmail, sendOversoldApologyEmail } from "@/lib/email";
import type { OrderRow, ProcessPaystackOrderStatus, SessionRow, TicketTypeRow } from "@/lib/database.types";

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference: string | undefined = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  const supabase = getSupabaseAdmin();

  const { data: orderData } = await supabase
    .from("orders")
    .select("*")
    .eq("paystack_reference", reference)
    .single();
  const order = orderData as unknown as OrderRow | null;

  if (!order) {
    console.error(`Paystack webhook: no order found for reference ${reference}`);
    return NextResponse.json({ received: true });
  }

  if (order.payment_status === "success" || order.payment_status === "oversold_conflict") {
    return NextResponse.json({ received: true });
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc("process_paystack_order", {
    p_order_id: order.id,
  });

  if (rpcError) {
    console.error("process_paystack_order failed", rpcError);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  const status = (rpcResult as unknown as { status: ProcessPaystackOrderStatus }[] | null)?.[0]?.status;

  if (status === "already_processed") {
    return NextResponse.json({ received: true });
  }

  // Record Paystack's actual fee for bookkeeping (buyer was not charged it,
  // see README "Payment fees").
  const paystackFeeNgn = typeof event.data?.fees === "number" ? event.data.fees / 100 : null;
  if (paystackFeeNgn !== null) {
    await supabase.from("orders").update({ paystack_fee_ngn: paystackFeeNgn }).eq("id", order.id);
  }

  const { data: ticketTypeData } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("id", order.ticket_type_id)
    .single();
  const ticketType = ticketTypeData as unknown as TicketTypeRow | null;

  if (status === "oversold_conflict") {
    try {
      await refundTransaction(reference);
    } catch (err) {
      console.error(`Refund failed for oversold order ${order.id}`, err);
    }

    let showingLabel = "That showing";
    if (order.showing_id) {
      const { data: showingData } = await supabase.from("sessions").select("*").eq("id", order.showing_id).single();
      const showing = showingData as unknown as SessionRow | null;
      if (showing) showingLabel = `${showing.name} (${showing.event_date})`;
    }

    await sendOversoldApologyEmail({
      to: order.buyer_email,
      buyerName: order.buyer_name,
      showingLabel,
    });

    return NextResponse.json({ received: true });
  }

  // status === 'success': create the admissions rows and deliver tickets.
  const sessionIds: string[] = [];
  if (ticketType?.includes_match) {
    const { data: matchSession } = await supabase.from("sessions").select("id").eq("type", "match").single();
    if (matchSession) sessionIds.push((matchSession as unknown as { id: string }).id);
  }
  if (ticketType?.includes_showing && order.showing_id) {
    sessionIds.push(order.showing_id);
  }

  const { data: sessionRowsData } = await supabase.from("sessions").select("*").in("id", sessionIds);
  const sessionRows = sessionRowsData as unknown as SessionRow[] | null;
  const sessionsById = new Map<string, SessionRow>((sessionRows ?? []).map((s) => [s.id, s]));

  type NewAdmission = { order_id: string; session_id: string; qr_token: string };
  const newAdmissions: NewAdmission[] = [];
  for (const sessionId of sessionIds) {
    for (let i = 0; i < order.quantity; i++) {
      newAdmissions.push({ order_id: order.id, session_id: sessionId, qr_token: generateAdmissionToken() });
    }
  }

  if (newAdmissions.length > 0) {
    await supabase.from("admissions").insert(newAdmissions);
  }

  const emailAdmissions = await Promise.all(
    newAdmissions.map(async (a) => ({
      session: sessionsById.get(a.session_id)!,
      qrBuffer: await qrPngBuffer(buildQrPayload(a.qr_token)),
    }))
  );

  try {
    await sendConfirmationEmail({
      to: order.buyer_email,
      buyerName: order.buyer_name,
      ticketTypeName: ticketType?.name ?? "Ticket",
      quantity: order.quantity,
      totalAmountNgn: order.total_amount_ngn,
      admissions: emailAdmissions,
    });
  } catch (err) {
    console.error(`Confirmation email failed for order ${order.id}`, err);
  }

  return NextResponse.json({ received: true });
}

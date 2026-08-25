// Hand-written row shapes matching supabase/migrations/*.sql. The Supabase
// client is created untyped (see lib/supabase.ts) and each query applies
// `.returns<T>()` explicitly with these interfaces: the newest
// @supabase/postgrest-js's type-level select-string parser has sharp edges
// around generic `Database` schemas (default-typed mapped types collapsing
// query results to `never`); `.returns<T>()` sidesteps that parser
// entirely while keeping full row typing at every call site.

export type SessionType = "match" | "movie_showing";
export type TicketTypeCode = "COMBO" | "FRIDAY_ONLY" | "SATURDAY_ONLY";
export type OrderPaymentStatus = "pending" | "success" | "failed" | "oversold_conflict";

export interface SessionRow {
  id: string;
  type: SessionType;
  name: string;
  film_title: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  capacity: number | null;
  seats_sold: number;
  display_order: number;
}

export interface TicketTypeRow {
  id: string;
  code: TicketTypeCode;
  name: string;
  price_ngn: number;
  includes_match: boolean;
  includes_showing: boolean;
}

export interface OrderRow {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  ticket_type_id: string;
  showing_id: string | null;
  quantity: number;
  unit_price_ngn: number;
  paystack_fee_ngn: number | null;
  total_amount_ngn: number;
  paystack_reference: string;
  payment_status: OrderPaymentStatus;
  created_at: string;
  paid_at: string | null;
}

export interface AdmissionRow {
  id: string;
  order_id: string;
  session_id: string;
  qr_token: string;
  checked_in_at: string | null;
  checked_in_by: string | null;
}

export type ProcessPaystackOrderStatus = "already_processed" | "success" | "oversold_conflict";

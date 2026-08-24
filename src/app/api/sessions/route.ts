import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { SessionRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
  }

  const sessions = (data as unknown as SessionRow[]).map((s) => ({
    id: s.id,
    type: s.type,
    name: s.name,
    filmTitle: s.film_title,
    eventDate: s.event_date,
    startTime: s.start_time,
    endTime: s.end_time,
    venue: s.venue,
    capacity: s.capacity,
    remaining: s.capacity === null ? null : Math.max(0, s.capacity - s.seats_sold),
    soldOut: s.capacity !== null && s.seats_sold >= s.capacity,
  }));

  return NextResponse.json({ sessions });
}

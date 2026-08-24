import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key. There is no buyer
 * auth in this app (guest checkout only), so RLS stays default-deny and
 * every read/write is mediated by an API route — this client is never
 * exposed to the browser.
 *
 * Created without a `Database` generic — see database.types.ts for why —
 * callers apply `.returns<T>()` per query for row typing instead.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}

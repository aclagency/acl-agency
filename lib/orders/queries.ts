import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { IncomingOrder } from "@/lib/supabase/types";

export async function listOrders(): Promise<IncomingOrder[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("incoming_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`listOrders: ${error.message}`);
  return (data ?? []) as IncomingOrder[];
}

export async function countToday(): Promise<number> {
  const sb = getSupabaseAdmin();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count, error } = await sb
    .from("incoming_orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfDay.toISOString());
  if (error) throw new Error(`countToday: ${error.message}`);
  return count ?? 0;
}

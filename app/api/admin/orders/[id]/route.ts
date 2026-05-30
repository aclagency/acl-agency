import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { syncOrdersToSheetAsync } from "@/lib/orders/sheets";
import type { OrderStatus } from "@/lib/supabase/types";

const AUTH_TOKEN = "acl-cms-v1";

async function requireAuth() {
  const cookieStore = await cookies();
  if (cookieStore.get("cms_auth")?.value !== AUTH_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body.status as OrderStatus | undefined;
  if (status !== "pending" && status !== "done") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("incoming_orders")
    .update({ status, done_at: status === "done" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  syncOrdersToSheetAsync();
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { id } = await params;
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("incoming_orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  syncOrdersToSheetAsync();
  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

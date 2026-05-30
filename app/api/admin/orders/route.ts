import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { syncOrdersToSheetAsync } from "@/lib/orders/sheets";
import type { OrderKind } from "@/lib/supabase/types";

const AUTH_TOKEN = "acl-cms-v1";
const ALLOWED_KINDS: OrderKind[] = ["insurance", "road_tax", "puspakom", "permit", "audit_icop"];

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("cms_auth")?.value !== AUTH_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const company_name = typeof body.company_name === "string" ? body.company_name.trim() : "";
  const plate_no     = typeof body.plate_no === "string" ? body.plate_no.trim() : "";
  const kind         = body.kind as OrderKind | undefined;
  const pic_name     = typeof body.pic_name === "string" ? body.pic_name.trim() || null : null;
  const notes        = typeof body.notes === "string" ? body.notes.trim() || null : null;

  if (!company_name) return NextResponse.json({ error: "请填公司名" }, { status: 400 });
  if (!plate_no)     return NextResponse.json({ error: "请填车牌" }, { status: 400 });
  if (!kind || !ALLOWED_KINDS.includes(kind)) {
    return NextResponse.json({ error: "请选类型" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("incoming_orders")
    .insert({ company_name, plate_no, kind, pic_name, notes })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  syncOrdersToSheetAsync();
  return NextResponse.json({ ok: true, order: data });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseXlsxBuffer } from "@/lib/import/parse-xlsx";
import { transformRows } from "@/lib/import/transform";
import { upsertImport } from "@/lib/import/upsert";

const AUTH_TOKEN = "acl-cms-v1";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("cms_auth")?.value !== AUTH_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  let rows;
  try {
    rows = parseXlsxBuffer(buf);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Parse failed: ${msg}` }, { status: 400 });
  }

  const transformed = transformRows(rows);
  const summary = await upsertImport(transformed);

  return NextResponse.json({
    ok: summary.errors.length === 0,
    rows_in_file: rows.length,
    ...summary,
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { listOrders } from "@/lib/orders/queries";

const AUTH_TOKEN = "acl-cms-v1";

const KIND_LABELS: Record<string, string> = {
  insurance:  "保险",
  road_tax:   "JPJ路税",
  puspakom:   "Puspakom",
  permit:     "APAD",
  audit_icop: "AUDIT ICOP",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "待处理",
  done:    "已完成",
};

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("cms_auth")?.value !== AUTH_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional ?scope= today | week | all
  const scope = req.nextUrl.searchParams.get("scope") ?? "all";
  const all = await listOrders();

  let rows = all;
  if (scope === "today") {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    rows = all.filter((o) => new Date(o.created_at) >= start);
  } else if (scope === "week") {
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 7);
    rows = all.filter((o) => new Date(o.created_at) >= start);
  }

  const sheet = rows.map((o) => ({
    "日期": new Date(o.created_at).toLocaleDateString("zh-CN"),
    "时间": new Date(o.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    "公司": o.company_name,
    "车牌": o.plate_no,
    "类型": KIND_LABELS[o.kind] ?? o.kind,
    "PIC":  o.pic_name ?? "",
    "备注": o.notes ?? "",
    "状态": STATUS_LABELS[o.status] ?? o.status,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sheet);
  // Reasonable column widths
  ws["!cols"] = [
    { wch: 12 }, { wch: 8 }, { wch: 28 }, { wch: 14 }, { wch: 10 },
    { wch: 14 }, { wch: 24 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const body = new Uint8Array(buf);

  const today = new Date().toISOString().slice(0, 10);
  const filename = `acl_orders_${scope}_${today}.xlsx`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

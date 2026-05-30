import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Resend } from "resend";
import { listOrders } from "@/lib/orders/queries";

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

const RECIPIENT = "aclagency.mgmt@gmail.com";

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  // Filter to today's orders (Malaysia time = UTC+8)
  const all = await listOrders();
  const now = new Date();
  // Malaysia midnight in UTC: subtract 8 hours from today's MY-midnight
  const myToday = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  myToday.setUTCHours(0, 0, 0, 0);
  const startOfDayUtc = new Date(myToday.getTime() - 8 * 60 * 60 * 1000);

  const todays = all.filter((o) => new Date(o.created_at) >= startOfDayUtc);

  const dateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur" }).format(now);

  // Build Excel
  const sheet = todays.map((o) => ({
    "日期": new Date(o.created_at).toLocaleDateString("zh-CN", { timeZone: "Asia/Kuala_Lumpur" }),
    "时间": new Date(o.created_at).toLocaleTimeString("zh-CN", { timeZone: "Asia/Kuala_Lumpur", hour: "2-digit", minute: "2-digit", hour12: false }),
    "公司": o.company_name,
    "车牌": o.plate_no,
    "类型": KIND_LABELS[o.kind] ?? o.kind,
    "PIC":  o.pic_name ?? "",
    "备注": o.notes ?? "",
    "状态": STATUS_LABELS[o.status] ?? o.status,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sheet.length > 0 ? sheet : [{ "日期": "今天没有新订单", "时间": "", "公司": "", "车牌": "", "类型": "", "PIC": "", "备注": "", "状态": "" }]);
  ws["!cols"] = [
    { wch: 12 }, { wch: 8 }, { wch: 28 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 24 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "ACL Orders <onboarding@resend.dev>",
    to: RECIPIENT,
    subject: `ACL Orders 日报 ${dateStr} — ${todays.length} 单`,
    html: `<p>今天共 <b>${todays.length}</b> 单，附件查看详情。</p><p style="color:#888;font-size:12px">系统自动发送，无需回复</p>`,
    attachments: [
      {
        filename: `acl_orders_${dateStr}.xlsx`,
        content: buf,
      },
    ],
  });

  if (error) {
    console.error("[cron] email send failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sent: todays.length, date: dateStr });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

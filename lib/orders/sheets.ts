import "server-only";
import { google } from "googleapis";
import { listOrders } from "./queries";

const KIND_LABELS: Record<string, string> = {
  insurance: "保险",
  road_tax:  "JPJ路税",
  puspakom:  "Puspakom",
  permit:    "APAD",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "待处理",
  done:    "已完成",
};

const HEADERS = ["日期", "时间", "公司", "车牌", "类型", "PIC", "备注", "状态"];

function getCreds() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Sync all orders to the configured Google Sheet.
 * Wipes existing rows (rows 2+) and re-writes from the latest snapshot.
 * Safe to call concurrently — Google's API serialises writes.
 * Returns true on success, false on any failure (errors are logged).
 */
export async function syncOrdersToSheet(): Promise<boolean> {
  const creds = getCreds();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!creds || !sheetId) {
    console.warn("[sheets] sync skipped — env vars not set");
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const orders = await listOrders();
    const rows = orders.map((o) => [
      new Date(o.created_at).toLocaleDateString("zh-CN"),
      new Date(o.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      o.company_name,
      o.plate_no,
      KIND_LABELS[o.kind] ?? o.kind,
      o.pic_name ?? "",
      o.notes ?? "",
      STATUS_LABELS[o.status] ?? o.status,
    ]);

    // Wipe then re-write (simple and idempotent).
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS, ...rows] },
    });

    return true;
  } catch (err) {
    console.error("[sheets] sync failed:", err);
    return false;
  }
}

/**
 * Fire-and-forget wrapper for use inside API handlers.
 * Does NOT await — caller returns to user immediately.
 */
export function syncOrdersToSheetAsync(): void {
  syncOrdersToSheet().catch((e) => console.error("[sheets] async sync error:", e));
}

import "server-only";
import { google } from "googleapis";
import { listOrders } from "./queries";

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

    // Apply formatting (header style, freeze, conditional colors, auto-resize)
    await applyFormatting(sheets, sheetId);

    return true;
  } catch (err) {
    console.error("[sheets] sync failed:", err);
    return false;
  }
}

type SheetsClient = ReturnType<typeof google.sheets>;

async function applyFormatting(sheets: SheetsClient, spreadsheetId: string): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet0 = meta.data.sheets?.[0];
  const sheetGid = sheet0?.properties?.sheetId ?? 0;
  const existingRulesCount = sheet0?.conditionalFormats?.length ?? 0;

  type Request = Record<string, unknown>;
  const requests: Request[] = [];

  // 1) Delete existing conditional formatting rules (reverse order so indices stay valid)
  for (let i = existingRulesCount - 1; i >= 0; i--) {
    requests.push({ deleteConditionalFormatRule: { sheetId: sheetGid, index: i } });
  }

  // 2) Freeze the header row
  requests.push({
    updateSheetProperties: {
      properties: { sheetId: sheetGid, gridProperties: { frozenRowCount: 1 } },
      fields: "gridProperties.frozenRowCount",
    },
  });

  // 3) Style the header row (dark navy bg, white bold text)
  requests.push({
    repeatCell: {
      range: { sheetId: sheetGid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.04, green: 0.14, blue: 0.26 },
          textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
          horizontalAlignment: "CENTER",
          verticalAlignment: "MIDDLE",
        },
      },
      fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
    },
  });

  // 4) Conditional formatting on 类型 column (E, index 4)
  const kindColors: Array<{ value: string; bg: { red: number; green: number; blue: number } }> = [
    { value: "保险",     bg: { red: 0.85, green: 0.92, blue: 1.00 } },
    { value: "JPJ路税",  bg: { red: 0.83, green: 0.97, blue: 0.85 } },
    { value: "Puspakom", bg: { red: 1.00, green: 0.95, blue: 0.78 } },
    { value: "APAD",       bg: { red: 0.93, green: 0.84, blue: 1.00 } },
    { value: "AUDIT ICOP", bg: { red: 1.00, green: 0.80, blue: 0.80 } },
  ];
  for (const k of kindColors) {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId: sheetGid, startRowIndex: 1, startColumnIndex: 4, endColumnIndex: 5 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: k.value }] },
            format: { backgroundColor: k.bg, textFormat: { bold: true } },
          },
        },
      },
    });
  }

  // 5) Conditional formatting on 状态 column (H, index 7)
  const statusColors: Array<{ value: string; bg: { red: number; green: number; blue: number } }> = [
    { value: "待处理", bg: { red: 1.00, green: 0.90, blue: 0.78 } },
    { value: "已完成", bg: { red: 0.78, green: 0.94, blue: 0.82 } },
  ];
  for (const s of statusColors) {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId: sheetGid, startRowIndex: 1, startColumnIndex: 7, endColumnIndex: 8 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: s.value }] },
            format: { backgroundColor: s.bg, textFormat: { bold: true } },
          },
        },
      },
    });
  }

  // 6) Auto-resize all 8 columns to fit content
  requests.push({
    autoResizeDimensions: {
      dimensions: { sheetId: sheetGid, dimension: "COLUMNS", startIndex: 0, endIndex: 8 },
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });
}

/**
 * Fire-and-forget wrapper for use inside API handlers.
 * Does NOT await — caller returns to user immediately.
 */
export function syncOrdersToSheetAsync(): void {
  syncOrdersToSheet().catch((e) => console.error("[sheets] async sync error:", e));
}

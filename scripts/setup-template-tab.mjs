import { google } from "googleapis";

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// 1) Add the new tab
const addRes = await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [{
      addSheet: {
        properties: {
          title: "Sales_orders",
          index: 1,
          gridProperties: { rowCount: 100, columnCount: 9, frozenRowCount: 1 },
        },
      },
    }],
  },
});
const gid = addRes.data.replies[0].addSheet.properties.sheetId;
console.log("Created tab gid:", gid);

// 2) Write headers + sample
const HEADERS = ["Priority", "Order", "Product", "Status", "Order date", "Price", "Sales platform", "Point of contact", "Notes"];
const SAMPLE = [
  ["P1", "Order", "Product A", "Accepted",    "01/06/2026", 250, "In store", "", ""],
  ["P2", "Order", "Product C", "In progress", "02/06/2026", 180, "Phone",    "", ""],
  ["P3", "Order", "Product D", "Dispatched",  "03/06/2026", 420, "In store", "", ""],
  ["P1", "Order", "Product A", "Delivered",   "04/06/2026",  95, "Phone",    "", ""],
];
await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: "Sales_orders!A1",
  valueInputOption: "USER_ENTERED",
  requestBody: { values: [HEADERS, ...SAMPLE] },
});

// 3) Apply formatting
const requests = [];

requests.push({
  repeatCell: {
    range: { sheetId: gid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
    cell: {
      userEnteredFormat: {
        backgroundColor: { red: 0.93, green: 0.93, blue: 0.95 },
        textFormat: { foregroundColor: { red: 0.2, green: 0.2, blue: 0.3 }, bold: true, fontSize: 10 },
        horizontalAlignment: "LEFT",
        verticalAlignment: "MIDDLE",
        padding: { top: 6, bottom: 6, left: 8, right: 8 },
      },
    },
    fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,padding)",
  },
});

requests.push({
  addBanding: {
    bandedRange: {
      range: { sheetId: gid, startRowIndex: 0, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 9 },
      rowProperties: {
        headerColor: { red: 0.93, green: 0.93, blue: 0.95 },
        firstBandColor: { red: 1, green: 1, blue: 1 },
        secondBandColor: { red: 0.97, green: 0.97, blue: 0.99 },
      },
    },
  },
});

// Data validations
const validations = [
  { col: 0, values: ["P0", "P1", "P2", "P3"], strict: true },
  { col: 2, values: ["Product A", "Product B", "Product C", "Product D"], strict: false },
  { col: 3, values: ["Accepted", "In progress", "Dispatched", "Delivered"], strict: true },
  { col: 6, values: ["In store", "Phone", "Online"], strict: false },
];
for (const v of validations) {
  requests.push({
    setDataValidation: {
      range: { sheetId: gid, startRowIndex: 1, endRowIndex: 100, startColumnIndex: v.col, endColumnIndex: v.col + 1 },
      rule: {
        condition: { type: "ONE_OF_LIST", values: v.values.map(x => ({ userEnteredValue: x })) },
        showCustomUi: true,
        strict: v.strict,
      },
    },
  });
}

// Conditional formatting
const cf = [
  { col: 0, rules: [
    { v: "P0", bg: { red: 0.85, green: 0.93, blue: 1.00 } },
    { v: "P1", bg: { red: 1.00, green: 0.86, blue: 0.83 } },
    { v: "P2", bg: { red: 1.00, green: 0.95, blue: 0.78 } },
    { v: "P3", bg: { red: 0.94, green: 0.87, blue: 0.78 } },
  ]},
  { col: 2, rules: [
    { v: "Product A", bg: { red: 0.85, green: 0.92, blue: 1.00 } },
    { v: "Product B", bg: { red: 0.93, green: 0.84, blue: 1.00 } },
    { v: "Product C", bg: { red: 0.83, green: 0.97, blue: 0.85 } },
    { v: "Product D", bg: { red: 0.78, green: 0.92, blue: 0.96 } },
  ]},
  { col: 3, rules: [
    { v: "Accepted",    bg: { red: 1.00, green: 0.86, blue: 0.93 } },
    { v: "In progress", bg: { red: 1.00, green: 0.95, blue: 0.78 } },
    { v: "Dispatched",  bg: { red: 0.83, green: 0.92, blue: 1.00 } },
    { v: "Delivered",   bg: { red: 0.78, green: 0.94, blue: 0.82 } },
  ]},
  { col: 6, rules: [
    { v: "In store", bg: { red: 0.83, green: 0.97, blue: 0.85 } },
    { v: "Phone",    bg: { red: 0.85, green: 0.85, blue: 1.00 } },
    { v: "Online",   bg: { red: 1.00, green: 0.95, blue: 0.78 } },
  ]},
];
for (const { col, rules } of cf) {
  for (const r of rules) {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId: gid, startRowIndex: 1, startColumnIndex: col, endColumnIndex: col + 1 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: r.v }] },
            format: { backgroundColor: r.bg, textFormat: { bold: true } },
          },
        },
      },
    });
  }
}

// Currency format on Price column
requests.push({
  repeatCell: {
    range: { sheetId: gid, startRowIndex: 1, endRowIndex: 100, startColumnIndex: 5, endColumnIndex: 6 },
    cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: '"£"#,##0.00' } } },
    fields: "userEnteredFormat.numberFormat",
  },
});

// Auto-resize
requests.push({
  autoResizeDimensions: { dimensions: { sheetId: gid, dimension: "COLUMNS", startIndex: 0, endIndex: 9 } },
});

await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
console.log("Sales_orders template applied successfully.");

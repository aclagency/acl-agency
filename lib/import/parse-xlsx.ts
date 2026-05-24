import * as XLSX from "xlsx";

export type RawRow = Record<string, unknown>;

export function parseXlsxBuffer(buffer: ArrayBuffer | Buffer): RawRow[] {
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = wb.Sheets[firstSheetName];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: null });
  const headerIdx = aoa.findIndex((row) =>
    Array.isArray(row) && row.some((c) => typeof c === "string" && c.trim().toLowerCase() === "company name")
  );
  if (headerIdx < 0) {
    throw new Error("Could not find header row — expected a row containing 'Company Name'.");
  }
  const headers = (aoa[headerIdx] as unknown[]).map((c) => (typeof c === "string" ? c.trim() : ""));
  const dataRows = aoa.slice(headerIdx + 1);
  const rows: RawRow[] = [];
  for (const r of dataRows) {
    if (!Array.isArray(r)) continue;
    const obj: RawRow = {};
    let nonEmpty = false;
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      if (!h) continue;
      const v = r[i] ?? null;
      obj[h] = v;
      if (v !== null && v !== "") nonEmpty = true;
    }
    if (nonEmpty) rows.push(obj);
  }
  return rows;
}

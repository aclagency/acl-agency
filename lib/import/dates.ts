const BLANK_TOKENS = new Set(["", "-", "n.tsfr", "ntsfr", "n/a", "na", "nil"]);

export type CellValue = string | number | Date | null | undefined;

export function parseCellDate(value: CellValue): string | null {
  if (value === null || value === undefined) return null;

  if (value instanceof Date) {
    return toIso(value);
  }

  if (typeof value === "number") {
    const ms = Math.round((value - 25569) * 86400 * 1000);
    return toIso(new Date(ms));
  }

  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (BLANK_TOKENS.has(trimmed.toLowerCase())) return null;

  const m = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  let year = Number(m[3]);
  if (year < 100) year += 2000;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return toIso(d);
}

function toIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

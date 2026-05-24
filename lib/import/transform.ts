import type { CellValue } from "./dates";
import { parseCellDate } from "./dates";
import type { RenewalKind } from "../supabase/types";

export type RawRow = Record<string, unknown>;

export interface OutCustomer {
  company_name: string;
  tin_number: string | null;
  pic_name: string | null;
}

export interface OutVehicle {
  _company: string;
  plate_no: string;
  trailer_no: string | null;
  vehicle_type: string | null;
  id_no: string | null;
  id_2: string | null;
  year_made: number | null;
}

export interface OutRenewal {
  _plate: string;
  kind: RenewalKind;
  due_date: string;
  ncd_percent: number | null;
}

export interface TransformResult {
  customers: OutCustomer[];
  vehicles: OutVehicle[];
  renewals: OutRenewal[];
  errors: string[];
}

const HEADERS = {
  company:  ["company name"],
  pic:      ["pic"],
  vehicle:  ["vehicle no. / trailer", "vehicle no./trailer", "vehicle no"],
  id:       ["id"],
  id2:      ["id-2", "id 2"],
  tin:      ["tin number"],
  ncd:      ["ncd (%)", "ncd"],
  roadTax:  ["road tax"],
  insurance:["insurance"],
  puspakom: ["puspakom due date", "puspakom"],
  vtype:    ["vehicle type"],
  permit:   ["permit due date", "permit"],
  year:     ["year made / age", "year made", "year"],
} as const;

function pick(row: RawRow, keys: readonly string[]): unknown {
  const lower: Record<string, unknown> = {};
  for (const k of Object.keys(row)) lower[k.toLowerCase().trim()] = row[k];
  for (const k of keys) {
    const v = lower[k];
    if (v !== undefined) return v;
  }
  return undefined;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function parseYear(v: unknown): number | null {
  const s = str(v);
  if (!s) return null;
  const m = s.match(/(\d{4})/);
  if (!m) return null;
  const y = Number(m[1]);
  return y > 1900 && y < 2100 ? y : null;
}

function parseNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function transformRows(rows: RawRow[]): TransformResult {
  const customers = new Map<string, OutCustomer>();
  const vehicles: OutVehicle[] = [];
  const renewals: OutRenewal[] = [];
  const errors: string[] = [];

  rows.forEach((row, idx) => {
    const companyName = str(pick(row, HEADERS.company));
    const plate       = str(pick(row, HEADERS.vehicle));
    if (!companyName) { errors.push(`Row ${idx + 1}: missing Company Name`); return; }
    if (!plate)       { errors.push(`Row ${idx + 1}: missing Vehicle plate`); return; }

    const tin = str(pick(row, HEADERS.tin));
    const key = `${companyName.toLowerCase()}|${(tin ?? "").toLowerCase()}`;
    if (!customers.has(key)) {
      customers.set(key, {
        company_name: companyName,
        tin_number: tin,
        pic_name: str(pick(row, HEADERS.pic)),
      });
    }

    vehicles.push({
      _company: companyName,
      plate_no: plate,
      trailer_no: null,
      vehicle_type: str(pick(row, HEADERS.vtype)),
      id_no: str(pick(row, HEADERS.id)),
      id_2:  str(pick(row, HEADERS.id2)),
      year_made: parseYear(pick(row, HEADERS.year)),
    });

    const ncd = parseNum(pick(row, HEADERS.ncd));
    const renewalSpecs: Array<{ kind: RenewalKind; raw: CellValue; carriesNcd: boolean }> = [
      { kind: "road_tax",  raw: pick(row, HEADERS.roadTax)  as CellValue, carriesNcd: false },
      { kind: "insurance", raw: pick(row, HEADERS.insurance) as CellValue, carriesNcd: true  },
      { kind: "puspakom",  raw: pick(row, HEADERS.puspakom)  as CellValue, carriesNcd: false },
      { kind: "permit",    raw: pick(row, HEADERS.permit)    as CellValue, carriesNcd: false },
    ];
    for (const spec of renewalSpecs) {
      const due = parseCellDate(spec.raw);
      if (!due) continue;
      renewals.push({
        _plate: plate,
        kind: spec.kind,
        due_date: due,
        ncd_percent: spec.carriesNcd ? ncd : null,
      });
    }
  });

  return {
    customers: [...customers.values()],
    vehicles,
    renewals,
    errors,
  };
}

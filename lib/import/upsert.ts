import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { TransformResult } from "./transform";

export interface UpsertSummary {
  customers_upserted: number;
  vehicles_upserted: number;
  renewals_inserted: number;
  errors: string[];
}

export async function upsertImport(data: TransformResult): Promise<UpsertSummary> {
  const sb = getSupabaseAdmin();
  const errors = [...data.errors];

  const customerRows = data.customers.map((c) => ({
    company_name: c.company_name,
    tin_number: c.tin_number,
    pic_name: c.pic_name,
  }));

  const { data: existingCustomers, error: cSelErr } = await sb
    .from("customers")
    .select("id, company_name, tin_number");
  if (cSelErr) { errors.push(`customers select: ${cSelErr.message}`); return finish(0, 0, 0); }

  const customerKey = (name: string, tin: string | null) =>
    `${name.toLowerCase()}|${(tin ?? "").toLowerCase()}`;
  const existingMap = new Map<string, string>();
  for (const c of existingCustomers ?? []) {
    existingMap.set(customerKey(c.company_name, c.tin_number), c.id);
  }

  const newCustomers = customerRows.filter(
    (c) => !existingMap.has(customerKey(c.company_name, c.tin_number))
  );
  let customersUpserted = 0;
  if (newCustomers.length > 0) {
    const { data: inserted, error } = await sb
      .from("customers")
      .insert(newCustomers)
      .select("id, company_name, tin_number");
    if (error) { errors.push(`customers insert: ${error.message}`); return finish(0, 0, 0); }
    for (const c of inserted ?? []) {
      existingMap.set(customerKey(c.company_name, c.tin_number), c.id);
    }
    customersUpserted = inserted?.length ?? 0;
  }

  const vehicleRows = data.vehicles.map((v) => {
    const direct = existingMap.get(customerKey(v._company, null));
    const fuzzy  = [...existingMap.entries()].find(([k]) =>
      k.startsWith(v._company.toLowerCase() + "|")
    )?.[1];
    const cid = direct ?? fuzzy;
    if (!cid) return null;
    return {
      customer_id: cid,
      plate_no: v.plate_no,
      trailer_no: v.trailer_no,
      vehicle_type: v.vehicle_type,
      id_no: v.id_no,
      id_2: v.id_2,
      year_made: v.year_made,
    };
  }).filter((v): v is NonNullable<typeof v> => v !== null);

  let vehiclesUpserted = 0;
  if (vehicleRows.length > 0) {
    const { data: upserted, error } = await sb
      .from("vehicles")
      .upsert(vehicleRows, { onConflict: "plate_no" })
      .select("id, plate_no");
    if (error) { errors.push(`vehicles upsert: ${error.message}`); return finish(customersUpserted, 0, 0); }
    vehiclesUpserted = upserted?.length ?? 0;
  }

  const { data: vehiclesById, error: vSelErr } = await sb
    .from("vehicles")
    .select("id, plate_no");
  if (vSelErr) { errors.push(`vehicles select: ${vSelErr.message}`); return finish(customersUpserted, vehiclesUpserted, 0); }
  const plateToVehicleId = new Map<string, string>();
  for (const v of vehiclesById ?? []) plateToVehicleId.set(v.plate_no, v.id);

  const { data: openRenewals, error: rSelErr } = await sb
    .from("renewals")
    .select("id, vehicle_id, kind, due_date, status")
    .not("status", "in", "(closed_won,closed_lost,bad_debt)");
  if (rSelErr) { errors.push(`renewals select: ${rSelErr.message}`); return finish(customersUpserted, vehiclesUpserted, 0); }

  const openKey = (vid: string, k: string) => `${vid}|${k}`;
  const openMap = new Map<string, { id: string; due_date: string }>();
  for (const r of openRenewals ?? []) openMap.set(openKey(r.vehicle_id, r.kind), { id: r.id, due_date: r.due_date });

  const toInsert: Array<{ vehicle_id: string; kind: string; due_date: string; ncd_percent: number | null }> = [];
  const toUpdate: Array<{ id: string; due_date: string; ncd_percent: number | null }> = [];

  for (const r of data.renewals) {
    const vid = plateToVehicleId.get(r._plate);
    if (!vid) continue;
    const existing = openMap.get(openKey(vid, r.kind));
    if (existing) {
      if (existing.due_date !== r.due_date) {
        toUpdate.push({ id: existing.id, due_date: r.due_date, ncd_percent: r.ncd_percent });
      }
    } else {
      toInsert.push({ vehicle_id: vid, kind: r.kind, due_date: r.due_date, ncd_percent: r.ncd_percent });
    }
  }

  let renewalsInserted = 0;
  if (toInsert.length > 0) {
    const { error } = await sb.from("renewals").insert(toInsert);
    if (error) errors.push(`renewals insert: ${error.message}`);
    else renewalsInserted = toInsert.length;
  }
  for (const u of toUpdate) {
    const { error } = await sb.from("renewals")
      .update({ due_date: u.due_date, ncd_percent: u.ncd_percent })
      .eq("id", u.id);
    if (error) errors.push(`renewals update ${u.id}: ${error.message}`);
  }

  return finish(customersUpserted, vehiclesUpserted, renewalsInserted);

  function finish(c: number, v: number, r: number): UpsertSummary {
    return { customers_upserted: c, vehicles_upserted: v, renewals_inserted: r, errors };
  }
}

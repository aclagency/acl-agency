import { describe, expect, it } from "vitest";
import { transformRows, type RawRow } from "./transform";

const sample: RawRow[] = [
  {
    "Company Name": "ARS SPEED ENTERPRISE",
    "PIC": "5227",
    "Vehicle No. / Trailer": "PJM4629",
    "ID": "RA0061368-D",
    "ID-2": "202003222571",
    "TIN Number": null,
    "NCD (%)": 0,
    "Road Tax": "-",
    "Insurance": "10/12/2021",
    "Puspakom Due Date": null,
    "Vehicle Type": "LA",
    "Permit Due Date": "06/12/2025",
    "Year Made / Age": "1991 / 33",
  },
  {
    "Company Name": "HOO PENG",
    "PIC": "IOO PENG / 022",
    "Vehicle No. / Trailer": "AK7658 - X RN",
    "ID": "000311628-K",
    "ID-2": "197303005103",
    "TIN Number": "x",
    "NCD (%)": 20,
    "Road Tax": "-",
    "Insurance": "05/03/2022",
    "Puspakom Due Date": null,
    "Vehicle Type": "LC",
    "Permit Due Date": "19/11/2026",
    "Year Made / Age": "1968 / 55",
  },
];

describe("transformRows", () => {
  it("produces one customer per unique company name", () => {
    const { customers } = transformRows(sample);
    expect(customers.map((c) => c.company_name).sort()).toEqual([
      "ARS SPEED ENTERPRISE",
      "HOO PENG",
    ]);
  });

  it("produces one vehicle per row, linked by plate", () => {
    const { vehicles } = transformRows(sample);
    expect(vehicles).toHaveLength(2);
    const ars = vehicles.find((v) => v.plate_no === "PJM4629");
    expect(ars?.vehicle_type).toBe("LA");
    expect(ars?.year_made).toBe(1991);
  });

  it("skips renewals for blank/N.TSFR dates but emits the parseable ones", () => {
    const { renewals } = transformRows(sample);
    const arsRenewals = renewals.filter((r) => r._plate === "PJM4629");
    expect(arsRenewals.map((r) => r.kind).sort()).toEqual(["insurance", "permit"]);
    const arsInsurance = arsRenewals.find((r) => r.kind === "insurance");
    expect(arsInsurance?.due_date).toBe("2021-12-10");
  });

  it("captures NCD percent on the insurance renewal only", () => {
    const { renewals } = transformRows(sample);
    const hooInsurance = renewals.find(
      (r) => r._plate === "AK7658 - X RN" && r.kind === "insurance"
    );
    expect(hooInsurance?.ncd_percent).toBe(20);
    const hooPermit = renewals.find(
      (r) => r._plate === "AK7658 - X RN" && r.kind === "permit"
    );
    expect(hooPermit?.ncd_percent).toBeNull();
  });

  it("deduplicates customers when same company appears on multiple rows", () => {
    const dup: RawRow[] = [
      { ...sample[0] },
      { ...sample[0], "Vehicle No. / Trailer": "PJM9999" },
    ];
    const { customers, vehicles } = transformRows(dup);
    expect(customers).toHaveLength(1);
    expect(vehicles).toHaveLength(2);
  });

  it("reports rows with missing required fields instead of crashing", () => {
    const bad: RawRow[] = [
      { "Company Name": "", "Vehicle No. / Trailer": "XYZ123" },
      { "Company Name": "OK CO", "Vehicle No. / Trailer": "" },
    ];
    const { errors } = transformRows(bad);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatch(/company name/i);
    expect(errors[1]).toMatch(/vehicle/i);
  });
});

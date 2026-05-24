import { describe, expect, it } from "vitest";
import { parseCellDate } from "./dates";

describe("parseCellDate", () => {
  it("parses DD/MM/YYYY strings", () => {
    expect(parseCellDate("12/04/2024")).toBe("2024-04-12");
    expect(parseCellDate("05/03/2022")).toBe("2022-03-05");
    expect(parseCellDate("19/11/2026")).toBe("2026-11-19");
  });

  it("parses Excel date serial numbers", () => {
    expect(parseCellDate(44927)).toBe("2023-01-01");
  });

  it("returns null for blanks and placeholders", () => {
    expect(parseCellDate("")).toBeNull();
    expect(parseCellDate("-")).toBeNull();
    expect(parseCellDate(" - ")).toBeNull();
    expect(parseCellDate("N.TSFR")).toBeNull();
    expect(parseCellDate("n.tsfr")).toBeNull();
    expect(parseCellDate(null)).toBeNull();
    expect(parseCellDate(undefined)).toBeNull();
  });

  it("returns null for unparseable strings", () => {
    expect(parseCellDate("not a date")).toBeNull();
    expect(parseCellDate("13/13/2024")).toBeNull();
  });

  it("accepts Date objects", () => {
    expect(parseCellDate(new Date("2024-04-12T00:00:00Z"))).toBe("2024-04-12");
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { toLocalYMD, ymdToSupabaseTimestamp, ymdFromIso } from "../dates";

describe("toLocalYMD", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns the local calendar day, not UTC", () => {
    vi.setSystemTime(new Date("2026-06-05T20:30:00")); // 8:30 PM
    process.env.TZ = "America/Mexico_City";
    // The current bug: toISOString().substr(0,10) would return "2026-06-06"
    expect(toLocalYMD()).toBe("2026-06-05");
  });

  it("returns the same day at 11:59 PM local", () => {
    vi.setSystemTime(new Date("2026-12-31T23:59:00"));
    process.env.TZ = "America/Mexico_City";
    expect(toLocalYMD()).toBe("2026-12-31");
  });
});

describe("ymdToSupabaseTimestamp", () => {
  it("preserves the day in extreme timezones", () => {
    process.env.TZ = "Pacific/Kiritimati"; // UTC+14
    expect(ymdToSupabaseTimestamp("2026-06-05")).toMatch(/^2026-06-05/);
    process.env.TZ = "Pacific/Pago_Pago"; // UTC-11
    expect(ymdToSupabaseTimestamp("2026-06-05")).toMatch(/^2026-06-05/);
  });
});

describe("ymdFromIso", () => {
  it("extracts YYYY-MM-DD without timezone shifts", () => {
    expect(ymdFromIso("2026-06-04T18:30:00.000Z")).toBe("2026-06-04");
    expect(ymdFromIso("2026-06-05T06:00:00.000Z")).toBe("2026-06-05");
  });
});

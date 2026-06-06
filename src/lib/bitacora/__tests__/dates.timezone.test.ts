process.env.TZ = "America/Mexico_City"; // must run before any Date work

import { describe, it, expect, vi, afterEach } from "vitest";
import { toLocalYMD, ymdToSupabaseTimestamp } from "../dates";

const FIXED_LOCAL_DAY = "2026-06-05"; // a Friday, no DST transition in Mexico

// Build the time-of-day list
const buildTimes = (stepMinutes: number) => {
  const out: Array<[number, number, number]> = [];
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      out.push([h, m, 0]);
    }
  }
  out.push([23, 59, 59]); // explicit last second
  return out;
};

const times = buildTimes(15); // 6:00, 6:15, 6:30, ..., 23:45, 23:59:59

describe("timezone resilience: Zapopan, 6 AM to 11:59:59 PM", () => {
  afterEach(() => vi.useRealTimers());

  it.each(times)(
    "at %02d:%02d:%02d — date sent to Supabase stays on %s",
    (h, m, s) => {
      const [y, mo, d] = FIXED_LOCAL_DAY.split("-").map(Number);
      vi.useFakeTimers();
      vi.setSystemTime(new Date(y, mo - 1, d, h, m, s));

      // 1. The form's default date is today (local)
      const ymd = toLocalYMD();
      expect(ymd).toBe(FIXED_LOCAL_DAY);

      // 2. What we send to Supabase has the same calendar day
      const iso = ymdToSupabaseTimestamp(ymd);
      expect(iso).toMatch(new RegExp(`^${FIXED_LOCAL_DAY}`));

      vi.useRealTimers();
    }
  );
});

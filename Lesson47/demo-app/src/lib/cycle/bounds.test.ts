import { describe, expect, it } from "vitest";
import {
  dateInCycle,
  getCycleBoundsForDate,
  getCurrentCycleBounds,
  getNextCycleBounds,
} from "./bounds";

describe("cycle bounds", () => {
  it("computes August 2026 bounds in Europe/Istanbul", () => {
    const date = new Date("2026-08-15T12:00:00.000Z");
    const { cycleStart, cycleEnd } = getCycleBoundsForDate(
      date,
      "Europe/Istanbul",
    );
    expect(dateInCycle(date, cycleStart, cycleEnd)).toBe(true);
    expect(dateInCycle(new Date("2026-07-31T20:00:00.000Z"), cycleStart, cycleEnd)).toBe(
      false,
    );
  });

  it("next cycle is the following month", () => {
    const current = getCurrentCycleBounds(
      "Europe/Istanbul",
      new Date("2026-08-10T10:00:00.000Z"),
    );
    const next = getNextCycleBounds(current.cycleStart, "Europe/Istanbul");
    expect(next.cycleStart.getTime()).toBeGreaterThan(current.cycleEnd.getTime());
  });
});

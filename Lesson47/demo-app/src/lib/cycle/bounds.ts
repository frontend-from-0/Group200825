import {
  endOfMonth,
  startOfMonth,
  isWithinInterval,
  addMonths,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export type CycleBounds = {
  cycleStart: Date;
  cycleEnd: Date;
};

/** Calendar month bounds in the user's IANA timezone, stored as UTC Date. */
export function getCycleBoundsForDate(
  date: Date,
  timeZone: string,
): CycleBounds {
  const zoned = toZonedTime(date, timeZone);
  const startLocal = startOfMonth(zoned);
  const endLocal = endOfMonth(zoned);
  endLocal.setHours(23, 59, 59, 999);

  return {
    cycleStart: fromZonedTime(startLocal, timeZone),
    cycleEnd: fromZonedTime(endLocal, timeZone),
  };
}

export function getCurrentCycleBounds(timeZone: string, now = new Date()): CycleBounds {
  return getCycleBoundsForDate(now, timeZone);
}

export function dateInCycle(
  date: Date,
  cycleStart: Date,
  cycleEnd: Date,
): boolean {
  return isWithinInterval(date, { start: cycleStart, end: cycleEnd });
}

export function getNextCycleBounds(
  cycleStart: Date,
  timeZone: string,
): CycleBounds {
  const zonedStart = toZonedTime(cycleStart, timeZone);
  const nextMonth = addMonths(zonedStart, 1);
  return getCycleBoundsForDate(nextMonth, timeZone);
}

export function formatCycleLabel(
  cycleStart: Date,
  locale: string,
  timeZone: string,
): string {
  const zoned = toZonedTime(cycleStart, timeZone);
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone,
  }).format(zoned);
}

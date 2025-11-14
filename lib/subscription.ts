import { DateTime } from "luxon";

export function computeNextRunUTC(
  freq: "daily" | "weekly" | "monthly",
  tz: string,
  hour: number,
  minute: number,
  fromUTC: Date = new Date()
): Date {
  const now = DateTime.fromJSDate(fromUTC, { zone: "utc" }).setZone(tz);
  let dt = now.set({ hour, minute, second: 0, millisecond: 0 });

  // If the time has passed today, move to next occurrence
  if (dt <= now) {
    if (freq === "daily") {
      dt = dt.plus({ days: 1 });
    } else if (freq === "weekly") {
      dt = dt.plus({ weeks: 1 });
    } else {
      dt = dt.plus({ months: 1 });
    }
  }

  // For monthly, ensure we don't go past the end of the month
  if (freq === "monthly") {
    const safeDay = Math.min(now.day, dt.endOf("month").day);
    dt = dt.set({ day: safeDay });
  }

  return dt.setZone("utc").toJSDate();
}

export function advanceFrom(
  prevUTC: Date,
  freq: "daily" | "weekly" | "monthly",
  tz: string,
  hour: number,
  minute: number
): Date {
  const prev = DateTime.fromJSDate(prevUTC, { zone: "utc" }).setZone(tz);
  let dt = prev;

  if (freq === "daily") {
    dt = dt.plus({ days: 1 });
  } else if (freq === "weekly") {
    dt = dt.plus({ weeks: 1 });
  } else {
    dt = dt.plus({ months: 1 });
  }

  dt = dt.set({ hour, minute, second: 0, millisecond: 0 });

  return dt.setZone("utc").toJSDate();
}


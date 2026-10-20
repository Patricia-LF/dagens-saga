// Helpers for calendar dates (no time) in Europe/Stockholm.
//
// A Postgres `date` column has no time and no time zone. Prisma represents it as a JS Date
// at 00:00 UTC on that day, and when writing it keeps only the UTC year-month-day.
// So every date here is created with Date.UTC(...) and changed with the UTC methods.
// `new Date(2026, 9, 21)` would be local midnight (22:00 UTC the day before in Sweden),
// and the saved date would end up one day too early.

const stockholmFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Stockholm",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// "2026-10-20" -> Date at 2026-10-20T00:00:00Z
export function parseDate(text: string): Date {
  const [year, month, day] = text.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date: ${text}`);
  }
  return new Date(Date.UTC(year, month - 1, day));
}

// Date at 00:00 UTC -> "2026-10-20"
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Today's calendar date in Stockholm (the en-CA locale formats as YYYY-MM-DD).
export function todayInStockholm(now: Date = new Date()): Date {
  return parseDate(stockholmFormatter.format(now));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// The day after the latest scheduled date, but never earlier than tomorrow,
// so a batch never gets dates in the past.
export function firstFreeDate(latest: Date | null, now: Date = new Date()): Date {
  const tomorrow = addDays(todayInStockholm(now), 1);
  if (latest === null) {
    return tomorrow;
  }
  const dayAfterLatest = addDays(latest, 1);
  return dayAfterLatest > tomorrow ? dayAfterLatest : tomorrow;
}

import { describe, expect, it } from "vitest";
import {
  addDays,
  firstFreeDate,
  formatDate,
  parseDate,
  todayInStockholm,
} from "../src/stockholm-date.js";

describe("parseDate and formatDate", () => {
  it("creates a date at midnight UTC and formats it back", () => {
    const date = parseDate("2026-10-20");

    expect(date.toISOString()).toBe("2026-10-20T00:00:00.000Z");
    expect(formatDate(date)).toBe("2026-10-20");
  });
});

describe("todayInStockholm", () => {
  it("is already the next day in Stockholm just after midnight (summer time, UTC+2)", () => {
    // 22:30 UTC on 20 October is 00:30 on 21 October in Stockholm.
    expect(formatDate(todayInStockholm(new Date("2026-10-20T22:30:00Z")))).toBe("2026-10-21");
  });

  it("is still the same day in Stockholm just before midnight (summer time)", () => {
    // 21:59 UTC is 23:59 in Stockholm.
    expect(formatDate(todayInStockholm(new Date("2026-10-20T21:59:00Z")))).toBe("2026-10-20");
  });

  it("uses UTC+1 after daylight saving time ends (25 October 2026)", () => {
    // 22:30 UTC on 26 October is 23:30 in Stockholm, so still the 26th.
    expect(formatDate(todayInStockholm(new Date("2026-10-26T22:30:00Z")))).toBe("2026-10-26");
    // 23:30 UTC is 00:30 on the 27th in Stockholm.
    expect(formatDate(todayInStockholm(new Date("2026-10-26T23:30:00Z")))).toBe("2026-10-27");
  });

  it("handles the day the clocks go back (25 October 2026, a 25-hour day)", () => {
    // 22:00 UTC on the 24th is 00:00 on the 25th (still UTC+2).
    expect(formatDate(todayInStockholm(new Date("2026-10-24T22:00:00Z")))).toBe("2026-10-25");
    // 01:30 UTC is 02:30 after the clocks went back (UTC+1).
    expect(formatDate(todayInStockholm(new Date("2026-10-25T01:30:00Z")))).toBe("2026-10-25");
    // 22:59 UTC is 23:59 on the 25th, 23:00 UTC is 00:00 on the 26th.
    expect(formatDate(todayInStockholm(new Date("2026-10-25T22:59:00Z")))).toBe("2026-10-25");
    expect(formatDate(todayInStockholm(new Date("2026-10-25T23:00:00Z")))).toBe("2026-10-26");
  });

  it("handles the day the clocks go forward (28 March 2027, a 23-hour day)", () => {
    // 22:59 UTC on the 27th is 23:59 on the 27th (UTC+1), 23:00 UTC is 00:00 on the 28th.
    expect(formatDate(todayInStockholm(new Date("2027-03-27T22:59:00Z")))).toBe("2027-03-27");
    expect(formatDate(todayInStockholm(new Date("2027-03-27T23:00:00Z")))).toBe("2027-03-28");
    // 01:30 UTC is 03:30 after the clocks jumped forward (UTC+2).
    expect(formatDate(todayInStockholm(new Date("2027-03-28T01:30:00Z")))).toBe("2027-03-28");
    // 21:59 UTC is 23:59 on the 28th, 22:00 UTC is 00:00 on the 29th.
    expect(formatDate(todayInStockholm(new Date("2027-03-28T21:59:00Z")))).toBe("2027-03-28");
    expect(formatDate(todayInStockholm(new Date("2027-03-28T22:00:00Z")))).toBe("2027-03-29");
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(formatDate(addDays(parseDate("2026-10-31"), 1))).toBe("2026-11-01");
    expect(formatDate(addDays(parseDate("2026-12-31"), 1))).toBe("2027-01-01");
  });

  it("is not affected by the daylight saving switch", () => {
    expect(formatDate(addDays(parseDate("2026-10-24"), 2))).toBe("2026-10-26");
  });

  it("does not change the original date", () => {
    const date = parseDate("2026-10-20");
    addDays(date, 5);
    expect(formatDate(date)).toBe("2026-10-20");
  });
});

describe("firstFreeDate", () => {
  // Noon on 20 October in Stockholm, so tomorrow is 21 October.
  const now = new Date("2026-10-20T10:00:00Z");

  it("starts tomorrow when nothing is scheduled", () => {
    expect(formatDate(firstFreeDate(null, now))).toBe("2026-10-21");
  });

  it("starts the day after the latest scheduled date when it is in the future", () => {
    expect(formatDate(firstFreeDate(parseDate("2026-10-25"), now))).toBe("2026-10-26");
  });

  it("starts tomorrow when the latest scheduled date is today", () => {
    expect(formatDate(firstFreeDate(parseDate("2026-10-20"), now))).toBe("2026-10-21");
  });

  it("never returns a date in the past", () => {
    expect(formatDate(firstFreeDate(parseDate("2026-09-01"), now))).toBe("2026-10-21");
  });
});

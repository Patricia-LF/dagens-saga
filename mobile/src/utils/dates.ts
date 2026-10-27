// Today's date as "YYYY-MM-DD" in Swedish time, the same format as scheduledDate
export function todayInStockholm(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
  }).format(new Date());
}

// "2026-10-21" → "21 oktober"
export function formatStoryDate(date: string): string {
  return new Date(date).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    timeZone: "UTC", // the date has no time, so read it as UTC to avoid showing the day before
  });
}

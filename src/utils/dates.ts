// Small date helpers used across the app

export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function eachDayBetween(startStr: string, endStr: string): string[] {
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  const result: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    result.push(toISODate(d));
  }

  return result;
}

export function minISO(a: string, b: string): string {
  return new Date(a + "T00:00:00") <= new Date(b + "T00:00:00") ? a : b;
}

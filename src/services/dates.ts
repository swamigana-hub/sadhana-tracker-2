export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMondayOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

export function formatWeekLabel(monday: Date): string {
  return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getYear(date: Date): number {
  return date.getFullYear();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function computeDaysSinceInstall(
  firstOpenedAtIso: string,
  now: Date = new Date()
): number {
  const installDay = getLocalDateString(new Date(firstOpenedAtIso));
  const today = getLocalDateString(now);
  const installDate = parseLocalDate(installDay);
  const todayDate = parseLocalDate(today);
  const diffMs = todayDate.getTime() - installDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

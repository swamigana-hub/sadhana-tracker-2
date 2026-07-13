import { calculateLogMinutes } from '../data/practices';

const STORAGE_KEY = 'daily_config_by_date';

export type DailyConfigByDate = Record<string, string[]>;

function readStore(): DailyConfigByDate {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DailyConfigByDate;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: DailyConfigByDate): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Persist today's daily practice IDs only — never overwrites past dates. */
export function snapshotDailyConfigForDate(date: string, dailyPracticeIds: string[]): void {
  const store = readStore();
  store[date] = [...dailyPracticeIds];
  writeStore(store);
}

export function getDailyConfigForDate(date: string): string[] | null {
  const ids = readStore()[date];
  return ids ? [...ids] : null;
}

export function getScheduledMinutesForDate(date: string, fallbackIds: string[]): number {
  const ids = getDailyConfigForDate(date) ?? fallbackIds;
  return calculateLogMinutes(ids);
}

export function getAllDailyConfigSnapshots(): DailyConfigByDate {
  return readStore();
}

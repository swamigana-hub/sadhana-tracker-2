import type { PracticeLogRow } from '../lib/supabase/types';
import { PRACTICES } from '../data/practices';
import {
  addDays,
  getLocalDateString,
  getMondayOfWeek,
  getYear,
  parseLocalDate,
} from './dates';
import { getCompletionPercent, resolveDayTileVisual, type DayTileVisual } from './dayTileState';
import { getDistinctDailyLoggedToday } from './ringCalculator';
import { formatWeekLabel } from './weekLabels';
import { getFirstOpenedAt } from './localStore';
import type { DailyConfigByDate } from './dailyConfigSnapshots';

export interface HeatmapDay {
  date: string;
  tileState: DayTileVisual;
  hasLogs: boolean;
}

export interface HeatmapWeek {
  mondayDate: string;
  weekLabel: string;
  year: number;
  days: HeatmapDay[];
  weekMinutes: number;
  isCurrentWeek: boolean;
}

type LogSnapshot = Pick<
  PracticeLogRow,
  | 'log_date'
  | 'logged_at'
  | 'practices_logged'
  | 'daily_practices_at_time'
  | 'daily_count_at_time'
  | 'minutes_total'
>;

function getSnapshotForDate(logs: LogSnapshot[], date: string): LogSnapshot | null {
  const dayLogs = logs
    .filter((l) => l.log_date === date)
    .sort((a, b) => b.logged_at.localeCompare(a.logged_at));
  return dayLogs[0] ?? null;
}

function resolveDailyConfigForDate(
  date: string,
  logs: LogSnapshot[],
  dailyConfigByDate: DailyConfigByDate
): { ids: string[]; count: number } {
  const historyIds = dailyConfigByDate[date];
  if (historyIds && historyIds.length > 0) {
    return { ids: [...historyIds], count: historyIds.length };
  }

  const snapshot = getSnapshotForDate(logs, date);
  if (snapshot) {
    return {
      ids: [...snapshot.daily_practices_at_time],
      count: snapshot.daily_count_at_time,
    };
  }

  return { ids: [], count: 0 };
}

function getTrackingStartDate(logs: LogSnapshot[]): string {
  const opened = getFirstOpenedAt().slice(0, 10);
  if (logs.length === 0) return opened;
  const earliestLog = logs.map((l) => l.log_date).sort()[0];
  return earliestLog < opened ? earliestLog : opened;
}

function computeTileStateForDate(
  logs: LogSnapshot[],
  date: string,
  today: string,
  dailyConfigByDate: DailyConfigByDate
): HeatmapDay {
  const trackingStartDate = getTrackingStartDate(logs);
  const dayLogs = logs.filter((l) => l.log_date === date);
  const { ids: dailyIds, count: dailyCount } = resolveDailyConfigForDate(
    date,
    logs,
    dailyConfigByDate
  );

  if (dayLogs.length === 0) {
    const tileState = resolveDayTileVisual({
      date,
      today,
      trackingStartDate,
      percent: 0,
      hasLogs: false,
    });
    return { date, tileState, hasLogs: false };
  }

  const distinctDaily = getDistinctDailyLoggedToday(dayLogs, date, dailyIds);
  const percent = getCompletionPercent(distinctDaily, dailyCount);
  const tileState = resolveDayTileVisual({
    date,
    today,
    trackingStartDate,
    percent,
    hasLogs: true,
  });
  return { date, tileState, hasLogs: true };
}

function sumWeekMinutes(logs: LogSnapshot[], monday: Date): number {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const dateStr = getLocalDateString(addDays(monday, i));
    for (const log of logs) {
      if (log.log_date === dateStr) {
        total += log.minutes_total ?? 0;
      }
    }
  }
  return total;
}

function buildWeek(
  monday: Date,
  logs: LogSnapshot[],
  today: string,
  dailyConfigByDate: DailyConfigByDate
): HeatmapWeek {
  const days: HeatmapDay[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(monday, i);
    const dateStr = getLocalDateString(day);
    days.push(computeTileStateForDate(logs, dateStr, today, dailyConfigByDate));
  }

  const mondayDate = getLocalDateString(monday);
  const currentMonday = getLocalDateString(getMondayOfWeek(parseLocalDate(today)));

  return {
    mondayDate,
    weekLabel: formatWeekLabel(mondayDate, today),
    year: getYear(monday),
    days,
    weekMinutes: sumWeekMinutes(logs, monday),
    isCurrentWeek: mondayDate === currentMonday,
  };
}

export function aggregateWeeklyHeatmap(
  logs: LogSnapshot[],
  referenceDate: Date = new Date(),
  dailyConfigByDate: DailyConfigByDate = {}
): HeatmapWeek[] {
  const today = getLocalDateString(referenceDate);

  if (logs.length === 0) {
    const monday = getMondayOfWeek(referenceDate);
    return [buildWeek(monday, logs, today, dailyConfigByDate)];
  }

  const dates = logs.map((l) => l.log_date).sort();
  const earliest = parseLocalDate(dates[0]);
  const latest = referenceDate;

  const startMonday = getMondayOfWeek(earliest);
  const endMonday = getMondayOfWeek(latest);

  const weeks: HeatmapWeek[] = [];
  let current = startMonday;
  while (current.getTime() <= endMonday.getTime()) {
    weeks.push(buildWeek(current, logs, today, dailyConfigByDate));
    current = addDays(current, 7);
  }

  return weeks.reverse();
}

/** Last 7 calendar days ending today — oldest left, today right. */
export function getRollingSevenDayStrip(
  logs: LogSnapshot[],
  today: string,
  dailyConfigByDate: DailyConfigByDate = {}
): HeatmapDay[] {
  const end = parseLocalDate(today);
  const days: HeatmapDay[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const dateStr = getLocalDateString(addDays(end, -offset));
    days.push(computeTileStateForDate(logs, dateStr, today, dailyConfigByDate));
  }
  return days;
}

export function getAllPracticeIds(): string[] {
  return PRACTICES.map((p) => p.id);
}

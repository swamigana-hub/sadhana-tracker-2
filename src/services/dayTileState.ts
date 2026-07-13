export type DayTileVisual =
  | 'before-tracking'
  | 'future'
  | 'missed'
  | 'p25'
  | 'p50'
  | 'p75'
  | 'p100'
  | 'p100plus';

/** @deprecated Use DayTileVisual — kept for gradual migration in tests */
export type DayTileState = 1 | 2 | 3 | 4 | 5 | 6;

export function getCompletionPercent(distinctDailyLogged: number, dailyCount: number): number {
  if (dailyCount === 0) return 0;
  return Math.round((distinctDailyLogged / dailyCount) * 100);
}

export function getDayTileVisual(percent: number): Exclude<DayTileVisual, 'before-tracking' | 'future' | 'missed'> {
  if (percent > 100) return 'p100plus';
  if (percent >= 76) return 'p100';
  if (percent >= 51) return 'p75';
  if (percent >= 26) return 'p50';
  return 'p25';
}

/** Legacy percent → old numeric state (tests). */
export function getDayTileState(percent: number): DayTileState {
  if (percent <= 0) return 1;
  if (percent <= 20) return 2;
  if (percent <= 40) return 3;
  if (percent <= 60) return 4;
  if (percent < 100) return 5;
  return 6;
}

export function resolveDayTileVisual(params: {
  date: string;
  today: string;
  trackingStartDate: string;
  percent: number;
  hasLogs: boolean;
}): DayTileVisual {
  const { date, today, trackingStartDate, percent, hasLogs } = params;

  if (date < trackingStartDate) return 'before-tracking';
  if (date > today) return 'future';
  if (percent <= 0 && !hasLogs) {
    return date < today ? 'missed' : 'future';
  }
  if (percent <= 0) return 'missed';

  return getDayTileVisual(percent);
}

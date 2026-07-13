import { describe, it, expect } from 'vitest';
import {
  getLocalDateString,
  getMondayOfWeek,
  formatWeekLabel,
  getYear,
  addDays,
  computeDaysSinceInstall,
} from './dates';

describe('getLocalDateString', () => {
  it('returns YYYY-MM-DD in local timezone', () => {
    const date = new Date(2026, 5, 26, 15, 30);
    expect(getLocalDateString(date)).toBe('2026-06-26');
  });
});

describe('getMondayOfWeek', () => {
  it('returns Monday for a Wednesday', () => {
    const wed = new Date(2026, 5, 25);
    expect(getLocalDateString(getMondayOfWeek(wed))).toBe('2026-06-22');
  });

  it('returns same day when input is Monday', () => {
    const mon = new Date(2026, 5, 22);
    expect(getLocalDateString(getMondayOfWeek(mon))).toBe('2026-06-22');
  });
});

describe('formatWeekLabel', () => {
  it('formats Monday as MMM DD', () => {
    const mon = new Date(2026, 5, 22);
    expect(formatWeekLabel(mon)).toBe('Jun 22');
  });
});

describe('getYear', () => {
  it('returns calendar year', () => {
    expect(getYear(new Date(2026, 0, 1))).toBe(2026);
  });
});

describe('addDays', () => {
  it('adds days to a date', () => {
    const start = new Date(2026, 5, 22);
    expect(getLocalDateString(addDays(start, 3))).toBe('2026-06-25');
  });
});

describe('computeDaysSinceInstall', () => {
  it('returns 0 on install day', () => {
    const install = '2026-06-26T08:00:00.000Z';
    const now = new Date(2026, 5, 26, 20, 0);
    expect(computeDaysSinceInstall(install, now)).toBe(0);
  });

  it('returns calendar day difference across days', () => {
    const install = new Date(2026, 5, 26, 8, 0).toISOString();
    const now = new Date(2026, 5, 28, 1, 0);
    expect(computeDaysSinceInstall(install, now)).toBe(2);
  });

  it('never returns negative values', () => {
    const install = '2026-06-28T00:00:00.000Z';
    const now = new Date(2026, 5, 26, 12, 0);
    expect(computeDaysSinceInstall(install, now)).toBe(0);
  });
});

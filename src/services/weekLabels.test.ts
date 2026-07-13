import { describe, it, expect } from 'vitest';
import { formatWeekLabel, getWeekOrdinalInMonth } from './weekLabels';
import { parseLocalDate } from './dates';

describe('weekLabels', () => {
  it('labels current and previous weeks', () => {
    expect(formatWeekLabel('2026-07-06', '2026-07-08')).toBe('This week');
    expect(formatWeekLabel('2026-06-29', '2026-07-08')).toBe('Last week');
  });

  it('labels older weeks as month ordinal', () => {
    expect(formatWeekLabel('2026-06-01', '2026-07-08')).toMatch(/^Jun wk \d+$/);
  });

  it('computes week ordinal within month', () => {
    const monday = parseLocalDate('2026-07-06');
    expect(getWeekOrdinalInMonth(monday)).toBeGreaterThanOrEqual(1);
  });
});

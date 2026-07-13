import { describe, it, expect } from 'vitest';
import { countDaysPracticed } from './daysPracticedCalculator';
import type { PracticeLogRow } from '../lib/supabase/types';

describe('countDaysPracticed', () => {
  it('counts distinct dates with at least one log', () => {
    const logs: PracticeLogRow[] = [
      {
        id: '1',
        device_id: 'dev',
        log_date: '2026-06-01',
        logged_at: '2026-06-01T10:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 10,
      },
      {
        id: '2',
        device_id: 'dev',
        log_date: '2026-06-01',
        logged_at: '2026-06-01T12:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 5,
      },
      {
        id: '3',
        device_id: 'dev',
        log_date: '2026-06-15',
        logged_at: '2026-06-15T10:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 20,
      },
    ];
    expect(countDaysPracticed(logs)).toBe(2);
  });
});

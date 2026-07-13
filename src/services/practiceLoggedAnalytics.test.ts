import { describe, it, expect } from 'vitest';
import { buildPracticeLoggedEvent } from './practiceLoggedAnalytics';
import type { LocalPracticeLog } from '../types/local';

function makeLog(overrides: Partial<LocalPracticeLog> = {}): LocalPracticeLog {
  return {
    id: '1',
    device_id: 'dev-1',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja', 'isha-kriya'],
    daily_count_at_time: 2,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
    ...overrides,
  };
}

describe('buildPracticeLoggedEvent', () => {
  it('includes daily practices logged subset and ring states', () => {
    const event = buildPracticeLoggedEvent(makeLog());
    expect(event.event_name).toBe('practice_logged');
    expect(event.properties).toEqual({
      log_date: '2026-06-26',
      practices_logged: ['guru-pooja'],
      daily_practices_logged: ['guru-pooja'],
      daily_count: 2,
      ring_state_before: 0,
      ring_state_after: 1,
      timestamp: '2026-06-26T10:00:00Z',
    });
  });

  it('excludes other-only practices from daily_practices_logged', () => {
    const event = buildPracticeLoggedEvent(
      makeLog({
        practices_logged: ['aum-chanting'],
        daily_practices_at_time: ['guru-pooja'],
        ring_state_before: 0,
        ring_state_after: 0,
      })
    );
    expect(event.properties?.daily_practices_logged).toEqual([]);
    expect(event.properties?.ring_state_after).toBe(0);
  });
});

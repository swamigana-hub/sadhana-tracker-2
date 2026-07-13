import { describe, it, expect } from 'vitest';
import { buildPracticeLogsCsv } from './adminExport';
import type { PracticeLogRow } from '../lib/supabase/types';

function makeLog(overrides: Partial<PracticeLogRow> = {}): PracticeLogRow {
  return {
    id: 'log-1',
    device_id: 'dev-aaa-bbb',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja'],
    daily_count_at_time: 1,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
    ...overrides,
  };
}

describe('buildPracticeLogsCsv', () => {
  it('includes headers and practice names', () => {
    const csv = buildPracticeLogsCsv([makeLog()]);
    const lines = csv.split('\n');
    expect(lines[0]).toContain('device_id');
    expect(lines[0]).toContain('practice_names');
    expect(lines[1]).toContain('dev-aaa-bbb');
    expect(lines[1]).toContain('Guru Pooja');
  });

  it('escapes commas in quoted fields', () => {
    const csv = buildPracticeLogsCsv([
      makeLog({
        practices_logged: ['guru-pooja', 'isha-kriya'],
      }),
    ]);
    expect(csv).toContain('Guru Pooja; Isha Kriya');
  });
});

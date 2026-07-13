import type { PracticeLogRow } from '../lib/supabase/types';
import { formatPracticeNames } from '../lib/supabase/adminQueries';

const CSV_HEADERS = [
  'id',
  'device_id',
  'log_date',
  'logged_at',
  'practices_logged',
  'practice_names',
  'daily_practices_at_time',
  'daily_count_at_time',
  'ring_state_before',
  'ring_state_after',
  'minutes_total',
] as const;

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowToCsv(log: PracticeLogRow): string {
  const fields = [
    log.id,
    log.device_id,
    log.log_date,
    log.logged_at,
    JSON.stringify(log.practices_logged),
    formatPracticeNames(log.practices_logged),
    JSON.stringify(log.daily_practices_at_time),
    String(log.daily_count_at_time),
    String(log.ring_state_before),
    String(log.ring_state_after),
    String(log.minutes_total ?? 0),
  ];
  return fields.map(escapeCsvField).join(',');
}

export function buildPracticeLogsCsv(logs: PracticeLogRow[]): string {
  const header = CSV_HEADERS.join(',');
  const rows = logs.map(rowToCsv);
  return [header, ...rows].join('\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

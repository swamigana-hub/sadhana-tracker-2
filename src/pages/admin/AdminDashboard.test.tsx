import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';
import type { PracticeLogRow } from '../../lib/supabase/types';

const downloadCsv = vi.fn();

vi.mock('../../services/adminExport', async () => {
  const actual = await vi.importActual<typeof import('../../services/adminExport')>(
    '../../services/adminExport'
  );
  return {
    ...actual,
    downloadCsv: (...args: unknown[]) => downloadCsv(...args),
  };
});

const logs: PracticeLogRow[] = [
  {
    id: 'log-1',
    device_id: 'device-aaa',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja'],
    daily_count_at_time: 1,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
  },
];

describe('AdminDashboard', () => {
  it('renders summary and tables with practice names', () => {
    render(
      <AdminDashboard
        summary={{
          totalParticipants: 1,
          totalLogSessions: 1,
          earliestLogDate: '2026-06-26',
          latestLogDate: '2026-06-26',
        }}
        participants={[
          {
            deviceIdPrefix: 'device-a',
            deviceId: 'device-aaa',
            setupDate: '2026-06-01T08:00:00Z',
            dailyCount: 1,
            otherCount: 0,
            daysLogged: 1,
            totalMinutes: 6,
            lastLogAt: '2026-06-26T10:00:00Z',
          },
        ]}
        logs={logs}
      />
    );

    expect(screen.getByRole('region', { name: 'Summary' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All logs' })).toBeInTheDocument();
    expect(screen.getByText('Guru Pooja')).toBeInTheDocument();
    expect(screen.getAllByText('device-a')).toHaveLength(2);
  });

  it('exports CSV when Export CSV is clicked', () => {
    render(
      <AdminDashboard
        summary={{
          totalParticipants: 1,
          totalLogSessions: 1,
          earliestLogDate: '2026-06-26',
          latestLogDate: '2026-06-26',
        }}
        participants={[]}
        logs={logs}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export CSV' }));
    expect(downloadCsv).toHaveBeenCalledOnce();
    expect(downloadCsv.mock.calls[0][0]).toMatch(/^sadhana-practice-logs-/);
  });
});

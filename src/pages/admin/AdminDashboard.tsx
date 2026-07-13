import type { AdminSummary, ParticipantRow } from '../../lib/supabase/adminQueries';
import { formatPracticeNames } from '../../lib/supabase/adminQueries';
import type { PracticeLogRow } from '../../lib/supabase/types';
import { Button } from '../../components/ui/Button';
import { buildPracticeLogsCsv, downloadCsv } from '../../services/adminExport';
import styles from './AdminDashboard.module.css';

export interface AdminDashboardProps {
  summary: AdminSummary;
  participants: ParticipantRow[];
  logs: PracticeLogRow[];
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return iso.slice(0, 10);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return iso.replace('T', ' ').slice(0, 16);
}

export function AdminDashboard({ summary, participants, logs }: AdminDashboardProps) {
  function handleExport() {
    const csv = buildPracticeLogsCsv(logs);
    downloadCsv(`sadhana-practice-logs-${formatDate(new Date().toISOString())}.csv`, csv);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sadhana Tracker — Admin</h1>
        <Button variant="secondary" className={styles.exportButton} onClick={handleExport}>
          Export CSV
        </Button>
      </header>

      <section className={styles.summary} aria-label="Summary">
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.totalParticipants}</span>
          <span className={styles.statLabel}>Participants</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.totalLogSessions}</span>
          <span className={styles.statLabel}>Log sessions</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {summary.earliestLogDate && summary.latestLogDate
              ? `${summary.earliestLogDate} – ${summary.latestLogDate}`
              : '—'}
          </span>
          <span className={styles.statLabel}>Date range</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Participants</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Device</th>
                <th>Setup</th>
                <th>Daily</th>
                <th>Other</th>
                <th>Days logged</th>
                <th>Minutes</th>
                <th>Last log</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((row) => (
                <tr key={row.deviceId}>
                  <td>{row.deviceIdPrefix}</td>
                  <td>{formatDate(row.setupDate)}</td>
                  <td>{row.dailyCount}</td>
                  <td>{row.otherCount}</td>
                  <td>{row.daysLogged}</td>
                  <td>{row.totalMinutes}</td>
                  <td>{formatDateTime(row.lastLogAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All logs</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Logged at</th>
                <th>Device</th>
                <th>Log date</th>
                <th>Practices</th>
                <th>Minutes</th>
                <th>Ring</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDateTime(log.logged_at)}</td>
                  <td>{log.device_id.slice(0, 8)}</td>
                  <td>{log.log_date}</td>
                  <td>{formatPracticeNames(log.practices_logged)}</td>
                  <td>{log.minutes_total ?? 0}</td>
                  <td>
                    {log.ring_state_before} → {log.ring_state_after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

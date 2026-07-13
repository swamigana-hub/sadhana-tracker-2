import { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import {
  computeAdminSummary,
  computeParticipantRows,
  fetchAllDeviceSessions,
  fetchAllPracticeLogs,
} from '../../lib/supabase/adminQueries';
import type { DeviceSessionRow, PracticeLogRow } from '../../lib/supabase/types';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
} from '../../services/adminAuth';
import { AdminGate } from './AdminGate';
import { AdminDashboard } from './AdminDashboard';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [logs, setLogs] = useState<PracticeLogRow[]>([]);
  const [sessions, setSessions] = useState<DeviceSessionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = tryGetSupabase();

  useEffect(() => {
    if (!authenticated || !client) return;

    setLoading(true);
    setError(null);

    void Promise.all([fetchAllPracticeLogs(client), fetchAllDeviceSessions(client)])
      .then(([fetchedLogs, fetchedSessions]) => {
        setLogs(fetchedLogs);
        setSessions(fetchedSessions);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load admin data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authenticated, client]);

  function handleAuthenticated() {
    setAdminAuthenticated(true);
    setAuthenticated(true);
  }

  if (!authenticated) {
    return <AdminGate onAuthenticated={handleAuthenticated} />;
  }

  if (!client) {
    return (
      <div className={styles.message}>
        <p>Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.message}>
        <p role="status">Loading participant data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.message}>
        <p role="alert">{error}</p>
      </div>
    );
  }

  return (
    <AdminDashboard
      summary={computeAdminSummary(logs)}
      participants={computeParticipantRows(logs, sessions)}
      logs={logs}
    />
  );
}

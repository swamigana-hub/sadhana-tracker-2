import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { getActiveSession } from '../services/sessionStore';
import { useAppData } from '../context/AppDataContext';
import { useCompletionWriter } from '../hooks/useCompletionWriter';
import { tryGetSupabase } from '../lib/supabase/client';
import { clearActiveSession } from '../services/sessionStore';
import styles from './PracticePlayerPage.module.css';

export default function PracticePlayerPage() {
  const navigate = useNavigate();
  const session = getActiveSession();
  const { deviceId, today, setLogs } = useAppData();
  const { completeSession } = useCompletionWriter({
    deviceId,
    client: tryGetSupabase(),
    onLogsChanged: setLogs,
  });

  if (!session || session.practiceIds.length === 0) {
    navigate('/session', { replace: true });
    return null;
  }

  const complete = () => {
    completeSession(session.practiceIds, today);
    clearActiveSession();
    navigate('/success', {
      state: {
        practiceIds: session.practiceIds,
        mode: 'session',
      },
    });
  };

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.content}>
          <h1 className={styles.headline}>You can practice on your own</h1>
          <p className={styles.subline}>No guided audios available in this test build</p>
        </div>
        <div className={styles.footer}>
          <Button onClick={complete}>Complete Session</Button>
        </div>
      </div>
    </AppShell>
  );
}

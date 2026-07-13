import { useEffect, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PracticeDisplayRow } from '../../components/practice/PracticeDisplayRow';
import { getPracticeById, sortByCanonicalOrder } from '../../data/practices';
import styles from './DailySavedPage.module.css';

interface LocationState {
  daily: string[];
}

export default function DailySavedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const daily = (location.state as LocationState | null)?.daily;

  const sortedDaily = useMemo(
    () => (daily?.length ? sortByCanonicalOrder(daily) : []),
    [daily]
  );

  useEffect(() => {
    if (!daily?.length) return;

    const timer = window.setTimeout(() => {
      navigate('/setup/other', { replace: true, state: { daily } });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [daily, navigate]);

  if (!daily?.length) {
    return <Navigate to="/setup/daily" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.checkmark} aria-hidden>
          ✓
        </div>
        <p className={styles.message}>Daily practices saved.</p>
        <ul className={styles.practiceList}>
          {sortedDaily.map((id) => {
            const practice = getPracticeById(id);
            if (!practice) return null;
            return (
              <li key={id}>
                <PracticeDisplayRow practiceId={id} name={practice.name} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

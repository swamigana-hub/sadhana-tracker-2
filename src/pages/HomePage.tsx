import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { PrimarySecondaryCtas } from '../components/ui/PrimarySecondaryCtas';
import { getQuoteForDate } from '../data/dailyQuotes';
import { useAppData } from '../context/AppDataContext';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { today } = useAppData();
  const quote = useMemo(() => getQuoteForDate(today), [today]);

  return (
    <AppShell>
      <div className={styles.page}>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <PrimarySecondaryCtas
          sticky
          primary={<Button onClick={() => navigate('/session')}>Start Practice</Button>}
          secondary={
            <Button variant="secondary" onClick={() => navigate('/log')}>
              Log Practice
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
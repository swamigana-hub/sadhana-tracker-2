import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { HomeProgressCard } from '../components/home/HomeProgressCard';
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
        <div className={styles.quoteBlock}>
          <p className={styles.quoteMark} aria-hidden>
            "
          </p>
          <blockquote className={styles.quote}>{quote}</blockquote>
        </div>

        <div className={styles.ctaSection}>
          <Button onClick={() => navigate('/session')}>Start Practice</Button>
          <div className={styles.ctaDivider} aria-hidden />
          <Button variant="secondary" onClick={() => navigate('/log')}>
            Log Practice
          </Button>
        </div>

        <HomeProgressCard />
      </div>
    </AppShell>
  );
}

import { ProgressRing } from '../ring/ProgressRing';
import { useAppData } from '../../context/AppDataContext';
import styles from './TodayProgress.module.css';

export function TodayProgress({
  celebrate = false,
  centerLabel = false,
}: {
  celebrate?: boolean;
  centerLabel?: boolean;
}) {
  const { ring, todayMinutes } = useAppData();

  return (
    <section className={styles.section} aria-label="Today">
      <h2 className={`${styles.label} ${centerLabel ? styles.labelCenter : ''}`}>Today</h2>
      <ProgressRing
        numerator={ring.numerator}
        denominator={ring.denominator}
        minutesFillRatio={ring.minutesFillRatio}
        minutesToday={todayMinutes}
        celebrate={celebrate}
      />
    </section>
  );
}

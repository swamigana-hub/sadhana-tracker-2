import { ProgressRing } from '../ring/ProgressRing';
import { useAppData } from '../../context/AppDataContext';
import { computeStreaks } from '../../services/streakCalculator';
import styles from './HomeProgressCard.module.css';

export function HomeProgressCard() {
  const { ring, todayMinutes, daysPracticed, logs, today } = useAppData();
  const { current: streak } = computeStreaks(logs, today);

  return (
    <section className={styles.card} aria-label="My practices">
      <h2 className={styles.title}>My practices</h2>
      <div className={styles.body}>
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span aria-hidden>🔥</span>
            <span>
              <span className={styles.statValue}>{streak}</span> day streak
            </span>
          </div>
          <div className={styles.statRow}>
            <span aria-hidden>☀</span>
            <span>
              <span className={styles.statValue}>{daysPracticed}</span> days total
            </span>
          </div>
        </div>
        <div className={styles.ringWrap}>
          <ProgressRing
            numerator={ring.numerator}
            denominator={ring.denominator}
            minutesFillRatio={ring.minutesFillRatio}
            minutesToday={todayMinutes}
          />
        </div>
      </div>
    </section>
  );
}

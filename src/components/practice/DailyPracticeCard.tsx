import { useRef, useState, useCallback, type PointerEvent } from 'react';
import { PracticeIllustration } from './PracticeIllustration';
import styles from './DailyPracticeCard.module.css';

const LONG_PRESS_MS = 500;

export interface DailyPracticeCardProps {
  practiceId: string;
  name: string;
  completedToday: boolean;
  onLog: () => void;
  onLongPress: (position: { x: number; y: number }) => void;
  pressed?: boolean;
}

export function DailyPracticeCard({
  practiceId,
  name,
  completedToday,
  onLog,
  onLongPress,
  pressed = false,
}: DailyPracticeCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    setHolding(true);
    timerRef.current = setTimeout(() => {
      onLongPress({ x: e.clientX, y: e.clientY });
      clearTimer();
    }, LONG_PRESS_MS);
  };

  return (
    <article
      className={`${styles.card} ${completedToday ? styles.completed : ''} ${pressed || holding ? styles.pressed : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
    >
      <PracticeIllustration practiceId={practiceId} name={name} size="card" />
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {completedToday && <span className={styles.completedLabel}>Logged today</span>}
      </div>
      <button
        type="button"
        className={styles.logButton}
        onClick={(e) => {
          e.stopPropagation();
          onLog();
        }}
        aria-label={`Log ${name}`}
      >
        Log
      </button>
    </article>
  );
}

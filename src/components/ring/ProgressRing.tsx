import { useEffect, useRef, useState } from 'react';
import styles from './ProgressRing.module.css';

const SIZE = 172;
const STROKE = 12;

export interface ProgressRingProps {
  numerator: number;
  denominator: number;
  minutesFillRatio: number;
  minutesToday: number;
  celebrate?: boolean;
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={styles.statIcon}>
      <path
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="3"
        width="6"
        height="4"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 14l2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={styles.statIcon}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProgressRing({
  numerator,
  denominator,
  minutesFillRatio,
  minutesToday,
  celebrate = false,
}: ProgressRingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [shownFillRatio, setShownFillRatio] = useState(minutesFillRatio);

  const targetRatio = Math.min(Math.max(minutesFillRatio, 0), 1);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      setShownFillRatio(targetRatio);
    }
  }, [inView, targetRatio]);

  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - shownFillRatio);
  const percentComplete = Math.round(shownFillRatio * 100);

  const label =
    denominator === 0
      ? 'No daily practices set'
      : `${percentComplete}% complete, ${numerator} of ${denominator} daily practices logged, ${minutesToday} minutes today`;

  return (
    <div
      ref={rootRef}
      className={`${styles.layout} ${celebrate ? styles.celebrate : ''}`}
    >
      <div className={styles.statSide}>
        <ClipboardIcon />
        <div className={styles.statValue}>
          {numerator}/{denominator}
        </div>
        <div className={styles.statLabel}>practices</div>
      </div>

      <div className={styles.wrap}>
        <svg
          className={styles.svg}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={label}
        >
          <defs>
            <linearGradient id="ringFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-ring-gradient-start)" />
              <stop offset="100%" stopColor="var(--color-ring-gradient-end)" />
            </linearGradient>
          </defs>
          <circle
            className={styles.track}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={radius}
            fill="none"
            strokeWidth={STROKE}
          />
          <circle
            className={styles.fill}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={radius}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className={styles.center}>
          <div className={styles.percent}>{percentComplete}</div>
          <div className={styles.percentLabel}>% complete</div>
        </div>
      </div>

      <div className={styles.statSide}>
        <ClockIcon />
        <div className={styles.statValue}>{minutesToday}</div>
        <div className={styles.statLabel}>minutes</div>
      </div>
    </div>
  );
}

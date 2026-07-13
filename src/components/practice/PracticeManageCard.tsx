import { useRef, useState, useCallback, type PointerEvent } from 'react';
import { PracticeIllustration } from './PracticeIllustration';
import type { PlacementTagLabel } from '../../services/practicePlacementTags';
import styles from './PracticeManageCard.module.css';

const LONG_PRESS_MS = 500;

export interface PracticeManageCardProps {
  practiceId: string;
  name: string;
  onLongPress: (position: { x: number; y: number }) => void;
  pressed?: boolean;
  compact?: boolean;
  placementTag?: PlacementTagLabel | null;
}

export function PracticeManageCard({
  practiceId,
  name,
  onLongPress,
  pressed = false,
  compact = false,
  placementTag = null,
}: PracticeManageCardProps) {
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
      className={`${styles.card} ${compact ? styles.compact : ''} ${pressed || holding ? styles.pressed : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
    >
      <PracticeIllustration practiceId={practiceId} name={name} size="card" />
      <div className={styles.textBlock}>
        <h3 className={styles.name}>{name}</h3>
        {placementTag && <span className={styles.tag}>{placementTag}</span>}
      </div>
    </article>
  );
}

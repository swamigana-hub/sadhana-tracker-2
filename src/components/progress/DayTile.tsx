import type { DayTileVisual } from '../../services/dayTileState';
import styles from './DayTile.module.css';

export interface DayTileProps {
  state: DayTileVisual;
  label?: string;
}

export function DayTile({ state, label }: DayTileProps) {
  const glow = state === 'p100plus';

  return (
    <div
      className={`${styles.tile} ${styles[state]} ${glow ? styles.glow : ''}`}
      title={label}
      aria-label={label}
    >
      {state === 'missed' && <span className={styles.missedMark} aria-hidden>×</span>}
    </div>
  );
}

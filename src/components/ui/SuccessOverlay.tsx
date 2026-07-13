import styles from './SuccessOverlay.module.css';

export interface SuccessOverlayProps {
  visible: boolean;
}

export function SuccessOverlay({ visible }: SuccessOverlayProps) {
  if (!visible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.check} aria-hidden>
          ✓
        </span>
        <span>Logged</span>
      </div>
    </div>
  );
}

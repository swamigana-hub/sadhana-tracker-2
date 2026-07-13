import type { ReactNode } from 'react';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
  open: boolean;
  title?: string;
  stepLabel?: string;
  onBack?: () => void;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({
  open,
  title,
  stepLabel,
  onBack,
  onClose,
  children,
  footer,
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.overlay}
        aria-label="Close sheet"
        onClick={onClose}
      />
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} aria-hidden />
        {(title || stepLabel) && (
          <div className={styles.header}>
            {onBack && (
              <button type="button" className={styles.backBtn} onClick={onBack}>
                Back
              </button>
            )}
            <h2 className={styles.title}>
              {stepLabel ?? title}
            </h2>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { isPracticeListTooltipDismissed } from '../../services/localStore';
import styles from './FirstUseTooltip.module.css';

const AUTO_DISMISS_MS = 3000;

export interface FirstUseTooltipProps {
  onDismiss: () => void;
}

export function FirstUseTooltip({ onDismiss }: FirstUseTooltipProps) {
  const dismissed = isPracticeListTooltipDismissed();

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [dismissed, onDismiss]);

  if (dismissed) return null;

  return (
    <p className={styles.tooltip} role="status">
      Hold any practice to manage it.
    </p>
  );
}

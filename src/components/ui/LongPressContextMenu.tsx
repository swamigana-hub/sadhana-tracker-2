import { useEffect, useRef } from 'react';
import styles from './LongPressContextMenu.module.css';

export interface ContextMenuOption {
  label: string;
  onClick: () => void;
}

export interface LongPressContextMenuProps {
  open: boolean;
  x: number;
  y: number;
  options: ContextMenuOption[];
  onDismiss: () => void;
}

const DISMISS_GUARD_MS = 400;

export function LongPressContextMenu({
  open,
  options,
  onDismiss,
}: LongPressContextMenuProps) {
  const openedAtRef = useRef(0);

  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
    }
  }, [open]);

  if (!open) return null;

  const visible = options.slice(0, 2);

  const tryDismiss = () => {
    if (Date.now() - openedAtRef.current < DISMISS_GUARD_MS) return;
    onDismiss();
  };

  return (
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        data-testid="menu-backdrop"
        aria-label="Dismiss menu"
        onClick={tryDismiss}
      />
      <div className={styles.sheet} role="menu" aria-label="Practice actions">
        {visible.map((opt) => (
          <button
            key={opt.label}
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              opt.onClick();
              onDismiss();
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

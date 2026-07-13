import type { ReactNode } from 'react';
import styles from './PrimarySecondaryCtas.module.css';

/** Primary CTA on top, secondary below (inverse of DND modal reference). */
export function PrimarySecondaryCtas({
  primary,
  secondary,
  sticky = false,
}: {
  primary: ReactNode;
  secondary: ReactNode;
  sticky?: boolean;
}) {
  return (
    <div className={sticky ? styles.footer : styles.stack}>
      {primary}
      {secondary}
    </div>
  );
}

import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import styles from './AppShell.module.css';

export function AppShell({
  children,
  showBottomNav = true,
}: {
  children: ReactNode;
  showBottomNav?: boolean;
}) {
  return (
    <div className={styles.shell}>
      <main className={`${styles.main} ${showBottomNav ? '' : styles.mainNoNav}`}>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

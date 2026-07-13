import { useState } from 'react';
import { shouldShowIosInstallBanner } from '../../services/iosInstall';
import { setIosInstallBannerDismissed } from '../../services/localStore';
import styles from './IosInstallBanner.module.css';

export function IosInstallBanner() {
  const [visible, setVisible] = useState(() => shouldShowIosInstallBanner());

  if (!visible) return null;

  function dismiss(): void {
    setIosInstallBannerDismissed(true);
    setVisible(false);
  }

  return (
    <aside className={styles.banner} role="region" aria-label="Install app">
      <p className={styles.message}>
        Install Sadhana Tracker: tap <strong>Share</strong>, then{' '}
        <strong>Add to Home Screen</strong>.
      </p>
      <button type="button" className={styles.dismiss} onClick={dismiss}>
        Got it
      </button>
    </aside>
  );
}

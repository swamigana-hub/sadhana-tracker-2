import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './SetupStepLayout.module.css';

export interface SetupStepLayoutProps {
  step: 1 | 2;
  icon?: ReactNode;
  heading: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
  scrollToTopOnMount?: boolean;
}

export function SetupStepLayout({
  step,
  icon,
  heading,
  children,
  footer,
  onBack,
  scrollToTopOnMount = false,
}: SetupStepLayoutProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollToTopOnMount) return;
    bodyRef.current?.scrollTo?.(0, 0);
  }, [scrollToTopOnMount]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {onBack && (
          <button
            type="button"
            className={styles.back}
            onClick={onBack}
            aria-label="Back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <div className={styles.stepBlock}>
          <p className={styles.stepLabel}>Step {step}/2</p>
          <div className={styles.stepper} aria-label={`Step ${step} of 2`}>
            <span className={`${styles.stepSegment} ${styles.stepSegmentFilled}`} />
            <span
              className={`${styles.stepSegment} ${step >= 2 ? styles.stepSegmentFilled : ''}`}
            />
          </div>
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h1 className={styles.heading}>{heading}</h1>
      </header>
      <div ref={bodyRef} className={styles.body} data-testid="setup-scroll-body">
        {children}
      </div>
      <footer className={styles.footer} data-testid="setup-footer">
        {footer}
      </footer>
    </div>
  );
}

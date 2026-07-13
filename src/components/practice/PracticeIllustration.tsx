import { useState } from 'react';
import { getIllustrationPath } from '../../data/illustrationMap';
import styles from './PracticeIllustration.module.css';

export type IllustrationSize = 'list' | 'card' | 'cluster';

export interface PracticeIllustrationProps {
  practiceId: string;
  name: string;
  size?: IllustrationSize;
  className?: string;
}

const sizeClass: Record<IllustrationSize, string> = {
  list: styles.list,
  card: styles.card,
  cluster: styles.cluster,
};

type LoadState = 'loading' | 'loaded' | 'failed';

export function PracticeIllustration({
  practiceId,
  name,
  size = 'list',
  className,
}: PracticeIllustrationProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const frameClasses = [styles.frame, sizeClass[size], className ?? '']
    .filter(Boolean)
    .join(' ');

  if (loadState === 'failed') {
    return (
      <div
        className={frameClasses}
        data-testid="illustration-placeholder"
        role="img"
        aria-label={name}
      >
        <div className={styles.placeholder} />
      </div>
    );
  }

  return (
    <div className={frameClasses} role="img" aria-label={name}>
      {loadState === 'loading' && (
        <div className={styles.placeholder} data-testid="illustration-placeholder" aria-hidden />
      )}
      <img
        className={styles.image}
        src={getIllustrationPath(practiceId)}
        alt=""
        aria-hidden
        onLoad={() => setLoadState('loaded')}
        onError={() => setLoadState('failed')}
      />
    </div>
  );
}

import { PracticeIllustration } from './PracticeIllustration';
import styles from './SetupHeroCluster.module.css';

const DAILY_HERO_IDS = ['shambhavi-mahamudra-kriya', 'yogasanas', 'breath-watching'] as const;
const OTHER_HERO_IDS = ['isha-kriya', 'aum-chanting', 'shoonya'] as const;

export interface SetupHeroClusterProps {
  variant: 'daily' | 'other';
}

export function SetupHeroCluster({ variant }: SetupHeroClusterProps) {
  const ids = variant === 'daily' ? DAILY_HERO_IDS : OTHER_HERO_IDS;

  return (
    <div className={styles.cluster} aria-hidden>
      {ids.map((id) => (
        <PracticeIllustration key={id} practiceId={id} name="" size="card" />
      ))}
    </div>
  );
}

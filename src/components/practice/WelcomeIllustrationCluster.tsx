import { WELCOME_CLUSTER_CENTER_ID, WELCOME_RING_IDS } from '../../data/illustrationMap';
import { getPracticeById } from '../../data/practices';
import { PracticeIllustration } from './PracticeIllustration';
import styles from './WelcomeIllustrationCluster.module.css';

const RING_RADIUS_PERCENT = 38;

function ringPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${50 + RING_RADIUS_PERCENT * Math.cos(angle)}%`,
    top: `${50 + RING_RADIUS_PERCENT * Math.sin(angle)}%`,
  };
}

export function WelcomeIllustrationCluster() {
  const center = getPracticeById(WELCOME_CLUSTER_CENTER_ID);

  return (
    <div className={styles.cluster} aria-hidden>
      {center && (
        <div className={styles.center}>
          <PracticeIllustration
            practiceId={WELCOME_CLUSTER_CENTER_ID}
            name={center.name}
            size="cluster"
          />
        </div>
      )}
      {WELCOME_RING_IDS.map((id, index) => {
        const practice = getPracticeById(id);
        if (!practice) return null;
        const pos = ringPosition(index, WELCOME_RING_IDS.length);
        return (
          <div
            key={id}
            className={styles.ringItem}
            style={{ left: pos.left, top: pos.top }}
          >
            <PracticeIllustration practiceId={id} name={practice.name} size="cluster" />
          </div>
        );
      })}
    </div>
  );
}

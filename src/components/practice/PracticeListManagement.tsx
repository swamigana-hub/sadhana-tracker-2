import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPracticeById } from '../../data/practices';
import type { PracticePlacement } from '../../services/practiceInstances';
import { sortPlacements } from '../../services/practiceInstances';
import { PracticeTrackCard } from './PracticeTrackCard';
import styles from './PracticeListManagement.module.css';

export interface PracticeListManagementProps {
  dailyPlacements: PracticePlacement[];
  otherPlacements: PracticePlacement[];
  isPlacementLogged: (instanceId: string) => boolean;
  canLogPlacement: (instanceId: string) => boolean;
  onLogPlacement: (instanceId: string, practiceId: string) => void;
}

export function PracticeListManagement({
  dailyPlacements,
  otherPlacements,
  isPlacementLogged,
  canLogPlacement,
  onLogPlacement,
}: PracticeListManagementProps) {
  const sortedDaily = sortPlacements(dailyPlacements);
  const sortedOther = sortPlacements(otherPlacements);

  const renderList = useCallback(
    (placements: PracticePlacement[]) =>
      placements.map((placement) => {
        const practice = getPracticeById(placement.practiceId);
        if (!practice) return null;
        const checked = isPlacementLogged(placement.instanceId);
        return (
          <PracticeTrackCard
            key={placement.instanceId}
            practiceId={placement.practiceId}
            name={practice.name}
            checked={checked}
            locked={checked || !canLogPlacement(placement.instanceId)}
            onCheck={() => onLogPlacement(placement.instanceId, placement.practiceId)}
          />
        );
      }),
    [canLogPlacement, isPlacementLogged, onLogPlacement]
  );

  if (sortedDaily.length === 0 && sortedOther.length === 0) return null;

  return (
    <div className={styles.root}>
      {sortedDaily.length > 0 && (
        <section className={styles.section} aria-label="My daily practices">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My daily practices</h2>
            <Link to="/practices/edit" className={styles.editLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3L16.5 4.4a2.1 2.1 0 0 0-3 0L3 15v5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </Link>
          </div>
          <div className={styles.cardList}>{renderList(sortedDaily)}</div>
        </section>
      )}

      {sortedOther.length > 0 && (
        <section className={styles.section} aria-label="My other practices">
          <h2 className={styles.sectionTitle}>My other practices</h2>
          <div className={styles.cardList}>{renderList(sortedOther)}</div>
        </section>
      )}
    </div>
  );
}

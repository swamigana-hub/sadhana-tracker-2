import { useState } from 'react';
import {
  getPracticeById,
  getSetupPopularPractices,
  getSetupStep2OtherPractices,
  sortByCanonicalOrder,
} from '../../data/practices';
import { PracticeRow } from './PracticeRow';
import { PracticeDisplayRow } from './PracticeDisplayRow';
import styles from './OtherPracticesSelectionList.module.css';

export interface OtherPracticesSelectionListProps {
  dailyIds: string[];
  selectedIds: Set<string>;
  onToggle: (practiceId: string) => void;
}

export function OtherPracticesSelectionList({
  dailyIds,
  selectedIds,
  onToggle,
}: OtherPracticesSelectionListProps) {
  const dailySet = new Set(dailyIds);
  const [dailyExpanded, setDailyExpanded] = useState(false);

  const sortedDaily = sortByCanonicalOrder(dailyIds);

  const popularSelectable = getSetupPopularPractices().filter((p) => !dailySet.has(p.id));

  const otherPractices = getSetupStep2OtherPractices(dailySet);

  return (
    <div className={styles.list}>
      {sortedDaily.length > 0 && (
        <section>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => setDailyExpanded((v) => !v)}
            aria-expanded={dailyExpanded}
          >
            <span className={styles.sectionTitle}>Daily</span>
            <span className={styles.sectionCount}>{sortedDaily.length}</span>
            <span className={styles.chevron} data-expanded={dailyExpanded}>
              ›
            </span>
          </button>
          {dailyExpanded &&
            sortedDaily.map((id) => {
              const practice = getPracticeById(id);
              if (!practice) return null;
              return (
                <PracticeDisplayRow key={id} practiceId={id} name={practice.name} />
              );
            })}
        </section>
      )}

      {popularSelectable.length > 0 && (
        <section>
          <h2 className={styles.sectionTitleStatic}>Commonly Practiced</h2>
          {popularSelectable.map((practice) => (
            <PracticeRow
              key={practice.id}
              practiceId={practice.id}
              name={practice.name}
              selected={selectedIds.has(practice.id)}
              onToggle={() => onToggle(practice.id)}
            />
          ))}
        </section>
      )}

      {otherPractices.length > 0 && (
        <section>
          <h2 className={styles.sectionTitleStatic}>All Practices (A to Z)</h2>
          {otherPractices.map((practice) => (
            <PracticeRow
              key={practice.id}
              practiceId={practice.id}
              name={practice.name}
              selected={selectedIds.has(practice.id)}
              onToggle={() => onToggle(practice.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

import { getSetupPopularPractices, getSetupStep1OtherPractices } from '../../data/practices';
import { PracticeRow } from './PracticeRow';
import styles from './PracticeSelectionList.module.css';

export interface PracticeSelectionListProps {
  selectedIds: Set<string>;
  onToggle: (practiceId: string) => void;
  excludeIds?: Set<string>;
}

export function PracticeSelectionList({
  selectedIds,
  onToggle,
  excludeIds,
}: PracticeSelectionListProps) {
  const popular = getSetupPopularPractices().filter((p) => !excludeIds?.has(p.id));
  const other = getSetupStep1OtherPractices().filter((p) => !excludeIds?.has(p.id));

  const renderSection = (title: string, practices: typeof popular) => (
    <section key={title}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {practices.map((practice) => (
        <PracticeRow
          key={practice.id}
          practiceId={practice.id}
          name={practice.name}
          selected={selectedIds.has(practice.id)}
          onToggle={() => onToggle(practice.id)}
        />
      ))}
    </section>
  );

  return (
    <div className={styles.list}>
      {renderSection('Commonly Practiced', popular)}
      {renderSection('All Practices (A to Z)', other)}
    </div>
  );
}

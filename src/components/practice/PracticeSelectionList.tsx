import type { Practice } from '../../data/practices';
import { getSetupPopularPractices, getSetupStep1OtherPractices } from '../../data/practices';
import { PracticeRow } from './PracticeRow';
import styles from './PracticeSelectionList.module.css';

export interface PracticeSelectionListProps {
  selectedIds: Set<string>;
  onToggle: (practiceId: string) => void;
  excludeIds?: Set<string>;
  searchQuery?: string;
}

function matchesSearch(practice: Practice, query: string): boolean {
  if (!query.trim()) return true;
  return practice.name.toLowerCase().includes(query.trim().toLowerCase());
}

export function PracticeSelectionList({
  selectedIds,
  onToggle,
  excludeIds,
  searchQuery = '',
}: PracticeSelectionListProps) {
  const popular = getSetupPopularPractices()
    .filter((p) => !excludeIds?.has(p.id))
    .filter((p) => matchesSearch(p, searchQuery));
  const other = getSetupStep1OtherPractices()
    .filter((p) => !excludeIds?.has(p.id))
    .filter((p) => matchesSearch(p, searchQuery));

  const renderSection = (title: string, practices: Practice[]) => {
    if (practices.length === 0) return null;
    return (
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
  };

  const hasResults = popular.length > 0 || other.length > 0;

  return (
    <div className={styles.list}>
      {!hasResults && searchQuery.trim() && (
        <p className={styles.noResults}>No practices match your search.</p>
      )}
      {renderSection('Commonly Practiced', popular)}
      {renderSection('All Practices (A to Z)', other)}
    </div>
  );
}

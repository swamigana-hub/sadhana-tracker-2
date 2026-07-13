import { getPracticeById } from '../../data/practices';
import { PracticeRow } from '../practice/PracticeRow';
import { Button } from './Button';
import styles from './SelectionSheet.module.css';

export interface SelectionSection {
  title: string;
  practiceIds: string[];
}

export interface SelectionSheetProps {
  open: boolean;
  sections: SelectionSection[];
  selectedIds: Set<string>;
  onToggle: (practiceId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function SelectionSheet({
  open,
  sections,
  selectedIds,
  onToggle,
  onConfirm,
  onClose,
}: SelectionSheetProps) {
  if (!open) return null;

  const count = selectedIds.size;

  return (
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.overlay}
        data-testid="sheet-overlay"
        aria-label="Close selection"
        onClick={onClose}
      />
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} aria-hidden />
        <div className={styles.scroll}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.practiceIds.map((id) => {
                const practice = getPracticeById(id);
                if (!practice) return null;
                return (
                  <PracticeRow
                    key={id}
                    practiceId={id}
                    name={practice.name}
                    selected={selectedIds.has(id)}
                    onToggle={() => onToggle(id)}
                  />
                );
              })}
            </section>
          ))}
        </div>
        <div className={styles.footer}>
          <Button onClick={onConfirm} disabled={count === 0}>
            Confirm ({count})
          </Button>
        </div>
      </div>
    </div>
  );
}

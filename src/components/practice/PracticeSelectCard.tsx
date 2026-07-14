import { PracticeIllustration } from './PracticeIllustration';
import styles from './PracticeSelectCard.module.css';

export interface PracticeSelectCardProps {
  practiceId: string;
  name: string;
  selected: boolean;
  onToggle: () => void;
}

export function PracticeSelectCard({ practiceId, name, selected, onToggle }: PracticeSelectCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      <PracticeIllustration practiceId={practiceId} name={name} size="list" />
      <span className={styles.name}>{name}</span>
    </button>
  );
}

import { Checkbox } from '../ui/Checkbox';
import { PracticeIllustration } from './PracticeIllustration';
import styles from './PracticeRow.module.css';

export interface PracticeRowProps {
  practiceId: string;
  name: string;
  selected: boolean;
  onToggle: () => void;
}

export function PracticeRow({ practiceId, name, selected, onToggle }: PracticeRowProps) {
  return (
    <button
      type="button"
      className={`${styles.row} ${selected ? styles.selected : ''}`}
      onClick={onToggle}
    >
      <PracticeIllustration practiceId={practiceId} name={name} size="list" />
      <span className={styles.name}>{name}</span>
      <Checkbox checked={selected} onChange={onToggle} label={name} />
    </button>
  );
}

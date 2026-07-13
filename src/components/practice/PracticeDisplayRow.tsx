import { PracticeIllustration } from './PracticeIllustration';
import styles from './PracticeDisplayRow.module.css';

export interface PracticeDisplayRowProps {
  practiceId: string;
  name: string;
}

export function PracticeDisplayRow({ practiceId, name }: PracticeDisplayRowProps) {
  return (
    <div className={styles.row}>
      <PracticeIllustration practiceId={practiceId} name={name} size="list" />
      <span className={styles.name}>{name}</span>
    </div>
  );
}

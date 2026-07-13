import styles from './PracticeTrackCard.module.css';
import { Checkbox } from '../ui/Checkbox';
import { PracticeIllustration } from './PracticeIllustration';

export interface PracticeTrackCardProps {
  practiceId: string;
  name: string;
  checked: boolean;
  locked?: boolean;
  onCheck: () => void;
}

export function PracticeTrackCard({
  practiceId,
  name,
  checked,
  locked = false,
  onCheck,
}: PracticeTrackCardProps) {
  return (
    <div className={styles.row}>
      <Checkbox
        checked={checked}
        onChange={() => {
          if (!locked) onCheck();
        }}
        label={name}
        locked={locked}
      />
      <PracticeIllustration practiceId={practiceId} name={name} size="list" />
      <span className={styles.name}>{name}</span>
    </div>
  );
}

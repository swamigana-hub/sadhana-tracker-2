import styles from './StatBox.module.css';

export interface StatBoxProps {
  label: string;
  value: number;
}

export function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className={styles.box}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

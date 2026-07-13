import styles from './YearDivider.module.css';

export interface YearDividerProps {
  year: number;
}

export function YearDivider({ year }: YearDividerProps) {
  return <h3 className={styles.divider}>{year}</h3>;
}

import styles from './PracticeSearchInput.module.css';

export function PracticeSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="search"
      className={styles.search}
      placeholder="Search practices"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search practices"
    />
  );
}

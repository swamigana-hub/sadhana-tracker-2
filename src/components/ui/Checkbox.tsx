import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  locked?: boolean;
  id?: string;
}

export function Checkbox({ checked, onChange, label, locked = false, id }: CheckboxProps) {
  const inputId = id ?? (label ? `checkbox-${label}` : undefined);

  return (
    <label
      className={`${styles.wrapper} ${locked ? styles.locked : ''}`}
      htmlFor={inputId}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        id={inputId}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={locked}
        onChange={(e) => {
          if (locked) return;
          onChange(e.target.checked);
        }}
        aria-label={label}
      />
      <span className={styles.box} aria-hidden />
    </label>
  );
}

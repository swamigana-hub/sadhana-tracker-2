import { useNavigate } from 'react-router-dom';
import styles from './ScreenHeader.module.css';

export function ScreenHeader({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <header className={styles.pageHeader}>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/')} aria-label="Back to Home">
        ←
      </button>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.spacer} aria-hidden />
    </header>
  );
}

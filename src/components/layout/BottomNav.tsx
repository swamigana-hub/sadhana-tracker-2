import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNav.module.css';

function isHomeActive(pathname: string): boolean {
  return !pathname.startsWith('/yoga');
}

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const homeActive = isHomeActive(location.pathname);
  const yogaActive = location.pathname.startsWith('/yoga');

  return (
    <nav className={styles.bottomNav} aria-label="Main navigation">
      <button
        type="button"
        className={`${styles.tab} ${homeActive ? styles.tabActive : ''}`}
        onClick={() => navigate('/')}
        aria-current={homeActive ? 'page' : undefined}
      >
        <span className={styles.icon} aria-hidden>
          ⌂
        </span>
        Home
      </button>
      <button
        type="button"
        className={`${styles.tab} ${yogaActive ? styles.tabActive : ''}`}
        onClick={() => navigate('/yoga/my')}
        aria-current={yogaActive ? 'page' : undefined}
      >        <span className={styles.icon} aria-hidden>
          ◉
        </span>
        Yoga
      </button>
    </nav>
  );
}

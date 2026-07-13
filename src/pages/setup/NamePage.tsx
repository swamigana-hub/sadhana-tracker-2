import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { persistDisplayName } from '../../services/setupFlow';
import { getDisplayName } from '../../services/localStore';
import { getWelcomeSeen, setNameCaptured } from '../../services/setupProgress';
import styles from './NamePage.module.css';

export default function NamePage() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => getDisplayName());

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed) {
      persistDisplayName(trimmed);
    }
  }, [name]);

  if (!getWelcomeSeen()) {
    return <Navigate to="/setup" replace />;
  }

  const trimmed = name.trim();
  const canContinue = trimmed.length > 0;

  const continueToDaily = () => {
    if (!canContinue) return;
    persistDisplayName(trimmed);
    setNameCaptured(true);
    navigate('/setup/daily');
  };

  return (
    <form
      className={styles.page}
      onSubmit={(event) => {
        event.preventDefault();
        continueToDaily();
      }}
    >
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/setup')}
          aria-label="Back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className={styles.headline}>Let&apos;s put a name to your practice</h1>
        <p className={styles.subline}>
          This helps us keep your progress connected to you.
        </p>
      </header>
      <div className={styles.body}>
        <label className={styles.label} htmlFor="setup-name">
          Your name
        </label>
        <input
          id="setup-name"
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          autoComplete="name"
          enterKeyHint="go"
          required
        />
      </div>
      <footer className={styles.footer}>
        <Button type="submit" disabled={!canContinue}>
          Continue
        </Button>
      </footer>
    </form>
  );
}

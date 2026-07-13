import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { verifyAdminPassphrase } from '../../services/adminAuth';
import styles from './AdminGate.module.css';

export interface AdminGateProps {
  onAuthenticated: () => void;
}

export function AdminGate({ onAuthenticated }: AdminGateProps) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (verifyAdminPassphrase(passphrase)) {
      setError(null);
      onAuthenticated();
      return;
    }
    setError('Incorrect passphrase.');
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.hint}>Enter the study passphrase to view participant data.</p>
        <label className={styles.label} htmlFor="admin-passphrase">
          Passphrase
        </label>
        <input
          id="admin-passphrase"
          className={styles.input}
          type="password"
          value={passphrase}
          onChange={(event) => setPassphrase(event.target.value)}
          autoComplete="current-password"
        />
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit">Continue</Button>
      </form>
    </div>
  );
}

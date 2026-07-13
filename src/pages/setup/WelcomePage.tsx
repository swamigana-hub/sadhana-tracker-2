import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { WelcomeIllustrationCluster } from '../../components/practice/WelcomeIllustrationCluster';
import { setWelcomeSeen } from '../../services/setupProgress';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  const onGetStarted = () => {
    setWelcomeSeen(true);
    navigate('/setup/name');
  };

  return (
    <div className={styles.page}>
      <WelcomeIllustrationCluster />
      <div className={styles.content}>
        <h1 className={styles.headline}>Your sadhana, in one place.</h1>
        <p className={styles.subline}>Track what you practice. Watch it build.</p>
        <div className={styles.cta}>
          <Button onClick={onGetStarted}>Get started</Button>
        </div>
      </div>
    </div>
  );
}

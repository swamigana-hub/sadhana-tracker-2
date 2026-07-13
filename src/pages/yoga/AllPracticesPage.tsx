import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { PracticeIllustration } from '../../components/practice/PracticeIllustration';
import { useAppData } from '../../context/AppDataContext';
import {
  getPracticeById,
  getSetupPopularPractices,
  PRACTICES,
} from '../../data/practices';
import { countPlacements, addToDaily, addToOther } from '../../services/practiceInstances';
import { getScheduleChips } from '../../services/practiceScheduleChips';
import { setSetupReentry } from '../../services/setupReentry';
import { tryGetSupabase } from '../../lib/supabase/client';
import styles from './AllPracticesPage.module.css';

export default function AllPracticesPage() {
  const navigate = useNavigate();
  const { lists, practiceInstances, deviceId } = useAppData();
  const [sheetPracticeId, setSheetPracticeId] = useState<string | null>(null);

  const popular = getSetupPopularPractices();
  const allAlpha = [...PRACTICES].sort((a, b) => a.name.localeCompare(b.name));

  const onAdd = (target: 'daily' | 'other') => {
    if (!sheetPracticeId) return;
    const updated =
      target === 'daily'
        ? addToDaily(lists, sheetPracticeId)
        : addToOther(lists, sheetPracticeId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetPracticeId(null);
  };

  const renderCard = (practiceId: string) => {
    const practice = getPracticeById(practiceId);
    if (!practice) return null;
    const chips = getScheduleChips(lists, practiceId);
    return (
      <button
        key={practiceId}
        type="button"
        className={styles.card}
        onClick={() => setSheetPracticeId(practiceId)}
      >
        <PracticeIllustration practiceId={practiceId} name={practice.name} size="card" />
        <div className={styles.cardText}>
          <span className={styles.name}>{practice.name}</span>
          <div className={styles.chips}>
            {chips.map((chip) => (
              <span key={chip} className={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </button>
    );
  };

  const atMax = sheetPracticeId ? countPlacements(lists, sheetPracticeId) >= 2 : false;

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.title}>All Practices</h1>
        <section>
          <h2 className={styles.sectionTitle}>Commonly Practiced</h2>
          {popular.map((p) => renderCard(p.id))}
        </section>
        <section>
          <h2 className={styles.sectionTitle}>All Practices (A to Z)</h2>
          {allAlpha.map((p) => renderCard(p.id))}
        </section>
        <div className={styles.reentry}>
          <Button
            variant="subordinate"
            onClick={() => {
              setSetupReentry(true);
              navigate('/setup/daily');
            }}
          >
            Edit setup
          </Button>
        </div>
      </div>

      {sheetPracticeId && (
        <BottomSheet
          open
          title={getPracticeById(sheetPracticeId)?.name}
          onClose={() => setSheetPracticeId(null)}
        >
          {atMax ? (
            <p className={styles.limitMsg}>This practice can only be added twice.</p>
          ) : (
            <>
              <button type="button" className={styles.sheetOption} onClick={() => onAdd('daily')}>
                Add to Daily
              </button>
              <button type="button" className={styles.sheetOption} onClick={() => onAdd('other')}>
                Add to Other
              </button>
            </>
          )}
        </BottomSheet>
      )}
    </AppShell>
  );
}

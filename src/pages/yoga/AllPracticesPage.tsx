import { useMemo, useState } from 'react';
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
import {
  addToDaily,
  addToOther,
  removeFromDaily,
  removeFromOther,
} from '../../services/practiceInstances';
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

  const counts = useMemo(() => {
    if (!sheetPracticeId) return { daily: 0, other: 0, total: 0 };
    const daily = lists.daily.filter((p) => p.practiceId === sheetPracticeId).length;
    const other = lists.other.filter((p) => p.practiceId === sheetPracticeId).length;
    return { daily, other, total: daily + other };
  }, [lists, sheetPracticeId]);

  const onAdd = (target: 'daily' | 'other') => {
    if (!sheetPracticeId) return;
    const updated =
      target === 'daily'
        ? addToDaily(lists, sheetPracticeId)
        : addToOther(lists, sheetPracticeId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetPracticeId(null);
  };

  const onRemoveFromDaily = () => {
    if (!sheetPracticeId) return;
    const placement = lists.daily.find((p) => p.practiceId === sheetPracticeId);
    if (!placement) return;
    const updated = removeFromDaily(lists, placement.instanceId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetPracticeId(null);
  };

  const onRemoveFromOther = () => {
    if (!sheetPracticeId) return;
    const placement = lists.other.find((p) => p.practiceId === sheetPracticeId);
    if (!placement) return;
    const updated = removeFromOther(lists, placement.instanceId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetPracticeId(null);
  };

  const renderSheetOptions = () => {
    const { daily, other, total } = counts;

    if (total >= 2) {
      if (daily >= 2 && other === 0) {
        return (
          <>
            <button type="button" className={styles.sheetOption} onClick={() => onAdd('other')}>
              Add to other practices
            </button>
            <button type="button" className={styles.sheetOption} onClick={onRemoveFromDaily}>
              Remove from daily practices
            </button>
          </>
        );
      }
      if (other >= 2 && daily === 0) {
        return (
          <>
            <button type="button" className={styles.sheetOption} onClick={() => onAdd('daily')}>
              Add to daily practice
            </button>
            <button type="button" className={styles.sheetOption} onClick={onRemoveFromOther}>
              Remove from other practices
            </button>
          </>
        );
      }
      return <p className={styles.limitMsg}>This practice can only be added twice.</p>;
    }

    return (
      <>
        <button type="button" className={styles.sheetOption} onClick={() => onAdd('daily')}>
          Add to daily practice
        </button>
        <button type="button" className={styles.sheetOption} onClick={() => onAdd('other')}>
          Add to other practices
        </button>
      </>
    );
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

  return (
    <AppShell>
      <div className={styles.page}>
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
          {renderSheetOptions()}
        </BottomSheet>
      )}
    </AppShell>
  );
}

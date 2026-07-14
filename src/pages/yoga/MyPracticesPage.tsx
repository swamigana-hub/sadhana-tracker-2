import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { PrimarySecondaryCtas } from '../../components/ui/PrimarySecondaryCtas';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { TodayProgress } from '../../components/progress/TodayProgress';
import { PracticeIllustration } from '../../components/practice/PracticeIllustration';
import { useAppData } from '../../context/AppDataContext';
import { getPracticeById } from '../../data/practices';
import {
  removeFromDaily,
  removeFromOther,
  moveDailyToOther,
  moveOtherToDaily,
} from '../../services/practiceInstances';
import { isPlacementLoggedToday } from '../../services/placementLogging';
import { setSetupReentry } from '../../services/setupReentry';
import { tryGetSupabase } from '../../lib/supabase/client';
import pageStyles from '../../styles/pageLayout.module.css';
import styles from './MyPracticesPage.module.css';

export default function MyPracticesPage() {
  const navigate = useNavigate();
  const { lists, practiceInstances, logs, today, deviceId } = useAppData();
  const [sheetInstanceId, setSheetInstanceId] = useState<string | null>(null);
  const [sheetList, setSheetList] = useState<'daily' | 'other'>('daily');

  const dailyPlacements = lists.daily;
  const otherPlacements = lists.other;

  const openManage = (instanceId: string, list: 'daily' | 'other') => {
    setSheetInstanceId(instanceId);
    setSheetList(list);
  };

  const placement =
    sheetList === 'daily'
      ? dailyPlacements.find((p) => p.instanceId === sheetInstanceId)
      : otherPlacements.find((p) => p.instanceId === sheetInstanceId);

  const remove = () => {
    if (!sheetInstanceId) return;
    const updated =
      sheetList === 'daily'
        ? removeFromDaily(lists, sheetInstanceId)
        : removeFromOther(lists, sheetInstanceId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetInstanceId(null);
  };

  const move = () => {
    if (!sheetInstanceId) return;
    const updated =
      sheetList === 'daily'
        ? moveDailyToOther(lists, sheetInstanceId)
        : moveOtherToDaily(lists, sheetInstanceId);
    practiceInstances.replaceListsOptimistic(updated, deviceId, tryGetSupabase());
    setSheetInstanceId(null);
  };

  const renderPlacement = (
    instanceId: string,
    practiceId: string,
    list: 'daily' | 'other'
  ) => {
    const practice = getPracticeById(practiceId);
    if (!practice) return null;
    const done = isPlacementLoggedToday(logs, today, dailyPlacements, otherPlacements, instanceId);
    return (
      <button
        key={instanceId}
        type="button"
        className={`${styles.card} ${done ? styles.cardDone : ''}`}
        onClick={() => openManage(instanceId, list)}
      >
        <PracticeIllustration practiceId={practiceId} name={practice.name} size="list" />
        <span>{practice.name}</span>
        {done && <span className={styles.doneMark}>✓</span>}
      </button>
    );
  };

  const removeLabel =
    sheetList === 'daily' ? 'Remove from daily practices' : 'Remove from other practices';
  const moveLabel =
    sheetList === 'daily' ? 'Move to other practices' : 'Move to daily practices';

  return (
    <AppShell>
      <div className={pageStyles.page}>
        <div className={pageStyles.scroll}>
          <TodayProgress centerLabel />

          <h2 className={pageStyles.sectionTitle}>My Daily Practices</h2>
          {dailyPlacements.length === 0 ? (
            <div className={styles.empty}>
              <p>Not practicing anything daily yet?</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSetupReentry(true);
                  navigate('/setup/daily');
                }}
              >
                Add a daily practice
              </Button>
            </div>
          ) : (
            dailyPlacements.map((p) => renderPlacement(p.instanceId, p.practiceId, 'daily'))
          )}

          {otherPlacements.length > 0 && (
            <>
              <h2 className={pageStyles.sectionTitle}>My Other Practices</h2>
              {otherPlacements.map((p) => renderPlacement(p.instanceId, p.practiceId, 'other'))}
            </>
          )}
        </div>

        <div className={pageStyles.stickyFooter}>
          <PrimarySecondaryCtas
            primary={<Button onClick={() => navigate('/session')}>Start Practice</Button>}
            secondary={
              <Button variant="secondary" onClick={() => navigate('/log')}>
                Log Practice
              </Button>
            }
          />
        </div>
      </div>

      {sheetInstanceId && placement && (
        <BottomSheet
          open
          title={getPracticeById(placement.practiceId)?.name}
          onClose={() => setSheetInstanceId(null)}
        >
          <button type="button" className={styles.sheetOption} onClick={remove}>
            {removeLabel}
          </button>
          <button type="button" className={styles.sheetOption} onClick={move}>
            {moveLabel}
          </button>
        </BottomSheet>
      )}
    </AppShell>
  );
}

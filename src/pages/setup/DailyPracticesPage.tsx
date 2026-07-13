import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PracticeSelectionList } from '../../components/practice/PracticeSelectionList';
import { SetupStepLayout } from './SetupStepLayout';
import { SetupSunIcon } from './SetupScreenIcons';
import setupStyles from './SetupStepLayout.module.css';
import { sortByCanonicalOrder } from '../../data/practices';
import { getOrCreateDeviceId } from '../../services/deviceId';
import { getNameCaptured } from '../../services/setupProgress';
import { getSetupDraftDaily, setSetupDraftDaily } from '../../services/setupDraft';
import { saveDailySelectionsOptimistic } from '../../services/setupFlow';
import { tryGetSupabase } from '../../lib/supabase/client';
import { isSetupReentry } from '../../services/setupReentry';

export default function DailyPracticesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);
  const restored = (location.state as { daily?: string[] } | null)?.daily;
  const initialDaily = restored?.length ? restored : getSetupDraftDaily();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialDaily));

  const dailyIds = useMemo(() => sortByCanonicalOrder([...selected]), [selected]);

  useEffect(() => {
    setSetupDraftDaily(dailyIds);
  }, [dailyIds]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goNext = () => {
    if (selected.size === 0) return;
    saveDailySelectionsOptimistic(dailyIds, deviceId, tryGetSupabase());
    navigate('/setup/daily-saved', { state: { daily: dailyIds } });
  };

  if (!getNameCaptured() && !isSetupReentry()) {
    return <Navigate to="/setup/name" replace />;
  }

  return (
    <SetupStepLayout
      step={1}
      icon={<SetupSunIcon />}
      heading={
        <>
          Choose practices you want to do{' '}
          <span className={setupStyles.emphasis}>daily</span>
        </>
      }
      onBack={() => navigate('/setup/name')}
      footer={
        <Button disabled={selected.size === 0} onClick={goNext}>
          Next
        </Button>
      }
    >
      <PracticeSelectionList selectedIds={selected} onToggle={toggle} />
    </SetupStepLayout>
  );
}

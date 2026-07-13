import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PracticeSelectionList } from '../../components/practice/PracticeSelectionList';
import { SetupStepLayout } from './SetupStepLayout';
import { SetupCalendarIcon } from './SetupScreenIcons';
import setupStyles from './SetupStepLayout.module.css';
import { sortByCanonicalOrder } from '../../data/practices';
import { useAppData } from '../../context/AppDataContext';
import { completeSetup, persistSetupLocally } from '../../services/setupFlow';
import { tryGetSupabase } from '../../lib/supabase/client';
import {
  getSetupDraftDaily,
  getSetupDraftOther,
  setSetupDraftOther,
} from '../../services/setupDraft';
import { setSetupReentry } from '../../services/setupReentry';

interface LocationState {
  daily: string[];
}

export default function OtherPracticesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId, practiceInstances } = useAppData();
  const stateDaily = (location.state as LocationState | null)?.daily;
  const draftDaily = getSetupDraftDaily();
  const daily = stateDaily?.length ? stateDaily : draftDaily;

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(getSetupDraftOther())
  );

  const otherIds = sortByCanonicalOrder([...selected]);
  const excludeDaily = useMemo(() => new Set(daily), [daily]);

  useEffect(() => {
    setSetupDraftOther(otherIds);
  }, [otherIds]);

  if (!daily || daily.length === 0) {
    return <Navigate to="/setup/daily" replace />;
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const finish = () => {
    persistSetupLocally(daily, otherIds);
    practiceInstances.replaceLists(daily, otherIds);
    setSetupReentry(false);
    navigate('/', { replace: true });
    completeSetup(daily, otherIds, deviceId, tryGetSupabase());
  };

  return (
    <SetupStepLayout
      step={2}
      icon={<SetupCalendarIcon />}
      heading={
        <>
          Select any other practices you do{' '}
          <span className={setupStyles.emphasis}>occasionally</span>
        </>
      }
      scrollToTopOnMount
      onBack={() => navigate('/setup/daily', { state: { daily } })}
      footer={<Button onClick={finish}>Done</Button>}
    >
      <PracticeSelectionList
        selectedIds={selected}
        onToggle={toggle}
        excludeIds={excludeDaily}
      />
    </SetupStepLayout>
  );
}

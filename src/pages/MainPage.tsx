import { useCallback, useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { ProgressRing } from '../components/ring/ProgressRing';
import { PracticeListManagement } from '../components/practice/PracticeListManagement';
import { ProgressView } from '../components/progress/ProgressView';
import {
  canLogPlacement as canLogPlacementService,
  isPlacementLoggedToday,
} from '../services/placementLogging';
import styles from './MainPage.module.css';

export default function MainPage() {
  const {
    addLog,
    today,
    daily,
    practiceInstances,
    logs,
    ring,
    todayMinutes,
    daysPracticed,
    totalMinutes,
    heatmapWeeks,
  } = useAppData();

  const { dailyPlacements, otherPlacements } = practiceInstances;
  const [ringCelebrate, setRingCelebrate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashRingCelebrate = useCallback((ringIncreased: boolean) => {
    if (!ringIncreased) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setRingCelebrate(true);
    timerRef.current = setTimeout(() => {
      setRingCelebrate(false);
      timerRef.current = null;
    }, 800);
  }, []);

  const isPlacementLogged = useCallback(
    (instanceId: string) => {
      return isPlacementLoggedToday(logs, today, dailyPlacements, otherPlacements, instanceId);
    },
    [dailyPlacements, otherPlacements, logs, today]
  );

  const canLogPlacement = useCallback(
    (instanceId: string) => {
      return canLogPlacementService(logs, today, dailyPlacements, otherPlacements, instanceId);
    },
    [dailyPlacements, otherPlacements, logs, today]
  );

  const logPlacement = useCallback(
    async (instanceId: string, practiceId: string) => {
      if (!canLogPlacementService(logs, today, dailyPlacements, otherPlacements, instanceId)) {
        return;
      }
      const result = await addLog({
        logDate: today,
        practiceIds: [practiceId],
        dailyPractices: daily,
        placementInstanceId: instanceId,
      });
      flashRingCelebrate(result.ringIncreased);
    },
    [addLog, today, daily, dailyPlacements, otherPlacements, logs, flashRingCelebrate]
  );

  const onLogPlacement = useCallback(
    (instanceId: string, practiceId: string) => {
      void logPlacement(instanceId, practiceId);
    },
    [logPlacement]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.progressHeading}>Today&apos;s progress</h2>
        <ProgressRing
          numerator={ring.numerator}
          denominator={ring.denominator}
          minutesFillRatio={ring.minutesFillRatio}
          minutesToday={todayMinutes}
          celebrate={ringCelebrate}
        />
      </header>

      <PracticeListManagement
        dailyPlacements={dailyPlacements}
        otherPlacements={otherPlacements}
        isPlacementLogged={isPlacementLogged}
        canLogPlacement={canLogPlacement}
        onLogPlacement={onLogPlacement}
      />

      <ProgressView
        daysPracticed={daysPracticed}
        totalMinutes={totalMinutes}
        heatmapWeeks={heatmapWeeks}
        today={today}
      />
    </div>
  );
}

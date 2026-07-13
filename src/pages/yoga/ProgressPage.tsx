import { AppShell } from '../../components/layout/AppShell';
import { WeeklyHeatmap } from '../../components/progress/WeeklyHeatmap';
import { StatBox } from '../../components/progress/StatBox';
import { useAppData } from '../../context/AppDataContext';
import { computeStreaks } from '../../services/streakCalculator';
import styles from './ProgressPage.module.css';

export default function ProgressPage() {
  const { daysPracticed, totalMinutes, heatmapWeeks, logs, today } = useAppData();
  const { current, longest } = computeStreaks(logs, today);

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.title}>Progress</h1>
        <div className={styles.stats}>
          <StatBox label="Total days" value={daysPracticed} />
          <StatBox label="Total minutes" value={totalMinutes} />
          <StatBox label="Current streak" value={current} />
          <StatBox label="Longest streak" value={longest} />
        </div>
        <WeeklyHeatmap weeks={heatmapWeeks} />
      </div>
    </AppShell>
  );
}

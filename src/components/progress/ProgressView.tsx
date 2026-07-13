import type { HeatmapWeek } from '../../services/weeklyHeatmapAggregator';
import { StatBox } from './StatBox';
import { WeeklyHeatmap } from './WeeklyHeatmap';
import styles from './ProgressView.module.css';

export interface ProgressViewProps {
  daysPracticed: number;
  totalMinutes: number;
  heatmapWeeks: HeatmapWeek[];
  today: string;
}

export function ProgressView({
  daysPracticed,
  totalMinutes,
  heatmapWeeks,
}: ProgressViewProps) {
  return (
    <section className={styles.section} aria-label="Progress">
      <h2 className={styles.sectionTitle}>My practice progress</h2>
      <div className={styles.stats}>
        <StatBox label="Total days" value={daysPracticed} />
        <StatBox label="Total minutes" value={totalMinutes} />
      </div>
      <WeeklyHeatmap weeks={heatmapWeeks} />
    </section>
  );
}

import type { HeatmapDay } from '../../services/weeklyHeatmapAggregator';
import { DayTile } from './DayTile';
import { useCountUp } from './useCountUp';
import heatmapStyles from './WeeklyHeatmap.module.css';
import styles from './WeekRow.module.css';

export interface WeekRowProps {
  weekLabel: string;
  days: HeatmapDay[];
  weekMinutes: number;
  isCurrentWeek: boolean;
  enlarged?: boolean;
}

export function WeekRow({ weekLabel, days, weekMinutes, isCurrentWeek, enlarged = false }: WeekRowProps) {
  const displayMinutes = useCountUp(weekMinutes, isCurrentWeek);

  return (
    <div className={`${heatmapStyles.row} ${enlarged ? styles.enlargedRow : ''}`}>
      <span className={`${heatmapStyles.weekLabelCell} ${styles.label}`}>{weekLabel}</span>
      {days.map((day) => (
        <div key={day.date} className={heatmapStyles.dayCell}>
          <DayTile state={day.tileState} label={day.date} />
        </div>
      ))}
      <div className={heatmapStyles.minutesCell}>
        <span className={heatmapStyles.minutesValue}>
          {displayMinutes.toLocaleString()}
        </span>
        {isCurrentWeek && <span className={heatmapStyles.soFar}>so far</span>}
      </div>
    </div>
  );
}

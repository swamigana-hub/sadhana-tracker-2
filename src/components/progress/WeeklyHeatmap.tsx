import type { HeatmapWeek } from '../../services/weeklyHeatmapAggregator';
import { WEEKDAY_INITIALS } from '../../services/weekLabels';
import { WeekRow } from './WeekRow';
import styles from './WeeklyHeatmap.module.css';

export interface WeeklyHeatmapProps {
  weeks: HeatmapWeek[];
}

export function WeeklyHeatmap({ weeks }: WeeklyHeatmapProps) {
  if (weeks.length === 0) return null;

  return (
    <div className={styles.heatmap}>
      <div className={styles.headerRow} aria-hidden>
        <span className={styles.weekLabelCell} />
        {WEEKDAY_INITIALS.map((initial, index) => (
          <div key={`${initial}-${index}`} className={styles.dayCell}>
            <span className={styles.weekday}>{initial}</span>
          </div>
        ))}
        <div className={styles.minutesCell}>
          <span className={styles.minutesHeader}>min/week</span>
        </div>
      </div>
      {weeks.map((week) => (
        <WeekRow
          key={week.mondayDate}
          weekLabel={week.weekLabel}
          days={week.days}
          weekMinutes={week.weekMinutes}
          isCurrentWeek={week.isCurrentWeek}
        />
      ))}
    </div>
  );
}

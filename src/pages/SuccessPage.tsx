import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { PracticeIllustration } from '../components/practice/PracticeIllustration';
import { TodayProgress } from '../components/progress/TodayProgress';
import { WeekRow } from '../components/progress/WeekRow';
import { WEEKDAY_INITIALS } from '../services/weekLabels';
import { useAppData } from '../context/AppDataContext';
import { getPracticeById } from '../data/practices';
import heatmapStyles from '../components/progress/WeeklyHeatmap.module.css';
import styles from './SuccessPage.module.css';

interface SuccessState {
  practiceIds: string[];
  mode: 'session' | 'log';
}

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessState | null;
  const { heatmapWeeks, logs } = useAppData();

  if (!state?.practiceIds?.length) {
    navigate('/', { replace: true });
    return null;
  }

  const practices = state.practiceIds
    .map((id) => getPracticeById(id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  const headline =
    practices.length === 1
      ? `${practices[0].name} Completed`
      : `${practices.length} Practices Completed`;

  const currentWeek = heatmapWeeks.find((w) => w.isCurrentWeek) ?? heatmapWeeks[0];
  const weekMinutes = currentWeek
    ? logs
        .filter((l) => currentWeek.days.some((d) => d.date === l.log_date))
        .reduce((sum, l) => sum + (l.minutes_total ?? 0), 0)
    : 0;

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.illustrations}>
            {state.practiceIds.map((id) => {
              const practice = getPracticeById(id);
              return (
                <PracticeIllustration
                  key={id}
                  practiceId={id}
                  name={practice?.name ?? id}
                  size="card"
                />
              );
            })}
          </div>
          <h1 className={styles.headline}>{headline}</h1>
        </div>

        <TodayProgress celebrate />

        <section className={styles.weekSection}>
          <h2 className={styles.sectionLabel}>This Week</h2>
          {currentWeek && (
            <>
              <div className={heatmapStyles.headerRow} aria-hidden>
                <span className={heatmapStyles.weekLabelCell} />
                {WEEKDAY_INITIALS.map((initial, index) => (
                  <div key={`${initial}-${index}`} className={heatmapStyles.dayCell}>
                    <span className={heatmapStyles.weekday}>{initial}</span>
                  </div>
                ))}
                <div className={heatmapStyles.minutesCell}>
                  <span className={heatmapStyles.minutesHeader}>min/week</span>
                </div>
              </div>
              <WeekRow
                weekLabel={currentWeek.weekLabel}
                days={currentWeek.days}
                weekMinutes={weekMinutes}
                isCurrentWeek
                enlarged
              />
              <p className={styles.weekTotal}>{weekMinutes} minutes this week</p>
            </>
          )}
        </section>

        <div className={styles.footer}>
          <Button onClick={() => navigate('/')}>Done</Button>
        </div>
      </div>
    </AppShell>
  );
}

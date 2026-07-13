import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { BottomSheet } from '../components/ui/BottomSheet';
import { PracticeIllustration } from '../components/practice/PracticeIllustration';
import { useAppData } from '../context/AppDataContext';
import { getPracticeById, sortByCanonicalOrder } from '../data/practices';
import {
  getPracticeDetailKind,
  durationFromCycles,
} from '../data/practiceDetails';
import { getRecentlyLogged } from '../services/recentSessions';
import {
  getLogDraft,
  setLogDraft,
  draftToEntries,
  type LogDraftEntry,
} from '../services/sessionStore';
import { getLastUsedDetails, saveLastUsedDetails } from '../services/lastUsedDetails';
import {
  addToOther,
  type PracticeLists,
} from '../services/practiceInstances';
import { getPracticeLists, setPracticeLists } from '../services/localStore';
import { syncPracticeListsToBackend } from '../services/setupFlow';
import { tryGetSupabase } from '../lib/supabase/client';
import { useCompletionWriter } from '../hooks/useCompletionWriter';
import pageStyles from '../styles/pageLayout.module.css';
import styles from './LogPracticeSelectionPage.module.css';

function buildPracticeSections(lists: PracticeLists, allPoolIds: string[]) {
  const dailyIds = lists.daily.map((p) => p.practiceId);
  const otherIds = lists.other.map((p) => p.practiceId);
  const scheduled = new Set([...dailyIds, ...otherIds]);
  const allOtherIds = sortByCanonicalOrder(
    allPoolIds.filter((id) => !scheduled.has(id))
  );
  return { dailyIds, otherIds, allOtherIds };
}

type DetailStep = 'cycles' | 'duration';

export default function LogPracticeSelectionPage() {
  const navigate = useNavigate();
  const { lists, allPracticesPoolIds, deviceId, today, setLogs } = useAppData();
  const { logPractices } = useCompletionWriter({
    deviceId,
    client: tryGetSupabase(),
    onLogsChanged: setLogs,
  });

  const [draft, setDraft] = useState<LogDraftEntry[]>(() => getLogDraft());
  const [allOtherExpanded, setAllOtherExpanded] = useState(false);
  const [sheetPracticeId, setSheetPracticeId] = useState<string | null>(null);
  const [sheetStep, setSheetStep] = useState<DetailStep>('cycles');
  const [tempCycles, setTempCycles] = useState<number>(6);
  const [tempDuration, setTempDuration] = useState<number>(10);

  const recentlyLogged = getRecentlyLogged();
  const sections = useMemo(
    () => buildPracticeSections(lists, allPracticesPoolIds),
    [lists, allPracticesPoolIds]
  );

  const persistDraft = (next: LogDraftEntry[]) => {
    setDraft(next);
    setLogDraft(next);
  };

  const getDraftEntry = (practiceId: string) =>
    draft.find((d) => d.practiceId === practiceId);

  const openSheet = (practiceId: string, step?: DetailStep) => {
    const last = getLastUsedDetails(practiceId);
    const practice = getPracticeById(practiceId);
    setTempCycles(last.cycles ?? 6);
    setTempDuration(last.durationMinutes ?? practice?.durationMinutes ?? 10);
    setSheetPracticeId(practiceId);
    setSheetStep(step ?? (getPracticeDetailKind(practiceId) === 'cycles-and-duration' ? 'cycles' : 'duration'));
  };

  const closeSheet = (practiceId: string) => {
    const kind = getPracticeDetailKind(practiceId);
    const entry: LogDraftEntry = {
      practiceId,
      configured: true,
      cycles: kind === 'cycles-and-duration' ? tempCycles : undefined,
      durationMinutes:
        kind === 'duration' || kind === 'cycles-and-duration'
          ? tempDuration
          : durationFromCycles(practiceId, tempCycles),
    };
    saveLastUsedDetails(practiceId, {
      cycles: entry.cycles,
      durationMinutes: entry.durationMinutes,
    });
    const without = draft.filter((d) => d.practiceId !== practiceId);
    persistDraft([...without, entry]);
    setSheetPracticeId(null);
  };

  const onCardTap = (practiceId: string, fromAllOther = false) => {
    const existing = getDraftEntry(practiceId);
    if (existing?.configured) return;
    if (fromAllOther) {
      const current = getPracticeLists();
      const updated = addToOther(current, practiceId);
      setPracticeLists(updated);
      syncPracticeListsToBackend(updated, deviceId, tryGetSupabase());
    }
    openSheet(practiceId);
  };

  const unselect = (practiceId: string) => {
    persistDraft(draft.filter((d) => d.practiceId !== practiceId));
  };

  const configuredCount = draft.filter((d) => d.configured).length;

  const logAll = () => {
    const entries = draftToEntries(draft);
    logPractices(entries, today);
    navigate('/success', {
      state: {
        practiceIds: entries.map((e) => e.practiceId),
        mode: 'log',
      },
    });
  };

  const renderCard = (practiceId: string, fromAllOther = false) => {
    const practice = getPracticeById(practiceId);
    if (!practice) return null;
    const entry = getDraftEntry(practiceId);
    const configured = entry?.configured;

    return (
      <div
        key={practiceId}
        className={`${styles.card} ${configured ? styles.cardSelected : ''}`}
      >
        <button
          type="button"
          className={styles.cardBody}
          onClick={() => (configured ? unselect(practiceId) : onCardTap(practiceId, fromAllOther))}
        >
          <PracticeIllustration practiceId={practiceId} name={practice.name} size="card" />
          <span className={styles.cardName}>{practice.name}</span>
        </button>
        {configured && (
          <div className={styles.chips}>
            {entry?.cycles != null && (
              <button
                type="button"
                className={styles.chip}
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet(practiceId, 'cycles');
                }}
              >
                {entry.cycles} cycles
              </button>
            )}
            {entry?.durationMinutes != null && (
              <button
                type="button"
                className={styles.chip}
                onClick={(e) => {
                  e.stopPropagation();
                  openSheet(practiceId, 'duration');
                }}
              >
                {entry.durationMinutes} min
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const sheetKind = sheetPracticeId ? getPracticeDetailKind(sheetPracticeId) : 'duration';
  const sheetSteps = sheetKind === 'cycles-and-duration' ? 2 : 1;
  const sheetStepIndex = sheetStep === 'cycles' ? 1 : sheetSteps;

  return (
    <AppShell>
      <div className={pageStyles.page}>
        <div className={pageStyles.scroll}>
          {recentlyLogged.length > 0 && (
            <>
              <h2 className={pageStyles.sectionTitle}>Recently Logged</h2>
              <div className={pageStyles.recentRow}>
                {recentlyLogged.map((item) => (
                  <div key={item.id} className={pageStyles.recentCard}>
                    {item.entries.length === 1 ? (
                      <div className={styles.singleDetail}>
                        <PracticeIllustration
                          practiceId={
                            typeof item.entries[0] === 'string'
                              ? item.entries[0]
                              : item.entries[0].practiceId
                          }
                          name=""
                          size="cluster"
                        />
                        {typeof item.entries[0] !== 'string' && (
                          <span className={styles.detailText}>
                            {item.entries[0].cycles != null && `${item.entries[0].cycles} cycles`}
                            {item.entries[0].durationMinutes != null &&
                              ` ${item.entries[0].durationMinutes} min`}
                          </span>
                        )}
                      </div>
                    ) : (
                      item.entries.slice(0, 3).map((entry) => {
                        const id = typeof entry === 'string' ? entry : entry.practiceId;
                        const practice = getPracticeById(id);
                        return (
                          <PracticeIllustration
                            key={id}
                            practiceId={id}
                            name={practice?.name ?? id}
                            size="cluster"
                          />
                        );
                      })
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className={pageStyles.sectionTitle}>My Daily Practices</h2>
          <div className={styles.cardGrid}>
            {sections.dailyIds.map((id) => renderCard(id))}
          </div>

          <h2 className={pageStyles.sectionTitle}>My Other Practices</h2>
          <div className={styles.cardGrid}>
            {sections.otherIds.map((id) => renderCard(id))}
          </div>

          {sections.allOtherIds.length > 0 && (
            <section>
              <button
                type="button"
                className={pageStyles.collapsedHeader}
                onClick={() => setAllOtherExpanded((v) => !v)}
              >
                All Other Practices
                <span aria-hidden>{allOtherExpanded ? '−' : '+'}</span>
              </button>
              {allOtherExpanded && (
                <div className={`${pageStyles.collapsedBody} ${styles.cardGrid}`}>
                  {sections.allOtherIds.map((id) => renderCard(id, true))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className={pageStyles.stickyFooter}>
          <Button onClick={logAll} disabled={configuredCount === 0}>
            Log Practices
          </Button>
        </div>
      </div>

      {sheetPracticeId && (
        <BottomSheet
          open
          stepLabel={sheetSteps > 1 ? `${sheetStepIndex} of ${sheetSteps}` : undefined}
          title={getPracticeById(sheetPracticeId)?.name}
          onBack={
            sheetStep === 'duration' && sheetKind === 'cycles-and-duration'
              ? () => setSheetStep('cycles')
              : undefined
          }
          onClose={() => closeSheet(sheetPracticeId)}
        >
          {sheetStep === 'cycles' && (
            <label className={styles.field}>
              <span>Cycles</span>
              <input
                type="number"
                min={1}
                value={tempCycles}
                onChange={(e) => {
                  const cycles = Number(e.target.value) || 1;
                  setTempCycles(cycles);
                  if (sheetKind === 'cycles-and-duration') {
                    setTempDuration(durationFromCycles(sheetPracticeId, cycles));
                  }
                }}
              />
            </label>
          )}
          {(sheetStep === 'duration' || sheetKind === 'duration') && (
            <label className={styles.field}>
              <span>Duration (minutes)</span>
              <input
                type="number"
                min={1}
                value={tempDuration}
                onChange={(e) => setTempDuration(Number(e.target.value) || 1)}
              />
            </label>
          )}
          {sheetStep === 'cycles' && sheetKind === 'cycles-and-duration' ? (
            <Button onClick={() => setSheetStep('duration')}>Next</Button>
          ) : (
            <Button onClick={() => closeSheet(sheetPracticeId)}>Done</Button>
          )}
        </BottomSheet>
      )}
    </AppShell>
  );
}

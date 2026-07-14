import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Button } from '../components/ui/Button';
import { BottomSheet } from '../components/ui/BottomSheet';
import { PracticeIllustration } from '../components/practice/PracticeIllustration';
import { PracticeSelectCard } from '../components/practice/PracticeSelectCard';
import { useAppData } from '../context/AppDataContext';
import { getPracticeById, sortByCanonicalOrder } from '../data/practices';
import {
  getPracticeLogConfig,
  computeDurationFromDetails,
  durationOptionsForField,
  type LogDetailField,
  type YogasanasLevel,
} from '../data/practiceMasterDetails';
import { getRecentlyLogged } from '../services/recentSessions';
import {
  getLogDraft,
  setLogDraft,
  draftToEntries,
  type LogDraftEntry,
} from '../services/sessionStore';
import { getLastUsedDetails, saveLastUsedDetails } from '../services/lastUsedDetails';
import { addToOther, type PracticeLists } from '../services/practiceInstances';
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
  const allOtherIds = sortByCanonicalOrder(allPoolIds.filter((id) => !scheduled.has(id)));
  return { dailyIds, otherIds, allOtherIds };
}

type SheetState = {
  practiceId: string;
  stepIndex: number;
  editing: boolean;
  temp: LogDraftEntry;
};

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
  const [sheet, setSheet] = useState<SheetState | null>(null);

  const recentlyLogged = getRecentlyLogged();
  const sections = useMemo(
    () => buildPracticeSections(lists, allPracticesPoolIds),
    [lists, allPracticesPoolIds]
  );

  const persistDraft = (next: LogDraftEntry[]) => {
    setDraft(next);
    setLogDraft(next);
  };

  const getDraftEntry = (practiceId: string) => draft.find((d) => d.practiceId === practiceId);

  const openSheet = (practiceId: string, stepIndex = 0, editing = false) => {
    const last = getLastUsedDetails(practiceId);
    const existing = getDraftEntry(practiceId);
    const temp: LogDraftEntry = {
      practiceId,
      configured: false,
      cycles: existing?.cycles ?? last.cycles,
      durationMinutes: existing?.durationMinutes ?? last.durationMinutes,
      level: existing?.level ?? (last.level as YogasanasLevel | undefined),
      kapalabhatis: existing?.kapalabhatis ?? last.kapalabhatis,
    };
    if (temp.durationMinutes == null || temp.durationMinutes === 0) {
      temp.durationMinutes = computeDurationFromDetails(practiceId, temp) ||
        getPracticeById(practiceId)?.durationMinutes ||
        10;
    }
    setSheet({ practiceId, stepIndex, editing, temp });
  };

  const confirmSheet = () => {
    if (!sheet) return;
    const { practiceId, temp } = sheet;
    const durationMinutes =
      temp.durationMinutes ??
      (computeDurationFromDetails(practiceId, temp) ||
        getPracticeById(practiceId)?.durationMinutes);
    const entry: LogDraftEntry = {
      ...temp,
      configured: true,
      durationMinutes,
    };
    saveLastUsedDetails(practiceId, entry);
    persistDraft([...draft.filter((d) => d.practiceId !== practiceId), entry]);
    setSheet(null);
  };

  const cancelSheet = () => setSheet(null);

  const removeFromDraft = (practiceId: string) => {
    persistDraft(draft.filter((d) => d.practiceId !== practiceId));
    setSheet(null);
  };

  const onCardTap = (practiceId: string, fromAllOther = false) => {
    const config = getPracticeLogConfig(practiceId);
    const existing = getDraftEntry(practiceId);

    if (!config.requiresSheet) {
      if (existing?.configured) {
        persistDraft(draft.filter((d) => d.practiceId !== practiceId));
      } else {
        if (fromAllOther) {
          const updated = addToOther(getPracticeLists(), practiceId);
          setPracticeLists(updated);
          syncPracticeListsToBackend(updated, deviceId, tryGetSupabase());
        }
        persistDraft([
          ...draft.filter((d) => d.practiceId !== practiceId),
          {
            practiceId,
            configured: true,
            durationMinutes: getPracticeById(practiceId)?.durationMinutes ?? 0,
          },
        ]);
      }
      return;
    }

    if (existing?.configured) {
      openSheet(practiceId, 0, true);
      return;
    }

    if (fromAllOther) {
      const updated = addToOther(getPracticeLists(), practiceId);
      setPracticeLists(updated);
      syncPracticeListsToBackend(updated, deviceId, tryGetSupabase());
    }
    openSheet(practiceId);
  };

  const logAll = () => {
    const entries = draftToEntries(draft);
    logPractices(entries, today);
    navigate('/success', {
      state: { practiceIds: entries.map((e) => e.practiceId), mode: 'log' },
    });
  };

  const renderLogCard = (practiceId: string, fromAllOther = false) => {
    const practice = getPracticeById(practiceId);
    if (!practice) return null;
    const entry = getDraftEntry(practiceId);
    const configured = entry?.configured;
    const config = getPracticeLogConfig(practiceId);

    if (!config.requiresSheet) {
      return (
        <PracticeSelectCard
          key={practiceId}
          practiceId={practiceId}
          name={practice.name}
          selected={!!configured}
          onToggle={() => onCardTap(practiceId, fromAllOther)}
        />
      );
    }

    return (
      <div
        key={practiceId}
        className={`${styles.card} ${configured ? styles.cardSelected : ''}`}
      >
        <button
          type="button"
          className={styles.cardBody}
          onClick={() => onCardTap(practiceId, fromAllOther)}
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
                  openSheetOnField(practiceId, 'cycles');
                }}
              >
                {entry.cycles} cycles
              </button>
            )}
            {entry?.kapalabhatis != null && (
              <button
                type="button"
                className={styles.chip}
                onClick={(e) => {
                  e.stopPropagation();
                  openSheetOnField(practiceId, 'kapalabhatis');
                }}
              >
                {entry.kapalabhatis} kapalabhatis
              </button>
            )}
            {entry?.level && (
              <button
                type="button"
                className={styles.chip}
                onClick={(e) => {
                  e.stopPropagation();
                  openSheetOnField(practiceId, 'level');
                }}
              >
                {levelLabel(entry.level)}
              </button>
            )}
            {entry?.durationMinutes != null && (
              <button
                type="button"
                className={styles.chip}
                onClick={(e) => {
                  e.stopPropagation();
                  openSheetOnField(practiceId, 'duration');
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

  const renderSheetField = (field: LogDetailField) => {
    if (!sheet) return null;
    const { temp, practiceId } = sheet;

    if (field.type === 'level') {
      return (
        <div className={styles.fieldGroup}>
          {(['beginner', 'advanced'] as YogasanasLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              className={`${styles.optionBtn} ${temp.level === level ? styles.optionSelected : ''}`}
              onClick={() =>
                setSheet({
                  ...sheet,
                  temp: {
                    ...temp,
                    level,
                    durationMinutes: computeDurationFromDetails(practiceId, { level }),
                  },
                })
              }
            >
              {level === 'beginner' ? 'Beginner' : 'Advanced'}
            </button>
          ))}
        </div>
      );
    }

    const options =
      field.type === 'duration'
        ? durationOptionsForField(field)
        : field.options ?? durationOptionsForField(field);

    const value =
      field.type === 'cycles'
        ? temp.cycles ?? (field.defaultValue as number)
        : field.type === 'kapalabhatis'
          ? temp.kapalabhatis ?? (field.defaultValue as number)
          : temp.durationMinutes ?? (field.defaultValue as number);

    return (
      <select
        className={styles.select}
        value={value}
        onChange={(e) => {
          const num = Number(e.target.value);
          const next = { ...temp };
          if (field.type === 'cycles') {
            next.cycles = num;
            next.durationMinutes = computeDurationFromDetails(practiceId, { cycles: num });
          } else if (field.type === 'kapalabhatis') {
            next.kapalabhatis = num;
            next.durationMinutes = computeDurationFromDetails(practiceId, { kapalabhatis: num });
          } else {
            next.durationMinutes = num;
          }
          setSheet({ ...sheet, temp: next });
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {field.type === 'duration' ? `${opt} min` : opt}
          </option>
        ))}
      </select>
    );
  };

  const openSheetOnField = (practiceId: string, fieldType: LogDetailField['type']) => {
    const config = getPracticeLogConfig(practiceId);
    const stepIndex = config.fields.findIndex((f) => f.type === fieldType);
    openSheet(practiceId, Math.max(0, stepIndex), true);
  };

  const levelLabel = (level?: YogasanasLevel) =>
    level === 'advanced' ? 'Advanced' : level === 'beginner' ? 'Beginner' : '';

  const configuredCount = draft.filter((d) => d.configured).length;
  const sheetConfig = sheet ? getPracticeLogConfig(sheet.practiceId) : null;
  const sheetField = sheet && sheetConfig ? sheetConfig.fields[sheet.stepIndex] : null;

  return (
    <AppShell showBottomNav={false}>
      <ScreenHeader title="Select practices you want to log" />
      <div className={pageStyles.page}>
        <div className={pageStyles.scroll}>
          {recentlyLogged.length > 0 && (
            <>
              <h2 className={pageStyles.sectionTitle}>Recently Logged</h2>
              <div className={pageStyles.recentRow}>
                {recentlyLogged.map((item) => (
                  <div key={item.id} className={pageStyles.recentCard}>
                    {item.entries.slice(0, 3).map((entry) => {
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
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className={pageStyles.sectionTitle}>My Daily Practices</h2>
          <div className={styles.cardGrid}>{sections.dailyIds.map((id) => renderLogCard(id))}</div>

          <h2 className={pageStyles.sectionTitle}>My Other Practices</h2>
          <div className={styles.cardGrid}>{sections.otherIds.map((id) => renderLogCard(id))}</div>

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
                  {sections.allOtherIds.map((id) => renderLogCard(id, true))}
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

      {sheet && sheetField && sheetConfig && (
        <BottomSheet
          open
          stepLabel={
            sheetConfig.fields.length > 1
              ? `${sheet.stepIndex + 1} of ${sheetConfig.fields.length}`
              : undefined
          }
          title={getPracticeById(sheet.practiceId)?.name}
          onBack={
            sheet.stepIndex > 0
              ? () => setSheet({ ...sheet, stepIndex: sheet.stepIndex - 1 })
              : undefined
          }
          onClose={cancelSheet}
          footer={
            <>
              {sheet.editing && (
                <Button variant="secondary" onClick={() => removeFromDraft(sheet.practiceId)}>
                  Remove
                </Button>
              )}
              {sheet.stepIndex < sheetConfig.fields.length - 1 ? (
                <Button onClick={() => setSheet({ ...sheet, stepIndex: sheet.stepIndex + 1 })}>
                  Next
                </Button>
              ) : (
                <Button onClick={confirmSheet}>Confirm</Button>
              )}
            </>
          }
        >
          <label className={styles.field}>
            <span>{sheetField.label}</span>
            {renderSheetField(sheetField)}
          </label>
        </BottomSheet>
      )}
    </AppShell>
  );
}

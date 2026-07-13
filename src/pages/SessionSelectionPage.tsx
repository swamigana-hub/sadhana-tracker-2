import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { PracticeRow } from '../components/practice/PracticeRow';
import { PracticeIllustration } from '../components/practice/PracticeIllustration';
import { useAppData } from '../context/AppDataContext';
import { getPracticeById, sortByCanonicalOrder } from '../data/practices';
import { getRecentSessions } from '../services/recentSessions';
import { sessionSignature } from '../services/practiceLogEntries';
import { syncPracticeListsToBackend } from '../services/setupFlow';
import { setActiveSession } from '../services/sessionStore';
import {
  addToOther,
  type PracticeLists,
} from '../services/practiceInstances';
import { setPracticeLists, getPracticeLists } from '../services/localStore';
import { tryGetSupabase } from '../lib/supabase/client';
import pageStyles from '../styles/pageLayout.module.css';
import styles from './SessionSelectionPage.module.css';

function buildPracticeSections(lists: PracticeLists, allPoolIds: string[]) {
  const dailyIds = lists.daily.map((p) => p.practiceId);
  const otherIds = lists.other.map((p) => p.practiceId);
  const scheduled = new Set([...dailyIds, ...otherIds]);
  const allOtherIds = sortByCanonicalOrder(
    allPoolIds.filter((id) => !scheduled.has(id))
  );
  return { dailyIds, otherIds, allOtherIds };
}

export default function SessionSelectionPage() {
  const navigate = useNavigate();
  const { lists, allPracticesPoolIds, deviceId } = useAppData();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [highlightedSession, setHighlightedSession] = useState<string | null>(null);
  const [allOtherExpanded, setAllOtherExpanded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const recentSessions = getRecentSessions();
  const sections = useMemo(
    () => buildPracticeSections(lists, allPracticesPoolIds),
    [lists, allPracticesPoolIds]
  );

  const togglePractice = (practiceId: string, fromAllOther = false) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(practiceId)) {
        next.delete(practiceId);
      } else {
        next.add(practiceId);
        if (fromAllOther) {
          const current = getPracticeLists();
          const updated = addToOther(current, practiceId);
          setPracticeLists(updated);
          syncPracticeListsToBackend(updated, deviceId, tryGetSupabase());
        }
      }
      return next;
    });
    if (highlightedSession) {
      const session = recentSessions.find((s) => s.id === highlightedSession);
      if (session) {
        const nextSelected = new Set(selected);
        if (nextSelected.has(practiceId)) nextSelected.delete(practiceId);
        else nextSelected.add(practiceId);
        const sig = sessionSignature([...nextSelected]);
        if (sig !== sessionSignature(session.practiceIds)) {
          setHighlightedSession(null);
        }
      }
    }
  };

  const onRecentTap = (sessionId: string, practiceIds: string[]) => {
    if (highlightedSession === sessionId) {
      setHighlightedSession(null);
      setSelected(new Set());
      return;
    }
    setHighlightedSession(sessionId);
    setSelected(new Set(practiceIds));
  };

  const startSession = () => {
    const ids = [...selected];
    setActiveSession(ids);
    navigate('/player');
  };

  if (loadError) {
    return (
      <AppShell>
        <div className={pageStyles.page}>
          <div className={pageStyles.scroll}>
            <div className={pageStyles.error}>
              <p>Couldn&apos;t load your practices</p>
              <Button onClick={() => setLoadError(false)}>Retry</Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className={pageStyles.page}>
        <div className={pageStyles.scroll}>
          {recentSessions.length > 0 && (
            <>
              <h2 className={pageStyles.sectionTitle}>Recent Sessions</h2>
              <div className={pageStyles.recentRow}>
                {recentSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`${pageStyles.recentCard} ${
                      highlightedSession === session.id ? pageStyles.recentCardSelected : ''
                    }`}
                    onClick={() => onRecentTap(session.id, session.practiceIds)}
                    aria-label="Recent session"
                  >
                    <div className={styles.recentCluster}>
                      {session.practiceIds.slice(0, 3).map((id) => {
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
                  </button>
                ))}
              </div>
            </>
          )}

          <h2 className={pageStyles.sectionTitle}>My Daily Practices</h2>
          {sections.dailyIds.map((id) => {
            const practice = getPracticeById(id);
            if (!practice) return null;
            return (
              <PracticeRow
                key={id}
                practiceId={id}
                name={practice.name}
                selected={selected.has(id)}
                onToggle={() => togglePractice(id)}
              />
            );
          })}

          <h2 className={pageStyles.sectionTitle}>My Other Practices</h2>
          {sections.otherIds.map((id) => {
            const practice = getPracticeById(id);
            if (!practice) return null;
            return (
              <PracticeRow
                key={id}
                practiceId={id}
                name={practice.name}
                selected={selected.has(id)}
                onToggle={() => togglePractice(id)}
              />
            );
          })}

          {sections.allOtherIds.length > 0 && (
            <section>
              <button
                type="button"
                className={pageStyles.collapsedHeader}
                onClick={() => setAllOtherExpanded((v) => !v)}
                aria-expanded={allOtherExpanded}
              >
                All Other Practices
                <span aria-hidden>{allOtherExpanded ? '−' : '+'}</span>
              </button>
              {allOtherExpanded && (
                <div className={pageStyles.collapsedBody}>
                  {sections.allOtherIds.map((id) => {
                    const practice = getPracticeById(id);
                    if (!practice) return null;
                    return (
                      <PracticeRow
                        key={id}
                        practiceId={id}
                        name={practice.name}
                        selected={selected.has(id)}
                        onToggle={() => togglePractice(id, true)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
        <div className={pageStyles.stickyFooter}>
          <Button onClick={startSession} disabled={selected.size === 0}>
            Start Session
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

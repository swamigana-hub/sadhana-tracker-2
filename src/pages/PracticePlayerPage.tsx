import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { PracticeIllustration } from '../components/practice/PracticeIllustration';
import {
  getActiveSession,
  clearActiveSession,
  updateActiveSessionIndex,
} from '../services/sessionStore';
import { useAppData } from '../context/AppDataContext';
import { useCompletionWriter } from '../hooks/useCompletionWriter';
import { tryGetSupabase } from '../lib/supabase/client';
import { getPracticeById } from '../data/practices';
import { getGuidedAudioUrl, hasGuidedAudio } from '../data/practiceAudio';
import styles from './PracticePlayerPage.module.css';

const BUFFER_SECONDS = 5;

export default function PracticePlayerPage() {
  const navigate = useNavigate();
  const [sessionVersion, setSessionVersion] = useState(0);
  const session = getActiveSession();
  const { deviceId, today, setLogs } = useAppData();
  const { completeSession } = useCompletionWriter({
    deviceId,
    client: tryGetSupabase(),
    onLogsChanged: setLogs,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);

  const practiceIds = session?.practiceIds ?? [];
  const currentIndex = session?.currentIndex ?? 0;
  const currentId = practiceIds[currentIndex];
  const practice = currentId ? getPracticeById(currentId) : undefined;
  const hasNext = currentIndex < practiceIds.length - 1;
  const audioUrl = currentId ? getGuidedAudioUrl(currentId) : null;
  const hasAudio = currentId ? hasGuidedAudio(currentId) : false;

  const finishSession = useCallback(() => {
    completeSession(practiceIds, today);
    clearActiveSession();
    navigate('/success', {
      state: { practiceIds, mode: 'session' },
    });
  }, [completeSession, navigate, practiceIds, today]);

  const advance = useCallback(() => {
    audioRef.current?.pause();
    if (hasNext) {
      updateActiveSessionIndex(currentIndex + 1);
      setCountdown(null);
      setNeedsTapToPlay(false);
      setSessionVersion((v) => v + 1);
    } else {
      finishSession();
    }
  }, [currentIndex, finishSession, hasNext]);

  const tryPlayAudio = useCallback((url: string) => {
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {
      setNeedsTapToPlay(true);
      setPendingAudioUrl(url);
    });
    audio.onended = () => {
      setCountdown(BUFFER_SECONDS);
    };
  }, []);

  useEffect(() => {
    if (!currentId) return;
    if (hasAudio && audioUrl) {
      tryPlayAudio(audioUrl);
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [currentId, audioUrl, hasAudio, tryPlayAudio, sessionVersion]);

  useEffect(() => {
    if (countdown == null) return;
    if (countdown <= 0) {
      advance();
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => (c != null ? c - 1 : null)), 1000);
    return () => window.clearTimeout(t);
  }, [countdown, advance]);

  if (!session || practiceIds.length === 0 || !practice) {
    navigate('/session', { replace: true });
    return null;
  }

  const sublabel =
    countdown != null && hasNext
      ? `continue to next practice in ${countdown} sec`
      : hasNext
        ? 'and continue to next'
        : undefined;

  return (
    <AppShell showBottomNav={false}>
      <div className={styles.page}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => navigate('/session')}
          aria-label="Close"
        >
          ×
        </button>
        <div className={styles.content}>
          <p className={styles.instruction}>Please close your eyes</p>
          <div className={styles.visual}>
            <img
              className={styles.centerPhoto}
              src="/player/center-photo.png"
              alt=""
              aria-hidden
            />
            <div className={styles.illustrationOverlay}>
              <PracticeIllustration practiceId={currentId} name={practice.name} size="card" />
            </div>
          </div>
          <h1 className={styles.practiceName}>{practice.name}</h1>
          {!hasAudio && <p className={styles.subline}>You can practice on your own</p>}
          {needsTapToPlay && pendingAudioUrl && (
            <div className={styles.autoplayPrompt}>
              Tap to start guided audio
              <Button
                variant="secondary"
                onClick={() => {
                  tryPlayAudio(pendingAudioUrl);
                  setNeedsTapToPlay(false);
                }}
              >
                Start audio
              </Button>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.completeBtn}>
            <Button onClick={advance}>Complete Practice</Button>
            {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

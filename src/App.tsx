import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import NamePage from './pages/setup/NamePage';
import WelcomePage from './pages/setup/WelcomePage';
import DailyPracticesPage from './pages/setup/DailyPracticesPage';
import DailySavedPage from './pages/setup/DailySavedPage';
import OtherPracticesPage from './pages/setup/OtherPracticesPage';
import HomePage from './pages/HomePage';
import SessionSelectionPage from './pages/SessionSelectionPage';
import PracticePlayerPage from './pages/PracticePlayerPage';
import SuccessPage from './pages/SuccessPage';
import LogPracticeSelectionPage from './pages/LogPracticeSelectionPage';
import YogaLayout from './pages/yoga/YogaLayout';
import AllPracticesPage from './pages/yoga/AllPracticesPage';
import MyPracticesPage from './pages/yoga/MyPracticesPage';
import ProgressPage from './pages/yoga/ProgressPage';
import { SetupGate, SetupOnly } from './components/routing/SetupGuard';
import { IosInstallBanner } from './components/pwa/IosInstallBanner';
import { getActiveSession } from './services/sessionStore';

function PlayerGate({ children }: { children: ReactNode }) {
  const session = getActiveSession();
  if (!session?.practiceIds.length) {
    return <Navigate to="/session" replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/setup"
          element={
            <SetupOnly>
              <WelcomePage />
            </SetupOnly>
          }
        />
        <Route
          path="/setup/name"
          element={
            <SetupOnly>
              <NamePage />
            </SetupOnly>
          }
        />
        <Route
          path="/setup/daily"
          element={
            <SetupOnly>
              <DailyPracticesPage />
            </SetupOnly>
          }
        />
        <Route
          path="/setup/daily-saved"
          element={
            <SetupOnly>
              <DailySavedPage />
            </SetupOnly>
          }
        />
        <Route
          path="/setup/other"
          element={
            <SetupOnly>
              <OtherPracticesPage />
            </SetupOnly>
          }
        />
        <Route
          path="/"
          element={
            <SetupGate>
              <HomePage />
            </SetupGate>
          }
        />
        <Route
          path="/session"
          element={
            <SetupGate>
              <SessionSelectionPage />
            </SetupGate>
          }
        />
        <Route
          path="/player"
          element={
            <SetupGate>
              <PlayerGate>
                <PracticePlayerPage />
              </PlayerGate>
            </SetupGate>
          }
        />
        <Route
          path="/success"
          element={
            <SetupGate>
              <SuccessPage />
            </SetupGate>
          }
        />
        <Route
          path="/log"
          element={
            <SetupGate>
              <LogPracticeSelectionPage />
            </SetupGate>
          }
        />
        <Route
          path="/yoga"
          element={
            <SetupGate>
              <YogaLayout />
            </SetupGate>
          }
        >
          <Route path="all" element={<AllPracticesPage />} />
          <Route path="my" element={<MyPracticesPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
      <IosInstallBanner />
    </>
  );
}

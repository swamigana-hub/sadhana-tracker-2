import { Navigate } from 'react-router-dom';
import { getSetupComplete } from '../../services/localStore';
import { isSetupReentry } from '../../services/setupReentry';
import type { ReactNode } from 'react';

export function SetupGate({ children }: { children: ReactNode }) {
  if (!getSetupComplete()) {
    return <Navigate to="/setup" replace />;
  }
  return children;
}

export function SetupOnly({ children }: { children: ReactNode }) {
  if (getSetupComplete() && !isSetupReentry()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SetupGate, SetupOnly } from './SetupGuard';
import { setSetupComplete } from '../../services/localStore';
import { setSetupReentry } from '../../services/setupReentry';

describe('SetupGuard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('SetupOnly redirects to main when setup is complete', () => {
    setSetupComplete(true);
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route
            path="/setup"
            element={
              <SetupOnly>
                <div>Setup</div>
              </SetupOnly>
            }
          />
          <Route path="/" element={<div>Main</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('SetupOnly allows setup routes during re-entry', () => {
    setSetupComplete(true);
    setSetupReentry(true);
    render(
      <MemoryRouter initialEntries={['/setup/daily']}>
        <Routes>
          <Route
            path="/setup/daily"
            element={
              <SetupOnly>
                <div>Daily setup</div>
              </SetupOnly>
            }
          />
          <Route path="/" element={<div>Main</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Daily setup')).toBeInTheDocument();
  });

  it('SetupGate redirects to setup when not complete', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/setup" element={<div>Setup</div>} />
          <Route
            path="/"
            element={
              <SetupGate>
                <div>Main</div>
              </SetupGate>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Setup')).toBeInTheDocument();
  });
});

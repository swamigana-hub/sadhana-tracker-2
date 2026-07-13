import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OtherPracticesPage from './OtherPracticesPage';
import MainPage from '../MainPage';
import { AppDataProvider } from '../../context/AppDataContext';
import * as deviceSessions from '../../lib/supabase/deviceSessions';
import * as supabaseClient from '../../lib/supabase/client';

vi.mock('../../services/deviceId', () => ({
  getOrCreateDeviceId: () => 'test-device',
  DEVICE_ID_KEY: 'device_id',
}));

function renderStep2() {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/setup/other', state: { daily: ['guru-pooja'] } }]}
    >
      <AppDataProvider supabaseClient={null}>
        <Routes>
          <Route path="/setup/other" element={<OtherPracticesPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </AppDataProvider>
    </MemoryRouter>
  );
}

describe('OtherPracticesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('redirects to daily step when daily selection is missing', () => {
    render(
      <MemoryRouter initialEntries={['/setup/other']}>
        <AppDataProvider supabaseClient={null}>
          <Routes>
            <Route path="/setup/other" element={<OtherPracticesPage />} />
            <Route path="/setup/daily" element={<div>Daily step</div>} />
          </Routes>
        </AppDataProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Daily step')).toBeInTheDocument();
  });

  it('renders other setup copy without a Daily section', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/setup/other', state: { daily: ['guru-pooja'] } }]}
      >
        <AppDataProvider supabaseClient={null}>
          <OtherPracticesPage />
        </AppDataProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Step 2/2')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Select any other practices you do occasionally',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('occasionally')).toHaveClass(/emphasis/);
    expect(screen.queryByText('My other practices')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Daily/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Guru Pooja')).not.toBeInTheDocument();
  });

  it('Done navigates to main with no visible error when device_sessions sync fails', async () => {
    vi.spyOn(supabaseClient, 'tryGetSupabase').mockReturnValue({} as never);
    vi.spyOn(deviceSessions, 'upsertDeviceSessionSafe').mockResolvedValue(false);

    renderStep2();

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      expect(screen.getByText('0/1')).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/row-level security policy/i)
    ).not.toBeInTheDocument();
  });

  it('has sticky footer with Done only', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/setup/other', state: { daily: ['guru-pooja'] } }]}
      >
        <AppDataProvider supabaseClient={null}>
          <OtherPracticesPage />
        </AppDataProvider>
      </MemoryRouter>
    );
    const footer = screen.getByTestId('setup-footer');
    expect(footer).toContainElement(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();
  });
});

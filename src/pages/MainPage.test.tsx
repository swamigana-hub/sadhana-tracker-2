import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from './MainPage';
import { AppDataProvider } from '../context/AppDataContext';
import { setPracticeLists, setSetupComplete } from '../services/localStore';

vi.mock('../services/deviceId', () => ({
  getOrCreateDeviceId: () => 'dev-test',
  DEVICE_ID_KEY: 'device_id',
}));

function renderMain() {
  return render(
    <MemoryRouter>
      <AppDataProvider supabaseClient={null}>
        <MainPage />
      </AppDataProvider>
    </MemoryRouter>
  );
}

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear();
    setSetupComplete(true);
    setPracticeLists(['guru-pooja'], ['isha-kriya']);
  });

  it('renders progress ring with percentage and side stats', () => {
    renderMain();
    expect(screen.getByText("Today's progress")).toBeInTheDocument();
    expect(screen.getByText('0/1')).toBeInTheDocument();
    expect(screen.getByText('% complete')).toBeInTheDocument();
    expect(screen.getByText('minutes')).toBeInTheDocument();
  });

  it('renders daily and other practice lists with checkboxes', () => {
    renderMain();
    expect(screen.getByLabelText('My daily practices')).toBeInTheDocument();
    expect(screen.getByLabelText('My other practices')).toBeInTheDocument();
    expect(screen.getByText('My practice progress')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Log additional practice' })).not.toBeInTheDocument();
  });

  it('does not show logged overlay after checking a daily practice', async () => {
    renderMain();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Guru Pooja' }));
    expect(screen.queryByText('Logged')).not.toBeInTheDocument();
  });

  it('links to edit practices screen from daily section', () => {
    renderMain();
    expect(screen.getByRole('link', { name: /Edit/ })).toHaveAttribute('href', '/practices/edit');
  });
});

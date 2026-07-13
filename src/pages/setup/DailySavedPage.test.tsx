import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DailySavedPage from './DailySavedPage';

describe('DailySavedPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows confirmation with daily list and auto-advances to other setup', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/setup/daily-saved', state: { daily: ['guru-pooja'] } }]}
      >
        <Routes>
          <Route path="/setup/daily-saved" element={<DailySavedPage />} />
          <Route path="/setup/other" element={<div>Other step</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Daily practices saved.')).toBeInTheDocument();
    expect(screen.getByText('Guru Pooja')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Other step')).toBeInTheDocument();
  });
});

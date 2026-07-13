import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NamePage from './NamePage';
import { setWelcomeSeen } from '../../services/setupProgress';

describe('NamePage', () => {
  beforeEach(() => {
    localStorage.clear();
    setWelcomeSeen(true);
  });

  it('submits on Enter like tapping Continue', () => {
    render(
      <MemoryRouter initialEntries={['/setup/name']}>
        <Routes>
          <Route path="/setup/name" element={<NamePage />} />
          <Route path="/setup/daily" element={<div>Daily step</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Your name'), {
      target: { value: 'Swami' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Continue' }).closest('form')!);

    expect(screen.getByText('Daily step')).toBeInTheDocument();
  });
});

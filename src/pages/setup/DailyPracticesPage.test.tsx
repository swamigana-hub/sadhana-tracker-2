import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DailyPracticesPage from './DailyPracticesPage';
import { setNameCaptured } from '../../services/setupProgress';
import { getSetupDraftDaily } from '../../services/setupDraft';

describe('DailyPracticesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    setNameCaptured(true);
  });

  it('renders step 1 label, sun icon, heading, and section labels', () => {
    render(
      <MemoryRouter>
        <DailyPracticesPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Step 1/2')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Choose practices you want to do daily',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('daily')).toHaveClass(/emphasis/);
    expect(screen.getByText('Commonly Practiced')).toBeInTheDocument();
    expect(screen.getByText('All Practices (A to Z)')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 1 of 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('disables Next until at least one practice is selected', () => {
    render(
      <MemoryRouter>
        <DailyPracticesPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Guru Pooja' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('persists daily draft selections as user toggles', () => {
    render(
      <MemoryRouter>
        <DailyPracticesPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Guru Pooja' }));
    expect(getSetupDraftDaily()).toContain('guru-pooja');
  });

  it('orders Shoonya second-last and Sadhguru\'s Presence last in Commonly Practiced', () => {
    render(
      <MemoryRouter>
        <DailyPracticesPage />
      </MemoryRouter>
    );
    const section = screen.getByText('Commonly Practiced').closest('section')!;
    const names = within(section)
      .getAllByRole('button')
      .map((btn) => btn.querySelector('span')?.textContent);
    expect(names.at(-2)).toBe('Shoonya');
    expect(names.at(-1)).toBe("Sadhguru's Presence");
  });
});

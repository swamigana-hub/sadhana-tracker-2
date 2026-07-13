import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';

describe('WelcomePage', () => {
  it('renders headline and Get started navigates to daily step', () => {
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<WelcomePage />} />
          <Route path="/setup/name" element={<div>Name step</div>} />
          <Route path="/setup/daily" element={<div>Daily step</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Your sadhana, in one place.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText('Name step')).toBeInTheDocument();
  });
});

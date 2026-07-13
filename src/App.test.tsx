import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import App from './App';

describe('App shell', () => {
  it('renders welcome and navigates through name to daily setup', () => {
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <AppDataProvider supabaseClient={null}>
          <App />
        </AppDataProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Your sadhana, in one place.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText("Let's put a name to your practice")).toBeInTheDocument();
    expect(
      screen.getByText('This helps us keep your progress connected to you.')
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Swami' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      screen.getByRole('heading', {
        name: 'Choose practices you want to do daily',
      })
    ).toBeInTheDocument();
  });
});

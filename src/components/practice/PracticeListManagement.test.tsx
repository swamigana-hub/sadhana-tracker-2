import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PracticeListManagement } from './PracticeListManagement';
import { placementsFromPracticeIds } from '../../services/practiceInstances';

const dailyPlacements = placementsFromPracticeIds(['guru-pooja']);
const otherPlacements = placementsFromPracticeIds(['isha-kriya']);

describe('PracticeListManagement', () => {
  it('renders daily and other sections with checkbox cards', () => {
    render(
      <MemoryRouter>
        <PracticeListManagement
          dailyPlacements={dailyPlacements}
          otherPlacements={otherPlacements}
          isPlacementLogged={() => false}
          canLogPlacement={() => true}
          onLogPlacement={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('My daily practices')).toBeInTheDocument();
    expect(screen.getByLabelText('My other practices')).toBeInTheDocument();
    expect(screen.getByText('Guru Pooja')).toBeInTheDocument();
    expect(screen.getByText('Isha Kriya')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Edit/ })).toHaveAttribute('href', '/practices/edit');
  });

  it('hides other practices section when there are no other placements', () => {
    render(
      <MemoryRouter>
        <PracticeListManagement
          dailyPlacements={dailyPlacements}
          otherPlacements={[]}
          isPlacementLogged={() => false}
          canLogPlacement={() => true}
          onLogPlacement={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('My daily practices')).toBeInTheDocument();
    expect(screen.queryByLabelText('My other practices')).not.toBeInTheDocument();
  });

  it('calls onLogPlacement when daily checkbox is checked', () => {
    const onLogPlacement = vi.fn();
    render(
      <MemoryRouter>
        <PracticeListManagement
          dailyPlacements={dailyPlacements}
          otherPlacements={[]}
          isPlacementLogged={() => false}
          canLogPlacement={() => true}
          onLogPlacement={onLogPlacement}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Guru Pooja' }));
    expect(onLogPlacement).toHaveBeenCalledWith(
      dailyPlacements[0].instanceId,
      'guru-pooja'
    );
  });
});

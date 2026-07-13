import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionSheet } from './SelectionSheet';
import { getPracticeById } from '../../data/practices';

describe('SelectionSheet', () => {
  const sections = [
    { title: 'My Other Practices', practiceIds: ['isha-kriya'] },
    { title: 'All Practices', practiceIds: ['aum-chanting'] },
  ];

  it('does not render when closed', () => {
    render(
      <SelectionSheet
        open={false}
        sections={sections}
        selectedIds={new Set()}
        onToggle={() => {}}
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders sections and confirms selection count', () => {
    const onConfirm = vi.fn();
    render(
      <SelectionSheet
        open
        sections={sections}
        selectedIds={new Set(['isha-kriya'])}
        onToggle={() => {}}
        onConfirm={onConfirm}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('My Other Practices')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm (1)' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <SelectionSheet
        open
        sections={sections}
        selectedIds={new Set()}
        onToggle={() => {}}
        onConfirm={() => {}}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByTestId('sheet-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders practice names from catalog', () => {
    render(
      <SelectionSheet
        open
        sections={sections}
        selectedIds={new Set()}
        onToggle={() => {}}
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(getPracticeById('isha-kriya')!.name)).toBeInTheDocument();
  });
});

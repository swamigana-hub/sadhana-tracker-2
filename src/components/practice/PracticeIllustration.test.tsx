import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeIllustration } from './PracticeIllustration';

describe('PracticeIllustration', () => {
  it('renders accessible illustration frame', () => {
    render(<PracticeIllustration practiceId="guru-pooja" name="Guru Pooja" />);
    expect(screen.getByRole('img', { name: 'Guru Pooja' })).toBeInTheDocument();
  });

  it('hides placeholder after image loads', () => {
    render(<PracticeIllustration practiceId="guru-pooja" name="Guru Pooja" />);
    expect(screen.getByTestId('illustration-placeholder')).toBeInTheDocument();
    const img = document.querySelector('img')!;
    fireEvent.load(img);
    expect(screen.queryByTestId('illustration-placeholder')).not.toBeInTheDocument();
  });

  it('shows gradient placeholder when image fails to load', () => {
    render(<PracticeIllustration practiceId="missing-id" name="Missing" />);
    const img = document.querySelector('img')!;
    fireEvent.error(img);
    expect(screen.getByTestId('illustration-placeholder')).toBeInTheDocument();
  });
});

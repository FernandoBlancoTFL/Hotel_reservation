import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('should render loading spinner', () => {
    render(<Loading />);
    // Assuming Loading component has a specific test id or text
    expect(screen.getByRole('status', { hidden: true }) || screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<Loading message="Loading rooms..." />);
    expect(screen.getByText('Loading rooms...')).toBeInTheDocument();
  });

  it('should render default loading state', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
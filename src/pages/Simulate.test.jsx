import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Simulate from './Simulate';

describe('Simulate Page', () => {
  it('renders simulator controls', () => {
    render(<Simulate />);
    expect(screen.getByText('Future Earth Simulator')).toBeInTheDocument();
  });

  it('runs simulation and shows results', async () => {
    render(<Simulate />);
    const simulateButton = screen.getByText('Generate Future Earth');
    fireEvent.click(simulateButton);
    
    // Result should appear after timeout
    await waitFor(() => {
      expect(screen.getByText('Tweak Habits')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

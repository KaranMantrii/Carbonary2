import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Scan from './Scan';
import { AppContext } from '../context/AppContext';

const mockContext = {
  addXp: vi.fn()
};

describe('Scan Page', () => {
  it('renders scan interface', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Scan />
      </AppContext.Provider>
    );
    expect(screen.getByText('Scan Receipt')).toBeInTheDocument();
    expect(screen.getByText('Tap to Scan')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });
});

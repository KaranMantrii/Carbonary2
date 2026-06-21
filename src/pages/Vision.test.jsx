import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Vision from './Vision';
import { AppContext } from '../context/AppContext';

const mockContext = {
  addXp: vi.fn()
};

// Mock video element
window.HTMLMediaElement.prototype.play = vi.fn();
window.HTMLMediaElement.prototype.pause = vi.fn();

// Mock mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }]
    }),
  },
});

describe('Vision Page', () => {
  it('renders vision interface', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Vision />
      </AppContext.Provider>
    );
    expect(screen.getByText(/Vision/)).toBeInTheDocument();
  });
});

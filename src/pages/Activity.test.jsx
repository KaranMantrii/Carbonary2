import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Activity from './Activity';
import { AppContext } from '../context/AppContext';

// Mock context values
const mockContext = {
  steps: 1000,
  setSteps: vi.fn(),
  screenTimeMinutes: 120,
  setScreenTimeMinutes: vi.fn(),
  setCarbonSaved: vi.fn(),
  setCarbonGenerated: vi.fn(),
  addXp: vi.fn()
};

describe('Activity Page', () => {
  it('renders correctly with context values', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Activity />
      </AppContext.Provider>
    );
    expect(screen.getByText('Live Activity')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('updates screen time and generates carbon', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Activity />
      </AppContext.Provider>
    );
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    expect(mockContext.setScreenTimeMinutes).toHaveBeenCalled();
    expect(mockContext.setCarbonGenerated).toHaveBeenCalled();
    expect(mockContext.addXp).toHaveBeenCalledWith(10);
  });
});

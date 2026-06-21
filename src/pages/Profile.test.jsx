import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Profile from './Profile';
import { AppContext } from '../context/AppContext';

const mockContext = {
  name: "Eco Warrior",
  setName: vi.fn(),
  goal: "emissions",
  setGoal: vi.fn(),
  xp: 150,
  rank: { level: 2, name: "Planet Protector" },
  twinStyle: "forest",
  setTwinStyle: vi.fn()
};

describe('Profile Page', () => {
  it('renders profile correctly', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Profile />
      </AppContext.Provider>
    );
    expect(screen.getByDisplayValue('Eco Warrior')).toBeInTheDocument();
    expect(screen.getByText('Planet Protector')).toBeInTheDocument();
  });

  it('can save profile', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <Profile />
      </AppContext.Provider>
    );
    const saveBtn = screen.getByText(/Save Profile/i);
    fireEvent.click(saveBtn);
    
    expect(mockContext.setName).toHaveBeenCalledWith("Eco Warrior");
    expect(mockContext.setGoal).toHaveBeenCalledWith("emissions");
    expect(screen.getByText('Saved Successfully!')).toBeInTheDocument();
  });
});

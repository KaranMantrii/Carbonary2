import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { AppContext } from '../context/AppContext';

const mockContext = {
  xp: 150,
  rank: { name: "Planet Protector", level: 2, next: 300 },
  name: "Eco Warrior",
  netCarbonScore: 50,
  carbonSaved: 100,
  carbonGenerated: 50,
  challenges: [{ id: 1, title: "Walk 5000 steps", progress: 0, target: 5000, xp: 50, completed: false }],
  twinState: "thriving",
  twinStyle: "forest",
  steps: 1000,
  screenTimeMinutes: 120
};

describe('Home Page', () => {
  it('renders correctly with context values', () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={mockContext}>
          <Home />
        </AppContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText('CARBON')).toBeInTheDocument();
    expect(screen.getByText(/Eco Warrior/)).toBeInTheDocument();
    expect(screen.getByText('Thriving')).toBeInTheDocument();
  });
});

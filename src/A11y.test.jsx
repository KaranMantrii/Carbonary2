import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect, describe, it, vi } from 'vitest';
import { AppContext } from './context/AppContext';
import { MemoryRouter } from 'react-router-dom';

import Activity from './pages/Activity';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Vision from './pages/Vision';
import League from './pages/League';
import Profile from './pages/Profile';
import Simulate from './pages/Simulate';
import Coach from './pages/Coach';
import BottomNav from './components/BottomNav';

expect.extend(toHaveNoViolations);

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockContext = {
  steps: 0, setSteps: vi.fn(),
  screenTimeMinutes: 0, setScreenTimeMinutes: vi.fn(),
  carbonSaved: 0, setCarbonSaved: vi.fn(),
  carbonGenerated: 0, setCarbonGenerated: vi.fn(),
  xp: 100, addXp: vi.fn(), systemStatus: 'NORMAL', twinState: 'healthy',
  name: 'Eco-Warrior', netCarbonScore: 0,
  rank: { next: 1000, level: 1, title: 'Novice' },
  leagueData: [{ id: 1, name: 'Eco-Warrior', score: 100, rank: 1 }],
  twinStyle: 'cyber', messages: [], challenges: []
};

const renderWithProviders = (component) => {
  return render(
    <AppContext.Provider value={mockContext}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </AppContext.Provider>
  );
};

describe('Comprehensive Accessibility Tests', () => {
  const pages = [
    { name: 'Home', component: <Home /> },
    { name: 'Activity', component: <Activity /> },
    { name: 'Scan', component: <Scan /> },
    { name: 'Vision', component: <Vision /> },
    { name: 'League', component: <League /> },
    { name: 'Profile', component: <Profile /> },
    { name: 'Simulate', component: <Simulate /> },
    { name: 'Coach', component: <Coach /> },
    { name: 'BottomNav', component: <BottomNav /> }
  ];

  pages.forEach(({ name, component }) => {
    it(`should have no accessibility violations on ${name}`, async () => {
      const { container } = renderWithProviders(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

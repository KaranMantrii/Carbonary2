import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect, describe, it } from 'vitest';
import Activity from './pages/Activity';
import { AppContext } from './context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './components/BottomNav';

expect.extend(toHaveNoViolations);

const mockContext = {
  steps: 0, setSteps: () => {},
  screenTimeMinutes: 0, setScreenTimeMinutes: () => {},
  setCarbonSaved: () => {}, setCarbonGenerated: () => {},
  addXp: () => {}, systemStatus: 'NORMAL'
};

describe('Accessibility tests', () => {
  it('Activity page should have no accessibility violations', async () => {
    const { container } = render(
      <AppContext.Provider value={mockContext}>
        <Activity />
      </AppContext.Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BottomNav should have no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

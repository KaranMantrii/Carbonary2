import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import League from './League';
import { AppContext } from '../context/AppContext';

const mockContext = {
  leagueData: [
    { rank: 1, name: "Sarah J.", score: 1200, isMe: false, badge: "Green Champion" },
    { rank: 3, name: "Eco Warrior", score: 890, isMe: true, badge: "" }
  ]
};

describe('League Page', () => {
  it('renders league data correctly', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <League />
      </AppContext.Provider>
    );
    expect(screen.getByText('Campus Green League')).toBeInTheDocument();
    expect(screen.getByText(/Sarah J\./)).toBeInTheDocument();
    expect(screen.getByText(/Eco Warrior/)).toBeInTheDocument();
  });
});

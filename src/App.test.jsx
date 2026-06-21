import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Routing & Context', () => {
  it('renders the layout correctly', () => {
    render(<App />);
    // Check if the bottom navigation exists
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

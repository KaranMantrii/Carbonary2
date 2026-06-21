import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AppProvider } from './context/AppContext';

describe('App Routing & Context', () => {
  it('renders the layout correctly', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    // Check if the bottom navigation exists
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Coach from './Coach';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Coach Page', () => {
  it('renders chat interface', () => {
    render(<Coach />);
    expect(screen.getByText('Carbon Coach')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask your coach anything...')).toBeInTheDocument();
  });

  it('can send a message', async () => {
    render(<Coach />);
    const input = screen.getByPlaceholderText('Ask your coach anything...');
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Hello Coach!' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Hello Coach!')).toBeInTheDocument();
    
    // Wait for mock bot response
    await waitFor(() => {
      expect(screen.getByRole('log').children.length).toBeGreaterThan(2);
    }, { timeout: 2000 });
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider, useAppContext } from './context/AppContext';

describe('AppContext Carbon Logic', () => {
  it('calculates netCarbonScore correctly based on habits', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.netCarbonScore).toBe(0);

    act(() => {
      result.current.addCarbonSaved(500); // Walked a lot
    });
    expect(result.current.netCarbonScore).toBe(500);
    expect(result.current.twinState).toBe('thriving');

    act(() => {
      result.current.addCarbonGenerated(600); // High screen time
    });
    expect(result.current.netCarbonScore).toBe(-100);
    expect(result.current.twinState).toBe('struggling');
  });
});

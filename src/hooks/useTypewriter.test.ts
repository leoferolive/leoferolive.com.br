import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from './useTypewriter';

describe('useTypewriter', () => {
  it('retorna texto completo imediatamente quando disabled', () => {
    const { result } = renderHook(() => useTypewriter('hello', { disabled: true }));
    expect(result.current).toBe('hello');
  });

  it('progressivamente revela caracteres', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTypewriter('hi', { speedMs: 10 }));
    expect(result.current).toBe('');
    await act(async () => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('h');
    await act(async () => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('hi');
    vi.useRealTimers();
  });
});

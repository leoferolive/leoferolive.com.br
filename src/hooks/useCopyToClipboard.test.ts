import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';

describe('useCopyToClipboard', () => {
  it('copia para clipboard e seta copied true por 2s', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => { await result.current.copy('hi'); });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hi');
    expect(result.current.copied).toBe(true);

    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(result.current.copied).toBe(false);
    vi.useRealTimers();
  });
});

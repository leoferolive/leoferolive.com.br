import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { useChatSession } from './useChatSession';

function wrapper({ children }: { children: ReactNode }) {
  return <I18nProvider lang="pt">{children}</I18nProvider>;
}

function makeSseResponse(chunks: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return new Response(stream, {
    status,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('useChatSession', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('persists the sessionId in sessionStorage', () => {
    const { result } = renderHook(() => useChatSession(), { wrapper });
    expect(result.current.sessionId).toBeTruthy();
    expect(sessionStorage.getItem('chat:sessionId')).toBe(
      result.current.sessionId,
    );

    // a fresh hook reuses the same id
    const { result: r2 } = renderHook(() => useChatSession(), { wrapper });
    expect(r2.current.sessionId).toBe(result.current.sessionId);
  });

  it('grows the history with user + streamed assistant message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        makeSseResponse([
          'data: {"type":"token","value":"olá"}\n\n',
          'data: {"type":"token","value":" mundo"}\n\n',
          'data: {"type":"done"}\n\n',
        ]),
      ),
    );

    const { result } = renderHook(() => useChatSession(), { wrapper });
    await act(async () => {
      await result.current.send('e ai?');
    });

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(false);
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'e ai?',
    });
    expect(result.current.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'olá mundo',
      pending: false,
    });
  });

  it('reset clears history and rotates the sessionId', async () => {
    const { result } = renderHook(() => useChatSession(), { wrapper });
    const firstId = result.current.sessionId;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        makeSseResponse([
          'data: {"type":"token","value":"hi"}\n\n',
          'data: {"type":"done"}\n\n',
        ]),
      ),
    );
    await act(async () => {
      await result.current.send('hello');
    });
    expect(result.current.messages.length).toBeGreaterThan(0);

    act(() => {
      result.current.reset();
    });
    expect(result.current.messages).toEqual([]);
    expect(result.current.sessionId).not.toBe(firstId);
    expect(sessionStorage.getItem('chat:sessionId')).toBe(
      result.current.sessionId,
    );
  });

  it('surfaces an error when the stream reports rate_limit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 429 })),
    );

    const { result } = renderHook(() => useChatSession(), { wrapper });
    await act(async () => {
      await result.current.send('oi');
    });
    await waitFor(() => {
      expect(result.current.isStreaming).toBe(false);
    });
    expect(result.current.error).toBe('rate_limit');
    // assistant placeholder was removed; user message remains
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('user');
  });

  it('only requests a turnstile token on the first send of a session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          makeSseResponse([
            'data: {"type":"token","value":"."}\n\n',
            'data: {"type":"done"}\n\n',
          ]),
        ),
      ),
    );
    const getToken = vi.fn().mockResolvedValue('cf-token');

    const { result } = renderHook(() => useChatSession(), { wrapper });

    await act(async () => {
      await result.current.send('first', getToken);
    });
    await act(async () => {
      await result.current.send('second', getToken);
    });

    expect(getToken).toHaveBeenCalledTimes(1);
  });
});

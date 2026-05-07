import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { streamChat } from './ChatStream';
import type { StreamRequest } from './types';

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

const baseReq: StreamRequest = {
  sessionId: 'test-session',
  messages: [{ role: 'user', content: 'oi' }],
  lang: 'pt',
  turnstileToken: null,
};

describe('streamChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits tokens in order and resolves on done', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      makeSseResponse([
        'data: {"type":"token","value":"Hello"}\n\n',
        'data: {"type":"token","value":" world"}\n\n',
        'data: {"type":"done","model":"gemini-2.5-flash"}\n\n',
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const tokens: string[] = [];
    const onDone = vi.fn();
    const onError = vi.fn();
    await streamChat(
      baseReq,
      {
        onToken: (t) => tokens.push(t),
        onDone,
        onError,
      },
    );

    expect(tokens).toEqual(['Hello', ' world']);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      sessionId: 'test-session',
      lang: 'pt',
    });
  });

  it('handles tokens split across chunks', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      makeSseResponse([
        'data: {"type":"token",',
        '"value":"part"}\n\n' +
          'data: {"type":"token","value":"-two"}\n\n',
        'data: {"type":"done"}\n\n',
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const tokens: string[] = [];
    await streamChat(baseReq, {
      onToken: (t) => tokens.push(t),
      onDone: () => {},
      onError: () => {},
    });
    expect(tokens).toEqual(['part', '-two']);
  });

  it('reports an error event from the backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        makeSseResponse([
          'data: {"type":"error","message":"rate_limit"}\n\n',
        ]),
      ),
    );
    const onError = vi.fn();
    const onDone = vi.fn();
    await streamChat(baseReq, {
      onToken: () => {},
      onDone,
      onError,
    });
    expect(onError).toHaveBeenCalledWith('rate_limit');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('maps HTTP 429 to rate_limit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('', { status: 429 }),
      ),
    );
    const onError = vi.fn();
    await streamChat(baseReq, {
      onToken: () => {},
      onDone: () => {},
      onError,
    });
    expect(onError).toHaveBeenCalledWith('rate_limit');
  });

  it('maps HTTP 503 to cost_gate', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
    );
    const onError = vi.fn();
    await streamChat(baseReq, {
      onToken: () => {},
      onDone: () => {},
      onError,
    });
    expect(onError).toHaveBeenCalledWith('cost_gate');
  });

  it('handles CRLF separators (sse-starlette default)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      makeSseResponse([
        'data: {"type":"token","value":"crlf"}\r\n\r\n',
        'data: {"type":"token","value":"-ok"}\r\n\r\n',
        'data: {"type":"done"}\r\n\r\n',
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const tokens: string[] = [];
    const onDone = vi.fn();
    await streamChat(baseReq, {
      onToken: (t) => tokens.push(t),
      onDone,
      onError: () => {},
    });
    expect(tokens).toEqual(['crlf', '-ok']);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('reports network error when stream closes without a done event', async () => {
    // Backend hangs up after a few tokens — no `done`, no `error`.
    const fetchMock = vi.fn().mockResolvedValue(
      makeSseResponse([
        'data: {"type":"token","value":"partial"}\n\n',
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const onDone = vi.fn();
    const onError = vi.fn();
    await streamChat(baseReq, {
      onToken: () => {},
      onDone,
      onError,
    });
    expect(onError).toHaveBeenCalledWith('network');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('reports network errors when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('boom')),
    );
    const onError = vi.fn();
    await streamChat(baseReq, {
      onToken: () => {},
      onDone: () => {},
      onError,
    });
    expect(onError).toHaveBeenCalledWith('network');
  });
});

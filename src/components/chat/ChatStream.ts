import type { StreamCallbacks, StreamEvent, StreamRequest } from './types';

const API_BASE = (import.meta.env.VITE_CHAT_API_URL as string | undefined) ?? '';

/**
 * Streams a chat completion via POST + SSE-over-fetch.
 *
 * We can't use `EventSource` here because it only supports GET; the chat-api
 * expects a POST body with messages, lang and the optional Turnstile token.
 */
export async function streamChat(
  req: StreamRequest,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const { onToken, onDone, onError } = callbacks;
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(req),
      signal,
    });
  } catch (err) {
    if ((err as { name?: string } | null)?.name === 'AbortError') return;
    onError('network');
    return;
  }

  if (!response.ok || !response.body) {
    if (response.status === 429) onError('rate_limit');
    else if (response.status === 503) onError('cost_gate');
    else onError('network');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE messages separated by a blank line. The spec uses CRLFCRLF but
      // some servers emit LFLF, so accept both.
      const sepRe = /\r?\n\r?\n/;
      let match = buffer.match(sepRe);
      while (match && typeof match.index === 'number') {
        const rawEvent = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const parsed = parseSseEvent(rawEvent);
        if (parsed) {
          if (parsed.type === 'token') onToken(parsed.value);
          else if (parsed.type === 'done') {
            onDone(parsed);
            return;
          } else if (parsed.type === 'error') {
            onError(parsed.message || 'generic');
            return;
          }
        }
        match = buffer.match(sepRe);
      }
    }
  } catch (err) {
    if ((err as { name?: string } | null)?.name === 'AbortError') return;
    onError('network');
  }
}

function parseSseEvent(raw: string): StreamEvent | null {
  // Each event is a set of `field: value` lines. We only care about `data:`.
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^ /, ''));
    }
  }
  if (dataLines.length === 0) return null;
  const payload = dataLines.join('\n');
  try {
    const obj = JSON.parse(payload) as StreamEvent;
    if (obj && typeof obj === 'object' && 'type' in obj) return obj;
    return null;
  } catch {
    return null;
  }
}

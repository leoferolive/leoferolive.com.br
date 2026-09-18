import type { StreamCallbacks, StreamEvent, StreamRequest } from './types';

const API_BASE = (import.meta.env.VITE_CHAT_API_URL as string | undefined) ?? '';

/**
 * Streams a chat completion via POST + SSE-over-fetch.
 *
 * We can't use `EventSource` here because it only supports GET; the chat-api
 * expects a POST body with messages, lang and the optional Turnstile token.
 */
/* eslint-disable max-lines-per-function, complexity -- TODO(quality-gate): refatorar até 2026-08-11 */
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
    // 429 from the backend can come as an SSE body with a specific reason
    // (session_limit_reached / ip_daily_limit) or as a bare slowapi
    // RateLimitExceeded. Try to read the body to disambiguate.
    if (response.status === 429) {
      const reason = await readErrorReason(response);
      if (reason === 'session_limit_reached') onError('session_limit');
      else if (reason === 'ip_daily_limit') onError('ip_daily_limit');
      else onError('rate_limit');
    } else if (response.status === 503) {
      onError('cost_gate');
    } else if (response.status === 422 || response.status === 400) {
      onError('bad_request');
    } else {
      onError('network');
    }
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
    return;
  }

  // Stream closed without an explicit `done` or `error` event (server hung
  // up, proxy cut the connection, etc.). Surface it instead of leaving the
  // assistant message stuck on `pending`.
  onError('network');
}
/* eslint-enable max-lines-per-function, complexity */

/**
 * Read the body of a non-OK response and return the embedded reason, if any.
 * The chat-api emits SSE `data: {"type":"error","message":"..."}` for the
 * 429 limits with detail; bare slowapi 429s have a JSON body without that
 * shape, so we just return null and let the caller fall back to `rate_limit`.
 */
async function readErrorReason(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text) return null;
    const sseMatch = text.match(/data:\s*(\{[^\n}]*"message"\s*:\s*"([^"]+)"[^}]*\})/);
    if (sseMatch) return sseMatch[2];
    const obj = JSON.parse(text);
    if (typeof obj?.detail === 'string') return obj.detail;
    if (typeof obj?.message === 'string') return obj.message;
  } catch {
    // ignore
  }
  return null;
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

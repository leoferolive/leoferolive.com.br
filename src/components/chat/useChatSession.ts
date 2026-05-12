import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n/context';
import { streamChat } from './ChatStream';
import type { ChatMessage } from './types';

const SESSION_KEY = 'chat:sessionId';
const FIRST_TOKEN_KEY = 'chat:firstTokenSent';
export const USER_NAME_KEY = 'chat:userName';

// Letters, spaces, ASCII apostrophe, curly apostrophe (U+2019, iOS
// auto-corrects to this), period, hyphen. 1-40 chars.
export const NAME_RE = /^[\p{L} '’.-]{1,40}$/u;

export function loadUserName(): string | null {
  try {
    const stored = window.localStorage.getItem(USER_NAME_KEY);
    if (stored && NAME_RE.test(stored)) return stored;
  } catch {
    // localStorage may be unavailable.
  }
  return null;
}

export function saveUserName(value: string): void {
  try {
    window.localStorage.setItem(USER_NAME_KEY, value);
  } catch {
    // ignore
  }
}

export function clearUserName(): void {
  try {
    window.localStorage.removeItem(USER_NAME_KEY);
  } catch {
    // ignore
  }
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback for older jsdom envs.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadSessionId(): string {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
  } catch {
    // sessionStorage may be unavailable (privacy mode).
  }
  const fresh = genId();
  try {
    window.sessionStorage.setItem(SESSION_KEY, fresh);
  } catch {
    // ignore
  }
  return fresh;
}

export type ChatErrorCode =
  | 'network'
  | 'rate_limit'
  | 'cost_gate'
  | 'session_limit'
  | 'ip_daily_limit'
  | 'bad_request'
  | 'generic';

export interface UseChatSession {
  sessionId: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  error: ChatErrorCode | null;
  userName: string | null;
  setUserName: (value: string | null) => void;
  send: (
    text: string,
    getTurnstileToken?: () => Promise<string | null>,
  ) => Promise<void>;
  reset: () => void;
  cancel: () => void;
}

/* eslint-disable max-lines-per-function -- TODO(quality-gate): refatorar até 2026-08-11 */
export function useChatSession(): UseChatSession {
  const { lang } = useI18n();
  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const [sessionId, setSessionId] = useState<string>(() => loadSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ChatErrorCode | null>(null);
  const [userName, setUserNameState] = useState<string | null>(() => loadUserName());
  const abortRef = useRef<AbortController | null>(null);

  const setUserName = useCallback((value: string | null) => {
    if (value === null) {
      clearUserName();
      setUserNameState(null);
      return;
    }
    const trimmed = value.trim();
    if (!NAME_RE.test(trimmed)) return;
    saveUserName(trimmed);
    setUserNameState(trimmed);
  }, []);

  const send = useCallback(
    async (
      text: string,
      getTurnstileToken?: () => Promise<string | null>,
    ): Promise<void> => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: trimmed,
      };
      const assistantId = genId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        pending: true,
      };

      const nextMessages = [...messages, userMsg];
      setMessages([...nextMessages, assistantMsg]);
      setIsStreaming(true);

      let turnstileToken: string | null = null;
      const firstTokenAlreadySent =
        (() => {
          try {
            return (
              window.sessionStorage.getItem(FIRST_TOKEN_KEY) === sessionId
            );
          } catch {
            return false;
          }
        })();
      if (!firstTokenAlreadySent && getTurnstileToken) {
        try {
          turnstileToken = await getTurnstileToken();
        } catch {
          turnstileToken = null;
        }
      }

      const controller = new AbortController();
      abortRef.current = controller;

      await streamChat(
        {
          sessionId,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          lang: langRef.current,
          turnstileToken,
          userName,
        },
        {
          onToken: (value) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + value }
                  : m,
              ),
            );
          },
          onDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, pending: false } : m,
              ),
            );
            setIsStreaming(false);
            try {
              window.sessionStorage.setItem(FIRST_TOKEN_KEY, sessionId);
            } catch {
              // ignore
            }
          },
          onError: (code) => {
            const known: ChatErrorCode[] = [
              'rate_limit',
              'cost_gate',
              'network',
              'session_limit',
              'ip_daily_limit',
              'bad_request',
            ];
            setError(
              (known as string[]).includes(code) ? (code as ChatErrorCode) : 'generic',
            );
            setMessages((prev) =>
              prev.filter((m) => m.id !== assistantId),
            );
            setIsStreaming(false);
          },
        },
        controller.signal,
      );
    },
    [isStreaming, messages, sessionId, userName],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    const fresh = genId();
    try {
      window.sessionStorage.setItem(SESSION_KEY, fresh);
      window.sessionStorage.removeItem(FIRST_TOKEN_KEY);
    } catch {
      // ignore
    }
    setSessionId(fresh);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  return useMemo(
    () => ({
      sessionId,
      messages,
      isStreaming,
      error,
      userName,
      setUserName,
      send,
      reset,
      cancel,
    }),
    [sessionId, messages, isStreaming, error, userName, setUserName, send, reset, cancel],
  );
}
/* eslint-enable max-lines-per-function */

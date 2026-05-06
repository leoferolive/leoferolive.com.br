import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n/context';
import { streamChat } from './ChatStream';
import type { ChatMessage } from './types';

const SESSION_KEY = 'chat:sessionId';
const FIRST_TOKEN_KEY = 'chat:firstTokenSent';

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
  | 'generic';

export interface UseChatSession {
  sessionId: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  error: ChatErrorCode | null;
  send: (
    text: string,
    getTurnstileToken?: () => Promise<string | null>,
  ) => Promise<void>;
  reset: () => void;
  cancel: () => void;
}

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
  const abortRef = useRef<AbortController | null>(null);

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
            setError(
              code === 'rate_limit' ||
                code === 'cost_gate' ||
                code === 'network'
                ? code
                : 'generic',
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
    [isStreaming, messages, sessionId],
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
    () => ({ sessionId, messages, isStreaming, error, send, reset, cancel }),
    [sessionId, messages, isStreaming, error, send, reset, cancel],
  );
}

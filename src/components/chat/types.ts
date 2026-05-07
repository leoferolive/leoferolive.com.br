import type { Lang } from '@/i18n/types';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Set to true while the assistant message is still streaming. */
  pending?: boolean;
}

export interface StreamRequest {
  sessionId: string;
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
  lang: Lang;
  turnstileToken: string | null;
}

export type StreamEvent =
  | { type: 'token'; value: string }
  | {
      type: 'done';
      model?: string;
      tokens?: { prompt?: number; completion?: number };
    }
  | { type: 'error'; message: string };

export interface StreamCallbacks {
  onToken: (value: string) => void;
  onDone: (event: Extract<StreamEvent, { type: 'done' }>) => void;
  onError: (message: string) => void;
}

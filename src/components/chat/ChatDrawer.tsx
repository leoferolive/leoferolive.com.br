import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useChatSession, type ChatErrorCode } from './useChatSession';
import { getTurnstileToken } from './TurnstileWidget';
import type { ChatMessage as ChatMessageType } from './types';

type Props = {
  open: boolean;
  onClose: () => void;
};

function errorKey(code: ChatErrorCode): keyof ReturnType<typeof useT>['chat'] {
  switch (code) {
    case 'rate_limit':
      return 'error_rate_limit';
    case 'cost_gate':
      return 'error_cost_gate';
    case 'network':
      return 'error_network';
    default:
      return 'error_generic';
  }
}

export function ChatDrawer({ open, onClose }: Props) {
  const t = useT();
  const session = useChatSession();
  const [draft, setDraft] = useState('');
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus the textarea when opened
  useEffect(() => {
    if (!open) return;
    const ta = inputContainerRef.current?.querySelector('textarea');
    ta?.focus();
  }, [open]);

  // Autoscroll to bottom on new messages
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, session.messages]);

  const welcomeMessage: ChatMessageType = useMemo(
    () => ({
      id: 'welcome',
      role: 'assistant',
      content: t.chat.welcome,
    }),
    [t.chat.welcome],
  );

  const messages =
    session.messages.length === 0 ? [welcomeMessage] : session.messages;

  const handleSubmit = () => {
    if (!draft.trim() || session.isStreaming) return;
    const text = draft;
    setDraft('');
    void session.send(text, getTurnstileToken);
  };

  return (
    <>
      {/* Backdrop (mobile-only visual cue, click closes) */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 md:bg-transparent md:backdrop-blur-0 ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.chat.drawer_title}
        aria-hidden={!open}
        data-testid="chat-drawer"
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-full flex-col border-l border-border bg-bg-surface shadow-2xl transition-transform duration-[240ms] ease-out md:w-[420px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between gap-2 border-b border-border bg-bg-base px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {t.chat.drawer_title}
            </span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-faint">
              {t.chat.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.chat.close}
            className="flex h-8 w-8 items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {session.error && (
            <div
              role="alert"
              className="rounded border border-err/40 bg-err/5 px-3 py-2 text-[13px] text-err"
            >
              {t.chat[errorKey(session.error)]}
            </div>
          )}
        </div>

        <div ref={inputContainerRef}>
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            disabled={session.isStreaming}
            placeholder={t.chat.placeholder}
            sendLabel={t.chat.send}
          />
          <p className="px-3 pb-3 pt-1 text-[11px] leading-snug text-text-faint">
            {t.chat.disclaimer}
          </p>
        </div>
      </aside>
    </>
  );
}

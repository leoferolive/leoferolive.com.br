import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { NAME_RE, useChatSession, type ChatErrorCode } from './useChatSession';
import { getTurnstileToken } from './TurnstileWidget';
import type { ChatMessage as ChatMessageType } from './types';

type Seed = { value: string; nonce: number } | null;

type Props = {
  open: boolean;
  onClose: () => void;
  seed?: Seed;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function errorKey(code: ChatErrorCode): keyof ReturnType<typeof useT>['chat'] {
  switch (code) {
    case 'rate_limit':
      return 'error_rate_limit';
    case 'cost_gate':
      return 'error_cost_gate';
    case 'session_limit':
      return 'error_session_limit';
    case 'ip_daily_limit':
      return 'error_ip_daily_limit';
    case 'bad_request':
      return 'error_bad_request';
    case 'network':
      return 'error_network';
    default:
      return 'error_generic';
  }
}

// eslint-disable-next-line max-lines-per-function -- TODO(quality-gate): refatorar até 2026-08-11
export function ChatDrawer({ open, onClose, seed }: Props) {
  const t = useT();
  const session = useChatSession();
  const [draft, setDraft] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [nameError, setNameError] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const lastAppliedNonceRef = useRef<number | null>(null);

  const needsName = session.userName === null;

  // Apply a seed when its nonce changes, regardless of open transitions —
  // this covers two cases:
  //   1) drawer was closed and a handoff opens it with a seed
  //   2) drawer is already open and a different handoff fires a new seed
  // The nonce is stamped per dispatch in openChat() so the same seed string
  // fired twice still triggers prefill.
  useEffect(() => {
    if (!open || !seed) return;
    if (lastAppliedNonceRef.current === seed.nonce) return;
    lastAppliedNonceRef.current = seed.nonce;
    setDraft(seed.value);
    // After applying, focus textarea and put caret at end so it reads as an
    // editable suggestion, not a placeholder.
    requestAnimationFrame(() => {
      const ta = inputContainerRef.current?.querySelector('textarea');
      if (!ta) return;
      ta.focus();
      const end = ta.value.length;
      ta.setSelectionRange(end, end);
    });
  }, [open, seed]);

  // Forget the last-applied nonce when the drawer closes so reopening with
  // the same seed value (different nonce) still prefills.
  useEffect(() => {
    if (!open) lastAppliedNonceRef.current = null;
  }, [open]);

  // ESC closes + Tab focus trap. The drawer claims aria-modal=true so we must
  // keep keyboard focus inside it while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = drawerRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('aria-hidden'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus the textarea when opened, and restore focus to the previously
  // focused element (typically the FAB) when closed. When the name gate is
  // showing, focus the name input instead.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      if (needsName) {
        nameInputRef.current?.focus();
      } else {
        const ta = inputContainerRef.current?.querySelector('textarea');
        ta?.focus();
      }
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [open, needsName]);

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

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nameDraft.trim();
    if (!NAME_RE.test(trimmed)) {
      setNameError(true);
      return;
    }
    setNameError(false);
    session.setUserName(trimmed);
    setNameDraft('');
  };

  const handleChangeName = () => {
    // Clear the name first so the gate paints; reset the conversation
    // afterwards. If reset() ever fails (storage quota), the gate is
    // already showing — we never end up nameless-with-history.
    session.setUserName(null);
    session.reset();
    setNameDraft('');
    setNameError(false);
    // The "Trocar nome" button unmounts in the same commit, so explicit
    // focus on the next paint avoids focus falling back to <body>.
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
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
        // `inert` prevents the closed drawer from being focusable via Tab
        // and from being read by screen readers. Cast covers React 18 types
        // that haven't added the attribute yet.
        {...({ inert: !open ? '' : undefined } as { inert?: string })}
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
            {session.userName && (
              <button
                type="button"
                onClick={handleChangeName}
                className="ml-2 truncate rounded px-1.5 py-0.5 text-[11px] text-text-faint hover:bg-bg-elevated hover:text-text-primary"
                aria-label={`${t.chat.change_name} (${session.userName})`}
              >
                {session.userName} · {t.chat.change_name}
              </button>
            )}
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

        {needsName ? (
          <form
            onSubmit={handleNameSubmit}
            data-testid="chat-name-gate"
            className="flex flex-1 flex-col items-stretch justify-center gap-3 px-6 py-8"
          >
            <h2 className="text-base font-semibold text-text-primary">
              {t.chat.name_prompt_title}
            </h2>
            <p className="text-[13px] leading-snug text-text-muted">
              {t.chat.name_prompt_description}
            </p>
            <label htmlFor="chat-name-input" className="sr-only">
              {t.chat.name_prompt_placeholder}
            </label>
            <input
              ref={nameInputRef}
              id="chat-name-input"
              type="text"
              value={nameDraft}
              onChange={(e) => {
                setNameDraft(e.target.value);
                if (nameError) setNameError(false);
              }}
              maxLength={40}
              autoComplete="given-name"
              placeholder={t.chat.name_prompt_placeholder}
              aria-invalid={nameError}
              aria-describedby={nameError ? 'chat-name-error' : undefined}
              className="rounded border border-border bg-bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-text-primary"
            />
            {nameError && (
              <p
                id="chat-name-error"
                role="alert"
                className="text-[12px] text-err"
              >
                {t.chat.name_prompt_invalid}
              </p>
            )}
            <button
              type="submit"
              className="rounded bg-text-primary px-3 py-2 text-sm font-medium text-bg-base hover:opacity-90"
            >
              {t.chat.name_prompt_cta}
            </button>
          </form>
        ) : (
          <>
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
          </>
        )}
      </aside>
    </>
  );
}

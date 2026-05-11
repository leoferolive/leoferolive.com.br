import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder: string;
  sendLabel: string;
  maxLength?: number;
};

const MAX_LINES = 5;
const LINE_HEIGHT = 22; // px, matches text-[14px] + leading-relaxed-ish
// Mirror the backend cap. The server is the source of truth (rejects > this
// with 422), this is purely a UX hint so the user doesn't waste keystrokes.
export const DEFAULT_MAX_LENGTH = 800;

// eslint-disable-next-line max-lines-per-function -- TODO(quality-gate): refatorar até 2026-08-11
export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder,
  sendLabel,
  maxLength = DEFAULT_MAX_LENGTH,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = LINE_HEIGHT * MAX_LINES + 16; // padding fudge
    const next = Math.min(ta.scrollHeight, max);
    ta.style.height = `${next}px`;
    ta.style.overflowY = ta.scrollHeight > max ? 'auto' : 'hidden';
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) onSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // maxLength on <textarea> prevents pasting longer; keep an extra
    // .slice belt-and-braces in case it's ever bypassed.
    onChange(e.target.value.slice(0, maxLength));
  };

  const canSend =
    !disabled && value.trim().length > 0 && value.length <= maxLength;
  const remaining = maxLength - value.length;
  // Show the counter only when the user is approaching the cap to avoid
  // visual noise on short messages.
  const showCounter = value.length >= maxLength * 0.75;
  const nearLimit = remaining <= 50;

  return (
    <div className="border-t border-border bg-bg-surface">
      <div className="flex items-end gap-2 p-3 pb-1">
        <textarea
          ref={taRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          maxLength={maxLength}
          disabled={disabled}
          className="flex-1 resize-none rounded border border-border bg-bg-base px-3 py-2 text-[14px] text-text-primary placeholder:text-text-faint focus:border-border-hover focus:outline-none disabled:opacity-60"
          aria-label={placeholder}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSend}
          aria-label={sendLabel}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-bg-elevated text-text-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-primary"
        >
          <Send size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div
        className={`px-3 pb-2 text-right text-[11px] tabular-nums transition-opacity ${
          showCounter ? 'opacity-100' : 'opacity-0'
        } ${nearLimit ? 'text-accent' : 'text-text-faint'}`}
        aria-live="polite"
      >
        {value.length}/{maxLength}
      </div>
    </div>
  );
}

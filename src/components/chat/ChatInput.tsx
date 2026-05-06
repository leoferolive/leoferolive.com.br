import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder: string;
  sendLabel: string;
};

const MAX_LINES = 5;
const LINE_HEIGHT = 22; // px, matches text-[14px] + leading-relaxed-ish

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder,
  sendLabel,
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
    onChange(e.target.value);
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="flex items-end gap-2 border-t border-border bg-bg-surface p-3">
      <textarea
        ref={taRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
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
  );
}

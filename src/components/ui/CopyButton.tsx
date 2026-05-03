import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type Props = { value: string; ariaLabel: string; copyLabel: string; copiedLabel: string };

export function CopyButton({ value, ariaLabel, copyLabel, copiedLabel }: Props) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs hover:border-border-hover min-h-[44px]"
      onClick={() => copy(value)}
    >
      {copied ? (
        <>
          <Check size={14} strokeWidth={1.5} className="text-ok" aria-hidden="true" />
          <span aria-live="polite" className="text-ok">
            {copiedLabel}
          </span>
        </>
      ) : (
        <>
          <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{copyLabel}</span>
        </>
      )}
    </button>
  );
}

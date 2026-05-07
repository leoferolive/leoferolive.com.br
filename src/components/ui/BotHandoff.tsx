import { MessageSquare } from 'lucide-react';
import { openChat } from '@/components/chat/openChat';

type Props = {
  label: string;
  seed: string;
  className?: string;
};

export function BotHandoff({ label, seed, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => openChat(seed)}
      aria-haspopup="dialog"
      aria-controls="chat-drawer"
      className={`group inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:rounded ${className ?? ''}`}
    >
      <MessageSquare
        size={14}
        strokeWidth={1.75}
        aria-hidden="true"
        className="opacity-70 group-hover:opacity-100"
      />
      <span>{label}</span>
    </button>
  );
}

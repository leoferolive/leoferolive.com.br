import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { ChatDrawer } from './ChatDrawer';
import { CHAT_OPEN_EVENT, type OpenChatDetail } from './openChat';

type Seed = { value: string; nonce: number } | null;

export function ChatFab() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<Seed>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenChatDetail>).detail;
      if (detail?.seed) {
        setSeed({ value: detail.seed, nonce: detail.nonce });
      } else {
        setSeed(null);
      }
      setOpen(true);
    };
    window.addEventListener(CHAT_OPEN_EVENT, handler);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSeed(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSeed(null);
          setOpen(true);
        }}
        aria-label={t.chat.fab_open}
        aria-expanded={open}
        aria-controls="chat-drawer"
        className={`group fixed bottom-10 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent text-bg-base shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/30 opacity-75"
        />
        <MessageSquare size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div id="chat-drawer">
        <ChatDrawer open={open} onClose={handleClose} seed={seed} />
      </div>
    </>
  );
}

export const CHAT_OPEN_EVENT = 'chat:open';

export type OpenChatDetail = {
  seed?: string;
};

export function openChat(seed?: string): void {
  if (typeof window === 'undefined') return;
  const detail: OpenChatDetail = seed ? { seed } : {};
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(CHAT_OPEN_EVENT, { detail }));
}

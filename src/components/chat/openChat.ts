export const CHAT_OPEN_EVENT = 'chat:open';

export type OpenChatDetail = {
  seed?: string;
  /**
   * Unique per dispatch so listeners can distinguish two consecutive opens
   * carrying the same seed value (which would otherwise collapse and skip
   * the prefill effect).
   */
  nonce: number;
};

export function openChat(seed?: string): void {
  if (typeof window === 'undefined') return;
  const detail: OpenChatDetail = { seed, nonce: Date.now() + Math.random() };
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(CHAT_OPEN_EVENT, { detail }));
}

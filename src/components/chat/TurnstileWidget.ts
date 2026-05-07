/**
 * Lazy loader + invisible-mode wrapper for Cloudflare Turnstile.
 *
 * We avoid mounting a React component in the DOM tree (the widget can be
 * rendered into a hidden host div). The script and the host element are
 * created on demand the first time `getTurnstileToken` is called, so the
 * homepage never pays the cost when the chat drawer stays closed.
 */

type TurnstileApi = {
  ready: (cb: () => void) => void;
  render: (
    target: string | HTMLElement,
    options: {
      sitekey: string;
      size?: 'normal' | 'compact' | 'invisible';
      appearance?: 'always' | 'execute' | 'interaction-only';
      retry?: 'auto' | 'never';
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'timeout-callback'?: () => void;
    },
  ) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __turnstileOnLoad?: () => void;
  }
}

// Cloudflare populates `window.turnstile` *after* the script's `load` event
// fires, so the documented `?onload=<func>` callback is the only reliable
// way to wait for the API. The previous `load`-event handler raced and
// produced "turnstile.ready() would break if called *before* api.js is
// loaded" warnings, which silently returned a null token.
const ONLOAD_CB = '__turnstileOnLoad';
const SCRIPT_BASE = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SCRIPT_SRC = `${SCRIPT_BASE}?render=explicit&onload=${ONLOAD_CB}`;
let scriptPromise: Promise<void> | null = null;
let widgetId: string | null = null;
let hostEl: HTMLDivElement | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('no-document'));
      return;
    }
    if (window.turnstile) {
      resolve();
      return;
    }
    window[ONLOAD_CB] = () => resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${SCRIPT_BASE}"]`,
    );
    if (existing) {
      // Script already injected by an earlier call. If turnstile is already
      // populated, we're done; otherwise our just-hooked onload callback
      // fires when the API finishes initializing.
      if (window.turnstile) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener('error', () =>
      reject(new Error('turnstile-load-failed')),
    );
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function ensureHost(): HTMLDivElement {
  if (hostEl) return hostEl;
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.position = 'fixed';
  el.style.left = '-10000px';
  el.style.top = '0';
  el.style.width = '1px';
  el.style.height = '1px';
  el.style.overflow = 'hidden';
  el.style.pointerEvents = 'none';
  document.body.appendChild(el);
  hostEl = el;
  return el;
}

/**
 * Trigger Turnstile and resolve with a token, or `null` if the site key is
 * missing / the widget fails. We never block sending: the backend will accept
 * a `null` token whenever the session cookie is already valid.
 */
export async function getTurnstileToken(): Promise<string | null> {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;
  if (!sitekey) return null;
  if (typeof window === 'undefined') return null;
  try {
    await loadScript();
  } catch {
    return null;
  }
  const api = window.turnstile;
  if (!api) return null;

  return new Promise<string | null>((resolve) => {
    const host = ensureHost();
    let settled = false;
    const finish = (token: string | null) => {
      if (settled) return;
      settled = true;
      resolve(token);
    };

    api.ready(() => {
      try {
        if (widgetId) {
          api.reset(widgetId);
        } else {
          widgetId = api.render(host, {
            sitekey,
            size: 'invisible',
            appearance: 'execute',
            retry: 'auto',
            callback: (token: string) => finish(token),
            'error-callback': () => finish(null),
            'timeout-callback': () => finish(null),
          });
        }
        if (widgetId) api.execute(widgetId);
      } catch {
        finish(null);
      }
    });

    // Hard timeout so a hung script never blocks the user forever.
    window.setTimeout(() => finish(null), 8000);
  });
}

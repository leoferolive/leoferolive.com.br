import type { Lang } from './types';

export const langPathPrefix = (lang: Lang) => (lang === 'pt' ? '' : '/en');

export const langFromPath = (pathname: string): Lang =>
  pathname.startsWith('/en') ? 'en' : 'pt';

/**
 * Routes that have language-specific slugs. Each entry maps PT ↔ EN paths.
 * The home (`/` ↔ `/en`) is handled by the default prefix logic.
 */
const LOCALIZED_ROUTES: Array<{ pt: string; en: string }> = [
  { pt: '/arquitetura', en: '/en/architecture' },
];

export const swapLangPath = (pathname: string, hash: string, target: Lang) => {
  for (const r of LOCALIZED_ROUTES) {
    if (pathname === r.pt || pathname === r.en) {
      return `${target === 'pt' ? r.pt : r.en}${hash}`;
    }
  }
  const stripped = pathname.replace(/^\/en/, '') || '/';
  const base = target === 'en' ? `/en${stripped === '/' ? '' : stripped}` : stripped;
  return `${base}${hash}`;
};

import type { Lang } from './types';

export const langPathPrefix = (lang: Lang) => (lang === 'pt' ? '' : '/en');

export const langFromPath = (pathname: string): Lang =>
  pathname.startsWith('/en') ? 'en' : 'pt';

export const swapLangPath = (pathname: string, hash: string, target: Lang) => {
  const stripped = pathname.replace(/^\/en/, '') || '/';
  const base = target === 'en' ? `/en${stripped === '/' ? '' : stripped}` : stripped;
  return `${base}${hash}`;
};

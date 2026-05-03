import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { I18nDictionary, Lang } from './types';
import { pt } from './pt';
import { en } from './en';

const dicts: Record<Lang, I18nDictionary> = { pt, en };

type I18nContextValue = {
  lang: Lang;
  t: I18nDictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: dicts[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useI18n } from '@/i18n/context';
import { swapLangPath } from '@/i18n/routing';

const STORAGE_KEY = 'lang';

export function LanguageToggle() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const target = lang === 'pt' ? 'en' : 'pt';
  const onSwitch = () => {
    const next = swapLangPath(location.pathname, location.hash, target);
    navigate(next);
  };

  return (
    <button
      type="button"
      aria-label={t.chrome.languageToggleLabel}
      className="rounded border border-border px-2 py-0.5 text-text-faint text-[11px] hover:border-border-hover hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      onClick={onSwitch}
    >
      <span className={lang === 'pt' ? 'text-accent' : ''}>PT</span>
      <span className="mx-1 text-text-faint">·</span>
      <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
    </button>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import { swapLangPath } from '@/i18n/routing';

const STORAGE_KEY = 'lang';

export function LanguageToggle() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    if (hasMounted) {
      setAnnouncement(t.chrome.languageChangedAnnouncement);
      const timer = window.setTimeout(() => setAnnouncement(''), 1000);
      return () => window.clearTimeout(timer);
    }
    setHasMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]); // intentionally only listen to lang changes; t and hasMounted are gating concerns

  const target = lang === 'pt' ? 'en' : 'pt';
  const onSwitch = () => {
    const next = swapLangPath(location.pathname, location.hash, target);
    navigate(next);
  };

  return (
    <>
      <button
        type="button"
        aria-label={t.chrome.languageToggleLabel}
        className="rounded border border-border px-2 py-0.5 text-text-faint text-[11px] hover:border-border-hover hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        onClick={onSwitch}
      >
        <span
          className={lang === 'pt' ? 'text-accent font-semibold' : ''}
          aria-current={lang === 'pt' ? 'true' : undefined}
        >
          PT
        </span>
        <span className="mx-1 text-text-faint">·</span>
        <span
          className={lang === 'en' ? 'text-accent font-semibold' : ''}
          aria-current={lang === 'en' ? 'true' : undefined}
        >
          EN
        </span>
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </span>
    </>
  );
}

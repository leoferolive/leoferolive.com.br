import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { langFromPath } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { useT } from '@/i18n/useT';

function LocalizedShell({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <PageShell
      skipLabel={t.chrome.skipLabel}
      breadcrumb={t.chrome.breadcrumb}
      branch={t.chrome.branch}
      status={t.chrome.status}
      lastCommit={t.chrome.lastCommit}
    >
      {children}
    </PageShell>
  );
}

function HtmlLangSync() {
  const t = useT();
  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;
  }, [t]);
  return null;
}

function LangApp({ children }: { children: ReactNode }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  return (
    <I18nProvider lang={lang}>
      <HtmlLangSync />
      <LocalizedShell>{children}</LocalizedShell>
    </I18nProvider>
  );
}

function PersistedLangRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/' && localStorage.getItem('lang') === 'en') {
      navigate('/en' + location.hash, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const PlaceholderHome = () => (
  <p className="py-12">conteúdo das seções aqui (vem em Phase 3)</p>
);

export default function App() {
  return (
    <>
      <PersistedLangRedirect />
      <Routes>
        <Route path="/" element={<LangApp><PlaceholderHome /></LangApp>} />
        <Route path="/en" element={<LangApp><PlaceholderHome /></LangApp>} />
        <Route path="*" element={<LangApp><PlaceholderHome /></LangApp>} />
      </Routes>
    </>
  );
}

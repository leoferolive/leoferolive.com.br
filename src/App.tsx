import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { langFromPath } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { useT } from '@/i18n/useT';
import { Hero } from '@/components/sections/Hero';
import { Cases } from '@/components/sections/Cases';
import { Career } from '@/components/sections/Career';
import { Workflow } from '@/components/sections/Workflow';
import { Projects } from '@/components/sections/Projects';
import { Stack } from '@/components/sections/Stack';

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

const Home = () => (
  <>
    <Hero />
    <Cases />
    <Career />
    <Workflow />
    <Projects />
    <Stack />
  </>
);

export default function App() {
  return (
    <>
      <PersistedLangRedirect />
      <Routes>
        <Route path="/" element={<LangApp><Home /></LangApp>} />
        <Route path="/en" element={<LangApp><Home /></LangApp>} />
        <Route path="*" element={<LangApp><Home /></LangApp>} />
      </Routes>
    </>
  );
}

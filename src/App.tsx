import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { langFromPath } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { useT } from '@/i18n/useT';
import { Head } from '@/seo/Head';
import { Hero } from '@/components/sections/Hero';
import { Cases } from '@/components/sections/Cases';
import { Career } from '@/components/sections/Career';
import { Workflow } from '@/components/sections/Workflow';
import { Projects } from '@/components/sections/Projects';
import { Stack } from '@/components/sections/Stack';
import { Contact } from '@/components/sections/Contact';
import { ChatFab } from '@/components/chat/ChatFab';

function LocalizedShell({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <PageShell
      skipLabel={t.chrome.skipLabel}
      breadcrumb={t.chrome.breadcrumb}
      statusBarLeft={t.chrome.statusBarLeft}
    >
      {children}
    </PageShell>
  );
}

function LangApp({ children }: { children: ReactNode }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  return (
    <I18nProvider lang={lang}>
      <Head />
      <LocalizedShell>{children}</LocalizedShell>
      <ChatFab />
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
    <Contact />
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

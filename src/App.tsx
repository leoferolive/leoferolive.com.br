import { Routes, Route, Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';

const Home = ({ lang }: { lang: 'PT' | 'EN' }) => (
  <div className="py-12">
    <nav className="mb-6 flex gap-4">
      <Link to="/" className="text-accent hover:underline">PT</Link>
      <Link to="/en" className="text-accent hover:underline">EN</Link>
    </nav>
    <p>portfolio {lang} — placeholder, sections coming in Phase 3</p>
  </div>
);

export default function App() {
  return (
    <PageShell
      skipLabel="Pular para conteúdo"
      breadcrumb="~/leoferolive/portfolio"
      branch="main"
      status="✓ deployed"
      lastCommit="hoje"
    >
      <Routes>
        <Route path="/" element={<Home lang="PT" />} />
        <Route path="/en" element={<Home lang="EN" />} />
      </Routes>
    </PageShell>
  );
}

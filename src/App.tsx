import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <main className="p-8">
      <nav className="mb-4 flex gap-4">
        <Link to="/" className="text-accent">PT</Link>
        <Link to="/en" className="text-accent">EN</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>portfolio PT</p>} />
        <Route path="/en" element={<p>portfolio EN</p>} />
      </Routes>
    </main>
  );
}

import { Link } from 'react-router-dom';
import { ArchitectureCanvas } from '@/components/architecture/ArchitectureCanvas';
import { Legend } from '@/components/architecture/Legend';
import { diagrams } from '@/data/architecture';
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { langPathPrefix } from '@/i18n/routing';

export function Architecture() {
  const t = useT();
  const { lang } = useI18n();
  const diagram = diagrams.unified;

  return (
    <section
      aria-labelledby="architecture-title"
      // Escapa do max-w-5xl do PageShell e do pb-16 do <main> para virar
      // um canvas hero ocupando a viewport inteira abaixo do header.
      // 100vh - TopBar/Nav (72px) - StatusBar (28px) = 100vh - 100px (6.25rem).
      // -mb-16 neutraliza o pb-16 do <main> do PageShell.
      className="relative left-1/2 -mb-16 -translate-x-1/2 w-screen h-[calc(100vh-6.25rem)]"
    >
      <h1 id="architecture-title" className="sr-only">
        {t.architecture.pageTitle}
      </h1>

      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-start gap-2 px-4 md:top-6 md:px-6">
        <Link
          to={langPathPrefix(lang) || '/'}
          className="pointer-events-auto inline-flex items-center text-xs text-text-muted hover:text-accent"
        >
          {t.architecture.backToHome}
        </Link>
        <div className="pointer-events-auto flex w-full flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <p className="hidden max-w-md text-xs text-text-muted md:block">
            {diagram.caption[lang]}
          </p>
          <div className="hidden md:block">
            <Legend />
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        <ArchitectureCanvas key={diagram.id} diagram={diagram} />
      </div>
    </section>
  );
}

import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { langPathPrefix } from '@/i18n/routing';

const SECTION_IDS = ['cases', 'career', 'workflow', 'projects', 'stack', 'contact'] as const;

// eslint-disable-next-line max-lines-per-function -- TODO(quality-gate): refatorar até 2026-08-11 (dívida herdada do PR #9 /arquitetura)
export function SectionNav() {
  const t = useT();
  const { lang } = useI18n();
  const { pathname } = useLocation();
  const homePath = langPathPrefix(lang) || '/';
  const archPath = lang === 'pt' ? '/arquitetura' : '/en/architecture';
  const isHome = pathname === '/' || pathname === '/en';

  const items = SECTION_IDS.map((id) => ({
    id,
    label: t.nav.items[id],
    href: isHome ? `#${id}` : `${homePath === '/' ? '' : homePath}/#${id}`,
  }));

  return (
    <nav
      aria-label={t.nav.label}
      className="border-b border-border/60 bg-bg-base/85 backdrop-blur-sm"
    >
      <ul className="hidden h-9 items-center gap-5 px-4 text-[13px] md:flex">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={it.href}
              className="text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:rounded"
            >
              {it.label}
            </a>
          </li>
        ))}
        <li>
          <Link
            to={archPath}
            className="text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:rounded"
          >
            {t.architecture.pageTitle.toLowerCase()}
          </Link>
        </li>
      </ul>
      <details className="md:hidden group">
        <summary
          className="flex h-11 cursor-pointer list-none items-center gap-2 px-4 text-[13px] text-text-muted [&::-webkit-details-marker]:hidden"
          aria-label={t.nav.toggleLabel}
        >
          <Menu size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>{t.nav.toggleLabel}</span>
        </summary>
        <ul className="space-y-1 px-4 pb-3 text-[14px]">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={it.href}
                onClick={(e) => {
                  e.currentTarget.closest('details')?.removeAttribute('open');
                }}
                className="block py-2 text-text-muted hover:text-accent min-h-[44px] flex items-center"
              >
                {it.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to={archPath}
              onClick={(e) => {
                e.currentTarget.closest('details')?.removeAttribute('open');
              }}
              className="block py-2 text-text-muted hover:text-accent min-h-[44px] flex items-center"
            >
              {t.architecture.pageTitle.toLowerCase()}
            </Link>
          </li>
        </ul>
      </details>
    </nav>
  );
}

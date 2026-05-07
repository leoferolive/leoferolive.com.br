import { Menu } from 'lucide-react';
import { useT } from '@/i18n/useT';

const SECTION_IDS = ['cases', 'career', 'workflow', 'projects', 'stack', 'contact'] as const;

export function SectionNav() {
  const t = useT();
  const items = SECTION_IDS.map((id) => ({
    id,
    label: t.nav.items[id],
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
              href={`#${it.id}`}
              className="text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:rounded"
            >
              {it.label}
            </a>
          </li>
        ))}
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
                href={`#${it.id}`}
                className="block py-2 text-text-muted hover:text-accent min-h-[44px] flex items-center"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}

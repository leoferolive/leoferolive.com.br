import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CareerDetailed } from '@/data/career';
import type { Lang } from '@/i18n/types';
import { useT } from '@/i18n/useT';

type Props = {
  entry: CareerDetailed;
  lang: Lang;
  defaultExpandedMobile: boolean;
};

const isMobileQuery = '(max-width: 30rem)';

export function CareerEntryDetailed({ entry, lang, defaultExpandedMobile }: Props) {
  const t = useT();
  const [mobileExpanded, setMobileExpanded] = useState(defaultExpandedMobile);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(isMobileQuery);
    setMobile(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const showBullets = !mobile || mobileExpanded;
  const badgeText =
    entry.badge === 'in_progress' ? t.career.inProgress : t.career.yearsBadge(entry.badge.years);

  const Header = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-bold text-text-primary">
        {entry.company} · {entry.role[lang]} · {entry.period[lang]}
      </span>
      <span className="shrink-0 text-text-faint text-[11px]">[{badgeText}]</span>
    </div>
  );

  return (
    <div className="border-l-2 border-border pl-4 py-2">
      {mobile ? (
        <button
          type="button"
          aria-expanded={mobileExpanded}
          aria-controls={`career-${entry.id}-bullets`}
          aria-label={t.career.expandLabel}
          onClick={() => setMobileExpanded((v) => !v)}
          className="flex w-full items-center gap-2 text-left min-h-[44px]"
        >
          <ChevronRight
            size={14}
            strokeWidth={1.5}
            className={`shrink-0 motion-safe:transition-transform ${mobileExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
          <div className="flex-1">{Header}</div>
        </button>
      ) : (
        Header
      )}
      <p className="mt-1 text-text-muted text-sm">{entry.summary[lang]}</p>
      <ul
        id={`career-${entry.id}-bullets`}
        className={`mt-2 space-y-1 overflow-hidden motion-safe:transition-all ${
          showBullets ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {entry.bullets.map((b, i) => (
          <li key={i} className="text-sm text-text-primary">
            • {b[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
}

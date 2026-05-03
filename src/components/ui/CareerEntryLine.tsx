import type { CareerLine } from '@/data/career';
import type { Lang } from '@/i18n/types';

export function CareerEntryLine({ entry, lang }: { entry: CareerLine; lang: Lang }) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-muted">
      <span className="text-text-faint">└──</span>
      <span className="w-28 shrink-0 text-text-faint">{entry.yearLabel}</span>
      <span>{entry.text[lang]}</span>
    </div>
  );
}

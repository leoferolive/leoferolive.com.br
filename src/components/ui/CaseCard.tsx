import type { CaseEntry } from '@/data/cases';
import type { Lang } from '@/i18n/types';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { BotHandoff } from '@/components/ui/BotHandoff';
import { useT } from '@/i18n/useT';

type Props = { caseEntry: CaseEntry; lang: Lang };

export function CaseCard({ caseEntry, lang }: Props) {
  const t = useT();
  return (
    <article
      id={`case-${caseEntry.id}`}
      className="rounded border border-border bg-bg-surface p-5 transition-colors hover:border-border-hover hover:bg-bg-elevated"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-sm font-mono text-text-muted m-0 font-normal">
          {caseEntry.filename}
        </h3>
        <span className="shrink-0 rounded bg-bg-elevated px-2 py-0.5 text-[11px] text-ok">
          ✓ {caseEntry.status}
        </span>
      </header>
      <pre className="whitespace-pre-wrap font-mono text-sm">
        <span className="text-text-muted">{'{'}</span>
        {'\n'}
        <span className="text-text-faint">  problem:  </span>
        <span className="text-text-primary">{'"'}{caseEntry.problem[lang]}{'"'}</span>,{'\n'}
        <span className="text-text-faint">  solution: </span>
        <span className="text-text-primary">{'"'}{caseEntry.solution[lang]}{'"'}</span>,{'\n'}
        <span className="text-text-faint">  impact:   </span>
        <span className="text-text-primary">{'"'}{caseEntry.impact[lang]}{'"'}</span>
        {'\n'}
        <span className="text-text-muted">{'}'}</span>
      </pre>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {caseEntry.stack.map((s) => (
          <li
            key={s}
            className="rounded border border-border px-2 py-0.5 text-[11px] text-text-faint"
          >
            {s}
          </li>
        ))}
      </ul>
      {caseEntry.links && caseEntry.links.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-[12px]">
          {caseEntry.links.map((l) => (
            <li key={l.href}>
              <ExternalLink
                href={l.href}
                className="text-text-muted hover:text-accent transition-colors"
              >
                ↗ {l.label[lang]}
              </ExternalLink>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 border-t border-border pt-3">
        <BotHandoff
          label={t.botHandoff.caseLabel}
          seed={t.botHandoff.caseSeedTpl(caseEntry.filename)}
        />
      </div>
    </article>
  );
}

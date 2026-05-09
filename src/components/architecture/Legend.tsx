import { useT } from '@/i18n/useT';

const VARIANTS = [
  { key: 'data', color: '#5eead4' },
  { key: 'control', color: '#94a3b8' },
  { key: 'observability', color: '#a78bfa' },
] as const;

export function Legend() {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded border border-border bg-bg-surface px-3 py-2 text-[11px] text-text-muted">
      <span className="font-bold uppercase tracking-wider text-text-faint">
        {t.architecture.legend.title}
      </span>
      {VARIANTS.map((v) => (
        <span key={v.key} className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-5 rounded"
            style={{ background: v.color }}
            aria-hidden="true"
          />
          {t.architecture.legend[v.key]}
        </span>
      ))}
      <span className="text-text-faint">· {t.architecture.legend.animatedHint}</span>
    </div>
  );
}

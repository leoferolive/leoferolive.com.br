import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ArchNode } from '@/data/architecture/types';
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';

type NodeDrawerProps = {
  node: ArchNode | null;
  onClose: () => void;
};

export function NodeDrawer({ node, onClose }: NodeDrawerProps) {
  const t = useT();
  const { lang } = useI18n();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const asideRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onPointerDown = (e: MouseEvent) => {
      // Non-modal drawer: click outside the aside closes it. Canvas keeps
      // working underneath; users can pick another node and the drawer just
      // re-renders with new content.
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    // Defer mousedown listener so the click that opened the drawer doesn't
    // immediately close it.
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onPointerDown);
    }, 0);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [node, onClose]);

  if (!node) return null;
  const tech = node.details.technical;
  const decisions = node.details.decisions ?? [];
  const links = node.details.links ?? [];

  return createPortal(
    <>
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="false"
        aria-label={node.label}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-lg border-t border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-bg-surface shadow-[0_24px_60px_-20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:border-l md:border-t-0"
      >
        <header className="sticky top-0 flex items-center justify-between gap-3 border-b border-border bg-bg-surface px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-text-faint">
              {tech?.kind ?? '—'}
              {tech?.namespace ? ` · ${tech.namespace}` : ''}
            </p>
            <h2 className="truncate text-lg font-bold text-text-primary">{node.label}</h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t.architecture.drawer.close}
            className="-mr-1 rounded p-2 text-text-muted hover:bg-bg-elevated hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div className="space-y-6 px-5 py-5 text-sm">
          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
              {t.architecture.drawer.descriptionLabel}
            </h3>
            <p className="text-text-muted">{node.details.description[lang]}</p>
          </section>

          {tech && (
            <section>
              <h3 className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
                {t.architecture.drawer.technicalLabel}
              </h3>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5 text-[13px]">
                {tech.kind && (
                  <DLRow label={t.architecture.drawer.kindLabel} value={tech.kind} />
                )}
                {tech.namespace && (
                  <DLRow
                    label={t.architecture.drawer.namespaceLabel}
                    value={<code className="font-mono text-text-primary">{tech.namespace}</code>}
                  />
                )}
                {tech.version && (
                  <DLRow label={t.architecture.drawer.versionLabel} value={tech.version} />
                )}
                {typeof tech.replicas === 'number' && (
                  <DLRow label={t.architecture.drawer.replicasLabel} value={String(tech.replicas)} />
                )}
                {tech.resources && (
                  <DLRow
                    label={t.architecture.drawer.resourcesLabel}
                    value={
                      <span className="font-mono text-[12px] text-text-muted">
                        req {tech.resources.requests ?? '—'} · lim {tech.resources.limits ?? '—'}
                      </span>
                    }
                  />
                )}
                {tech.port !== undefined && (
                  <DLRow
                    label={t.architecture.drawer.portLabel}
                    value={<code className="font-mono text-text-primary">{tech.port}</code>}
                  />
                )}
                {tech.storage && (
                  <DLRow label={t.architecture.drawer.storageLabel} value={tech.storage} />
                )}
              </dl>
            </section>
          )}

          {decisions.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
                {t.architecture.drawer.decisionsLabel}
              </h3>
              <ul className="space-y-2 text-text-muted">
                {decisions.map((d, i) => (
                  <li key={i} className="border-l-2 border-accent/40 pl-3">
                    {d[lang]}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {links.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
                {t.architecture.drawer.linksLabel}
              </h3>
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {l.label[lang]} →
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}

function DLRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-text-faint">{label}</dt>
      <dd className="text-text-primary">{value}</dd>
    </>
  );
}

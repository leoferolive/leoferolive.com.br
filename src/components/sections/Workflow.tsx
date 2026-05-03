import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';

const PILLARS = [
  {
    name: 'skills/',
    pt: 'convenções reutilizáveis por domínio (REST endpoint, Kafka consumer, Spring Security, …)',
    en: 'reusable per-domain conventions (REST endpoint, Kafka consumer, Spring Security, …)',
  },
  {
    name: 'AGENTS.md',
    pt: 'arquitetura, padrões e comandos do projeto — contexto que o agente lê primeiro',
    en: 'architecture, patterns and project commands — context the agent reads first',
  },
  {
    name: 'MCPs',
    pt: 'integrações com Jira, Kibana, GitHub, banco — agente age, não só sugere',
    en: 'integrations with Jira, Kibana, GitHub, DB — the agent acts, not just suggests',
  },
  {
    name: 'CI/CD ativo',
    pt: 'linters + testes + fitness functions + validação de contrato. CI vira o revisor automático do agente.',
    en: "linters + tests + fitness functions + contract validation. CI becomes the agent's automated reviewer.",
  },
] as const;

export function Workflow() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="workflow" className="py-16 md:py-24">
      <SectionHeader
        id="workflow-title"
        caption={t.workflow.caption}
        title={t.workflow.title}
        subtitle={t.workflow.subtitle}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PILLARS.map((p) => (
          <article key={p.name} className="rounded border border-border bg-bg-surface p-4">
            <h3 className="font-bold text-accent">{p.name}</h3>
            <p className="mt-2 text-sm text-text-muted">{p[lang]}</p>
          </article>
        ))}
      </div>
      <blockquote className="mt-8 border-l-2 border-accent pl-4 text-text-muted">
        {t.workflow.closing}
      </blockquote>
      <p className="mt-4 text-sm text-text-faint">{t.workflow.proof}</p>
    </section>
  );
}

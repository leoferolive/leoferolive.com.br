export type CaseStatus = 'in production' | 'in production (MVP)' | 'final testing' | 'adopted by team';

export type CaseEntry = {
  id: string;
  filename: string;
  status: CaseStatus;
  category: 'ai' | 'engineering';
  problem: { pt: string; en: string };
  solution: { pt: string; en: string };
  impact: { pt: string; en: string };
  stack: readonly string[];
};

export const cases: readonly CaseEntry[] = [
  {
    id: '01',
    filename: '01_log_analyzer.case',
    status: 'in production',
    category: 'ai',
    problem: {
      pt: 'investigação de incidentes levava dias, frequentemente sem identificação da causa raiz.',
      en: 'incident investigations took days, often without root-cause identification.',
    },
    solution: {
      pt: 'Java 24 + Spring Boot 3 + Spring AI + Azure OpenAI/GPT-4. Consulta Kibana/Elasticsearch por transactionId; LLM identifica sistema de origem e causa raiz.',
      en: 'Java 24 + Spring Boot 3 + Spring AI + Azure OpenAI/GPT-4. Queries Kibana/Elasticsearch by transactionId; LLM identifies originating system and root cause.',
    },
    impact: {
      pt: 'dias → minutos. Em produção, usado por engenharia e suporte.',
      en: 'days → minutes. In production, used by engineering and support.',
    },
    stack: ['Java 24', 'Spring AI', 'Azure OpenAI', 'Elasticsearch', 'Kibana'],
  },
  {
    id: '02',
    filename: '02_rag_platform.case',
    status: 'in production (MVP)',
    category: 'ai',
    problem: {
      pt: 'informação de artigos espalhada em 5+ sistemas internos.',
      en: 'article information scattered across 5+ internal systems.',
    },
    solution: {
      pt: 'Spring AI + Pgvector + Azure OpenAI integrando 5+ fontes. Interfaces de chat e servidor MCP para consultas em linguagem natural.',
      en: 'Spring AI + Pgvector + Azure OpenAI integrating 5+ sources. Chat interfaces and MCP server for natural-language queries.',
    },
    impact: {
      pt: 'MVP em produção. Suporte e produto consultam por linguagem natural.',
      en: 'MVP in production. Support and product query through natural language.',
    },
    stack: ['Spring AI', 'Pgvector', 'Azure OpenAI', 'MCP', 'PostgreSQL'],
  },
  {
    id: '03',
    filename: '03_revenue_tracking.case',
    status: 'final testing',
    category: 'ai',
    problem: {
      pt: 'estimativa tradicional 3+ meses para entregar o core.',
      en: 'traditional estimate of 3+ months to deliver the core.',
    },
    solution: {
      pt: 'Liderei a vertente de IA em squad de 3. Skills, commands customizados, AGENTS.md e CI/CD validando código gerado por Cursor.',
      en: 'Led the AI track in a squad of 3. Custom skills, commands, AGENTS.md and CI/CD validating Cursor-generated code.',
    },
    impact: {
      pt: 'core entregue em ~1 mês. Em testes finais.',
      en: 'core delivered in ~1 month. In final testing.',
    },
    stack: ['Cursor', 'AGENTS.md', 'Skills', 'CI/CD'],
  },
  {
    id: '04',
    filename: '04_agentic_workspace.case',
    status: 'adopted by team',
    category: 'ai',
    problem: {
      pt: 'onboarding lento e support duty manual.',
      en: 'slow onboarding and manual support duty.',
    },
    solution: {
      pt: 'Workspace versionável: skills + AGENTS.md + MCPs (Jira, Kibana). Agente executa support duty E2E (issue → logs → fix → comentário no Jira).',
      en: 'Versioned workspace: skills + AGENTS.md + MCPs (Jira, Kibana). Agent runs support duty E2E (issue → logs → fix → Jira comment).',
    },
    impact: {
      pt: 'adotado pelo time. Disseminado via Conselho de IA Wiley Research BR.',
      en: 'adopted by the team. Rolled out via the Wiley Research BR AI Council.',
    },
    stack: ['Skills', 'AGENTS.md', 'MCP', 'Jira', 'Kibana'],
  },
  {
    id: '05',
    filename: '05_sse_at_scale.case',
    status: 'in production',
    category: 'engineering',
    problem: {
      pt: 'entrega de eventos em tempo real para o frontend em K8s com múltiplos pods — broadcast inconsistente entre instâncias e custo crescente de conexões por aba.',
      en: 'real-time event delivery to the frontend in a multi-pod Kubernetes environment — inconsistent broadcast across instances and growing per-tab connection cost.',
    },
    solution: {
      pt: 'Desenhei E2E a entrega de SSE com Redis Pub/Sub para consistência entre pods, e adicionei camada de BroadcastChannel no frontend para deduplicar conexões por aba. Java 25, Spring Boot 4.',
      en: 'Designed end-to-end SSE delivery with Redis Pub/Sub for cross-pod consistency, plus a BroadcastChannel layer on the frontend to deduplicate per-tab connections. Java 25, Spring Boot 4.',
    },
    impact: {
      pt: 'Eventos consistentes em ambiente multi-pod e redução significativa de carga de conexões no backend. Em produção na plataforma de submissões/publicações da Wiley.',
      en: "Consistent events across pods and significant reduction in backend connection load. In production on Wiley's submissions/publications platform.",
    },
    stack: ['Java 25', 'Spring Boot 4', 'Redis Pub/Sub', 'SSE', 'Kubernetes', 'BroadcastChannel API'],
  },
] as const;

export type CareerBadge = 'in_progress' | { years: number };

export type CareerDetailed = {
  kind: 'detailed';
  id: string;
  company: string;
  role: { pt: string; en: string };
  period: { pt: string; en: string };
  badge: CareerBadge;
  summary: { pt: string; en: string };
  bullets: ReadonlyArray<{ pt: string; en: string }>;
};

export type CareerLine = {
  kind: 'line';
  id: string;
  yearLabel: string;
  text: { pt: string; en: string };
};

export type CareerEntry = CareerDetailed | CareerLine;

export const career: readonly CareerEntry[] = [
  {
    kind: 'detailed',
    id: 'wiley',
    company: 'Wiley',
    role: { pt: 'Senior SE', en: 'Senior SE' },
    period: { pt: 'Dez 2024 → now', en: 'Dec 2024 → now' },
    badge: 'in_progress',
    summary: {
      pt: 'UAXD platform · 10k+ autores globalmente · AI-First leadership',
      en: 'UAXD platform · 10k+ authors globally · AI-First leadership',
    },
    bullets: [
      {
        pt: 'Arquitetura SSE/Redis Pub/Sub em K8s com BroadcastChannel — updates assíncronos mantendo a plataforma em tempo real, com sincronia e confiabilidade dos dados',
        en: 'SSE/Redis Pub/Sub architecture in K8s with BroadcastChannel — async updates keeping the platform real-time, with data sync and reliability',
      },
      {
        pt: '4 iniciativas de IA em produção (logs, RAG, revenue, workspace)',
        en: '4 AI initiatives in production (logs, RAG, revenue, workspace)',
      },
      {
        pt: 'Co-fundador, Conselho de IA Wiley Research BR',
        en: 'Co-founder, Wiley Research BR AI Council',
      },
    ],
  },
  {
    kind: 'detailed',
    id: 'ebix',
    company: 'Ebix',
    role: { pt: 'Ref. Técnica', en: 'Tech Lead' },
    period: { pt: 'Jun 2019 → Jul 2024', en: 'Jun 2019 → Jul 2024' },
    badge: { years: 5 },
    summary: {
      pt: 'Bradesco Seguros · Sinistros · alta criticidade',
      en: 'Bradesco Seguros · Claims · high financial criticality',
    },
    bullets: [
      {
        pt: '500–1.000 sinistros/dia · valores individuais de até R$5M',
        en: '500–1,000 claims/day · individual values up to R$5M',
      },
      {
        pt: 'Integração SAP · BFF P8 FileNet · WebSphere 8 → 9',
        en: 'SAP integration · BFF over P8 FileNet · WebSphere 8 → 9 migration',
      },
      {
        pt: 'Mentoria contínua do time — apoio a estagiários e devs juniores no crescimento técnico e arquitetural',
        en: 'Ongoing team mentorship — supporting interns and junior devs in their technical and architectural growth',
      },
    ],
  },
  {
    kind: 'line',
    id: 'cityconnect',
    yearLabel: '2024',
    text: {
      pt: 'City Connect · Líder de Projetos · TCE-PR (8 devs)',
      en: 'City Connect · Project Lead · TCE-PR (8 devs)',
    },
  },
  {
    kind: 'line',
    id: 'lumis',
    yearLabel: '2018 → 2019',
    text: {
      pt: 'Lumis · SulAmérica · microsserviços OpenShift',
      en: 'Lumis · SulAmérica · OpenShift microservices',
    },
  },
  {
    kind: 'line',
    id: 'persist',
    yearLabel: '2014 → 2018',
    text: {
      pt: 'Persist/Ebix · estágio → pleno',
      en: 'Persist/Ebix · intern → mid-level dev',
    },
  },
] as const;

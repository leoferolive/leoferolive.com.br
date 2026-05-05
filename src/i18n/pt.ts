import type { I18nDictionary } from './types';

export const pt: I18nDictionary = {
  meta: {
    title: 'Leonardo Fernandes Oliveira — Senior Software Engineer · AI-First',
    description:
      'Senior Software Engineer com 10+ anos em Java/Spring e foco em engenharia AI-First. Construo sistemas que usam IA, e uso IA pra construir sistemas.',
    htmlLang: 'pt-BR',
  },
  chrome: {
    skipLabel: 'Pular para conteúdo',
    breadcrumb: '~/leoferolive/portfolio',
    statusBarLeft: '✓ aberto a remoto · horário UTC-3',
    languageToggleLabel: 'PT EN — trocar idioma para inglês',
    languageChangedAnnouncement: 'Idioma alterado para português',
  },
  hero: {
    promptCommand: '~ $ whoami',
    name: 'Leonardo Fernandes Oliveira',
    subtitle: 'Senior Software Engineer · AI-First Engineer',
    tagline: 'Construo sistemas que usam IA, e uso IA pra construir sistemas.',
    capabilities:
      'sistemas distribuídos · features de IA em produção · fluxos AI-First',
    metaLine: 'Curitiba/BR · 10+ anos · @Wiley desde 2024',
    cta: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' },
  },
  cases: {
    caption: '// production-cases',
    title: 'Cases em Produção',
    subtitle:
      'Cinco entregas que mudaram a operação dentro da Wiley — quatro de IA e uma de engenharia em escala.',
  },
  career: {
    caption: '// career',
    title: 'Trajetória',
    subtitle:
      'Dez anos de engenharia: de sustentação em sinistros a entrega de IA em produção.',
    inProgress: 'in progress',
    yearsBadge: (n) => `${n} anos`,
    expandLabel: 'Expandir detalhes',
  },
  workflow: {
    caption: '// how-i-work',
    title: 'Engenharia AI-First',
    subtitle:
      'Mais que autocomplete: agentes entregam features E2E sob revisão humana.',
    closing:
      'Resultado: ciclo `issue → plano → código → PR → review → merge` com agente fazendo o trabalho braçal e dev senior validando arquitetura e edge cases. Não é magia. É engenharia disciplinada com IA no loop.',
    proof:
      'Em 2025: 4 iniciativas de IA em produção, workspace agêntico adotado pelo time, padrões disseminados via Conselho de IA Wiley Research BR.',
  },
  projects: {
    caption: '// side-projects',
    title: 'Projetos Pessoais',
    subtitle: 'Construídos 100% via AI coding. Em produção, self-hosted.',
  },
  stack: {
    caption: '// stack',
    title: 'Stack',
    subtitle: 'Onde sou rápido. Onde sou perigoso.',
  },
  contact: {
    caption: '// contact',
    title: 'Vamos conversar',
    subtitle: 'Curitiba/BR · aberto a remoto · disponibilidade para discutir.',
    promptCommand: '$ contact --leo',
    keys: {
      email: 'email',
      github: 'github',
      linkedin: 'linkedin',
      location: 'location',
      education: 'education',
      languages: 'languages',
    },
    values: {
      location: 'Curitiba, PR — Brasil',
      education: 'FAETERJ-RJ · Tec. em Análise e Desenvolvimento de Sistemas',
      languages: 'PT (nativo) · EN (profissional)',
    },
    copyEmailAria: 'Copiar email',
    copyEmailLabel: 'copiar',
    copiedFeedback: 'Copiado',
    footerExit: '~ $ exit',
    footerNote:
      'built with React + Vite, hosted on a Raspberry Pi.\n2026 · Leonardo Fernandes Oliveira',
  },
};

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
    metaLine: 'Curitiba/BR · 10+ anos · @Wiley desde 2024 · aberto a conversas',
    positioning:
      'Útil pra quem precisa de IA aplicada em produção ou backend Java que escala em multi-pod. Para tudo que não couber aqui, o Leobot ali no canto responde.',
    cta: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', askBot: 'Falar com o Leobot' },
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
    subtitle:
      'Categorias por domínio. Curadoria, não enciclopédia — só o que uso no dia a dia.',
  },
  contact: {
    caption: '// contact',
    title: 'Vamos conversar',
    subtitle: '',
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
  chat: {
    fab_open: 'Abrir conversa com o Leobot',
    drawer_title: 'Leobot',
    badge: 'IA · 3ª pessoa',
    close: 'Fechar conversa',
    placeholder: 'Pergunte algo sobre a carreira do Leonardo…',
    send: 'Enviar mensagem',
    welcome:
      'Oi! Sou o **Leobot** — um assistente de IA que conhece a carreira, projetos e stack do Leonardo. Posso resumir cases, comparar tecnologias ou indicar onde ele atuou. O que você quer saber?',
    disclaimer:
      'Respostas geradas por IA. Confira informações importantes antes de citar.',
    error_network:
      'Não consegui falar com o servidor agora. Tenta de novo em alguns instantes.',
    error_rate_limit:
      'Muitas mensagens em pouco tempo. Aguarda um minutinho e tenta de novo.',
    error_cost_gate:
      'O chat atingiu o limite diário de uso. Tenta de novo amanhã ou fala direto comigo pelo email no rodapé.',
    error_generic: 'Algo deu errado por aqui. Tenta novamente em instantes.',
    loading: 'Pensando…',
    closed_announce: 'Chat fechado.',
  },
  botHandoff: {
    caseLabel: 'Se quiser mais detalhes sobre este caso, pergunta pro Leobot →',
    caseSeedTpl: (filename) => `Me conta mais detalhes sobre o caso ${filename}.`,
    careerCouncilLabel:
      'Se quiser saber mais sobre o Conselho de IA Wiley Research BR, pergunta pro Leobot →',
    careerCouncilSeed:
      'Me explica o Conselho de IA Wiley Research BR: escopo, número de times envolvidos e o papel do Leonardo.',
    careerEarlyLabel:
      'Se quiser detalhes das fases pré-2024, pergunta pro Leobot →',
    careerEarlySeed:
      'Conta sobre a trajetória do Leonardo antes de 2024 (City Connect, Lumis, Persist/Ebix): o que ele fez, em qual stack e o que aprendeu.',
    workflowLabel:
      'Se quiser ver como o Leonardo aplica isso no dia a dia, pergunta pro Leobot →',
    workflowSeed:
      'Como o Leonardo aplica AI-First no dia a dia? Dá um exemplo concreto de issue → plano → PR → merge usando agentes.',
    stackLabel:
      'Se quiser saber em qual nível ele usa cada uma, pergunta pro Leobot →',
    stackSeed:
      'Em qual nível de profundidade o Leonardo usa cada uma das tecnologias do stack? O que é produção e o que é exploração?',
  },
  nav: {
    label: 'Seções da página',
    toggleLabel: 'Abrir menu de seções',
    items: {
      cases: 'cases',
      career: 'trajetória',
      workflow: 'workflow',
      projects: 'projetos',
      stack: 'stack',
      contact: 'contato',
    },
  },
};

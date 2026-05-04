import type { I18nDictionary } from './types';

export const en: I18nDictionary = {
  meta: {
    title: 'Leonardo Fernandes Oliveira — Senior Software Engineer · AI-First',
    description:
      'Senior Software Engineer with 10+ years in Java/Spring and a focus on AI-First engineering. I build with AI, and I build AI systems.',
    htmlLang: 'en',
  },
  chrome: {
    skipLabel: 'Skip to content',
    breadcrumb: '~/leoferolive/portfolio',
    statusBarLeft: '✓ open to remote · UTC-3 office hours',
    languageToggleLabel: 'Switch language to Portuguese',
    languageChangedAnnouncement: 'Language changed to English',
  },
  hero: {
    promptCommand: '~ $ whoami',
    name: 'Leonardo Fernandes Oliveira',
    subtitle: 'Senior Software Engineer · AI-First Engineer',
    tagline: 'I build with AI, and I build AI systems.',
    capabilities:
      'distributed systems · AI features in production · AI-First workflows',
    metaLine: 'Curitiba/BR · 10+ years · @Wiley since 2024',
    cta: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' },
  },
  cases: {
    caption: '// production-cases',
    title: 'Cases in Production',
    subtitle:
      'Five deliveries that changed operations at Wiley — four AI-driven and one in distributed engineering.',
  },
  career: {
    caption: '// career',
    title: 'Career',
    subtitle:
      'Ten years in engineering: from claims systems support to delivering AI in production.',
    inProgress: 'in progress',
    yearsBadge: (n) => `${n} years`,
    expandLabel: 'Expand details',
  },
  workflow: {
    caption: '// how-i-work',
    title: 'AI-First Engineering',
    subtitle:
      'Beyond autocomplete: agents deliver features end-to-end under human review.',
    closing:
      'Outcome: an `issue → plan → code → PR → review → merge` loop where the agent does the legwork and the senior dev validates architecture and edge cases. Not magic. Disciplined engineering with AI in the loop.',
    proof:
      'In 2025: 4 AI initiatives in production, agentic workspace adopted by the team, standards rolled out via the Wiley Research BR AI Council.',
  },
  projects: {
    caption: '// side-projects',
    title: 'Personal Projects',
    subtitle: 'Built 100% via AI coding. In production, self-hosted.',
  },
  stack: {
    caption: '// stack',
    title: 'Stack',
    subtitle: 'Where I move fast. Where I am dangerous.',
  },
  contact: {
    caption: '// contact',
    title: "Let's talk",
    subtitle: 'Curitiba/BR · open to remote · available to discuss.',
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
      location: 'Curitiba, PR — Brazil',
      education: 'FAETERJ-RJ · Information Systems Technology',
      languages: 'PT (native) · EN (professional)',
    },
    copyEmailAria: 'Copy email',
    copyEmailLabel: 'copy',
    copiedFeedback: 'Copied',
    footerExit: '~ $ exit',
    footerNote:
      'built with React + Vite, hosted on a Raspberry Pi.\n2026 · Leonardo Fernandes Oliveira',
  },
};

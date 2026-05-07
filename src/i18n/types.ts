export type Lang = 'pt' | 'en';

export interface I18nDictionary {
  meta: {
    title: string;
    description: string;
    htmlLang: 'pt-BR' | 'en';
  };
  chrome: {
    skipLabel: string;
    breadcrumb: string;
    statusBarLeft: string;
    languageToggleLabel: string;
    languageChangedAnnouncement: string;
  };
  hero: {
    promptCommand: string;
    name: string;
    subtitle: string;
    tagline: string;
    capabilities: string;
    metaLine: string;
    positioning: string;
    cta: { github: string; linkedin: string; email: string; askBot: string };
  };
  cases: {
    caption: string;
    title: string;
    subtitle: string;
  };
  career: {
    caption: string;
    title: string;
    subtitle: string;
    inProgress: string;
    yearsBadge: (n: number) => string;
    expandLabel: string;
  };
  workflow: {
    caption: string;
    title: string;
    subtitle: string;
    closing: string;
    proof: string;
  };
  projects: {
    caption: string;
    title: string;
    subtitle: string;
  };
  stack: {
    caption: string;
    title: string;
    subtitle: string;
  };
  contact: {
    caption: string;
    title: string;
    subtitle: string;
    promptCommand: string;
    keys: {
      email: string;
      github: string;
      linkedin: string;
      location: string;
      education: string;
      languages: string;
    };
    values: {
      location: string;
      education: string;
      languages: string;
    };
    copyEmailAria: string;
    copyEmailLabel: string;
    copiedFeedback: string;
    footerExit: string;
    footerNote: string;
  };
  chat: {
    fab_open: string;
    drawer_title: string;
    badge: string;
    close: string;
    placeholder: string;
    send: string;
    welcome: string;
    disclaimer: string;
    error_network: string;
    error_rate_limit: string;
    error_cost_gate: string;
    error_session_limit: string;
    error_ip_daily_limit: string;
    error_bad_request: string;
    error_generic: string;
    loading: string;
    closed_announce: string;
  };
  botHandoff: {
    caseLabel: string;
    caseSeedTpl: (filename: string) => string;
    careerCouncilLabel: string;
    careerCouncilSeed: string;
    careerEarlyLabel: string;
    careerEarlySeed: string;
    workflowLabel: string;
    workflowSeed: string;
    stackLabel: string;
    stackSeed: string;
  };
  nav: {
    label: string;
    toggleLabel: string;
    items: {
      cases: string;
      career: string;
      workflow: string;
      projects: string;
      stack: string;
      contact: string;
    };
  };
}

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
    cta: { github: string; linkedin: string; email: string };
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
}

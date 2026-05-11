export const SITE_URL = 'https://leoferolive.com.br';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Leonardo Fernandes Oliveira',
  givenName: 'Leonardo',
  familyName: 'Fernandes Oliveira',
  jobTitle: 'Senior Software Engineer',
  description:
    'Senior Software Engineer com 10+ anos em Java/Spring e foco em engenharia AI-First.',
  url: SITE_URL,
  email: 'mailto:leoferolive@gmail.com',
  sameAs: [
    'https://github.com/leoferolive',
    'https://www.linkedin.com/in/leonardo-fer-oliveira/',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Curitiba',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'FAETERJ-RJ',
  },
  knowsAbout: [
    'Java',
    'Spring',
    'AI Engineering',
    'Distributed Systems',
    'Software Architecture',
    'Backend Development',
  ],
  knowsLanguage: ['pt-BR', 'en'],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE_URL,
  name: 'Leonardo Fernandes Oliveira — Portfolio',
  inLanguage: ['pt-BR', 'en'],
  author: {
    '@type': 'Person',
    name: 'Leonardo Fernandes Oliveira',
    url: SITE_URL,
  },
};

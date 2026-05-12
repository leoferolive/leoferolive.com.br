import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import { SITE_URL } from './jsonld';

function setOrCreate(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

export function Head() {
  const { lang, t } = useI18n();
  const { pathname } = useLocation();
  const isArchitecture =
    pathname === '/arquitetura' || pathname === '/en/architecture';

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    const pageTitle = isArchitecture
      ? `${t.architecture.pageTitle} — Leonardo Fernandes Oliveira`
      : t.meta.title;
    const pageDescription = isArchitecture ? t.architecture.pageSubtitle : t.meta.description;
    document.title = pageTitle;
    setOrCreate('meta[name="description"]', { name: 'description', content: pageDescription });
    const path = isArchitecture
      ? lang === 'pt'
        ? '/arquitetura'
        : '/en/architecture'
      : lang === 'pt'
        ? '/'
        : '/en';
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: `${SITE_URL}${path}` });
    setOrCreate('link[rel="alternate"][hreflang="pt-BR"]', {
      rel: 'alternate', hreflang: 'pt-BR', href: `${SITE_URL}/`,
    });
    setOrCreate('link[rel="alternate"][hreflang="en"]', {
      rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/en`,
    });
    setOrCreate('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/`,
    });
    const ogImage = lang === 'pt' ? '/og-image-pt.png' : '/og-image-en.png';
    setOrCreate('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setOrCreate('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    setOrCreate('meta[property="og:description"]', { property: 'og:description', content: pageDescription });
    setOrCreate('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}${ogImage}` });
    setOrCreate('meta[property="og:url"]', { property: 'og:url', content: `${SITE_URL}${path}` });
    setOrCreate('meta[property="og:locale"]', {
      property: 'og:locale', content: lang === 'pt' ? 'pt_BR' : 'en_US',
    });
    setOrCreate('meta[property="og:locale:alternate"]', {
      property: 'og:locale:alternate',
      content: lang === 'pt' ? 'en_US' : 'pt_BR',
    });
    // Twitter card — sync with current language (statically defaults to PT in index.html)
    setOrCreate('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    setOrCreate('meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription });
    setOrCreate('meta[name="twitter:image"]', { name: 'twitter:image', content: `${SITE_URL}${ogImage}` });
  }, [lang, t, isArchitecture]);
  return null;
}

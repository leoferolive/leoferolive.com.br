import { useEffect } from 'react';
import { useI18n } from '@/i18n/context';

const SITE_URL = 'https://leoferolive.com.br';

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
  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;
    setOrCreate('meta[name="description"]', { name: 'description', content: t.meta.description });
    const path = lang === 'pt' ? '/' : '/en';
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
    setOrCreate('meta[property="og:title"]', { property: 'og:title', content: t.meta.title });
    setOrCreate('meta[property="og:description"]', { property: 'og:description', content: t.meta.description });
    setOrCreate('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}${ogImage}` });
    setOrCreate('meta[property="og:url"]', { property: 'og:url', content: `${SITE_URL}${path}` });
    setOrCreate('meta[property="og:locale"]', {
      property: 'og:locale', content: lang === 'pt' ? 'pt_BR' : 'en_US',
    });
  }, [lang, t]);
  return null;
}

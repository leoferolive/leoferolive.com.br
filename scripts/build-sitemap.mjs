#!/usr/bin/env node
// Gera dist/sitemap.xml com <lastmod> = data do build.
// Mesmas URLs e hreflang alternates do sitemap manual, mas com lastmod fresco.

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../dist/sitemap.xml');
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  {
    loc: 'https://leoferolive.com.br/',
    alts: { pt: 'https://leoferolive.com.br/', en: 'https://leoferolive.com.br/en' },
  },
  {
    loc: 'https://leoferolive.com.br/en',
    alts: { pt: 'https://leoferolive.com.br/', en: 'https://leoferolive.com.br/en' },
  },
  {
    loc: 'https://leoferolive.com.br/arquitetura',
    alts: {
      pt: 'https://leoferolive.com.br/arquitetura',
      en: 'https://leoferolive.com.br/en/architecture',
    },
  },
  {
    loc: 'https://leoferolive.com.br/en/architecture',
    alts: {
      pt: 'https://leoferolive.com.br/arquitetura',
      en: 'https://leoferolive.com.br/en/architecture',
    },
  },
];

const body = urls
  .map(
    ({ loc, alts }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${alts.pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${alts.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${alts.pt}" />
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, 'utf8');
console.log(`[build-sitemap] wrote ${outPath} (lastmod=${lastmod})`);

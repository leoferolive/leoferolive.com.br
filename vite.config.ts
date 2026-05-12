import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { personJsonLd, websiteJsonLd } from './src/seo/jsonld';

function jsonLdInject(): Plugin {
  const replace = (html: string) =>
    html
      .replaceAll('<!--%JSONLD_PERSON%-->', JSON.stringify(personJsonLd))
      .replaceAll('<!--%JSONLD_WEBSITE%-->', JSON.stringify(websiteJsonLd));
  return { name: 'jsonld-inject', transformIndexHtml: { order: 'pre', handler: replace } };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), jsonLdInject()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});

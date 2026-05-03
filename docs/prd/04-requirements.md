# 04 — Requisitos

> Funcionais (F1–F9), não-funcionais (perf/SEO/a11y/segurança) e DoD.
> **Carregar quando:** codar interações, validar entrega, fechar PR.

---

## 1. Requisitos Funcionais

| ID | Requisito | Prioridade | Notas de implementação |
|---|---|---|---|
| F1 | Scroll suave entre âncoras | must | `scroll-behavior: smooth` no `html` + `scroll-margin-top` igual à altura do top-bar |
| F2 | Typewriter na tagline do hero (1 ciclo, ~30ms/char) | must | Hook `useTypewriter`. Roda 1x ao montar. Texto completo já no DOM (SR/SEO) com classe que esconde até animação rodar |
| F3 | Cursor block piscando após o typewriter terminar | must | `@keyframes blink` 1s `step-end infinite`. Char `▊` |
| F4 | Botão "copiar email" com feedback visual (✓ por 2s) | must | `navigator.clipboard.writeText`; troca ícone `Copy` → `Check`; reverte em `setTimeout` |
| F5 | Links externos abrem em nova aba com `rel="noopener"` | must | Componente `<ExternalLink>` reutilizável que aplica `target="_blank" rel="noopener noreferrer"` |
| F6 | Status bar fixa no rodapé, sempre visível | should | `position: fixed; bottom: 0`; respeitar `safe-area-inset-bottom` |
| F7 | Stagger fade-in nas seções via IntersectionObserver | should | Hook `useReveal`. `threshold: 0.15`, `once: true`. Adiciona classe `is-revealed` |
| F8 | Atalho `g` + letra para pular pra seção (`gh`=hero, `gc`=cases…) | nice-to-have | Listener global, debounce de 1.5s entre `g` e a letra; ignorar se foco em input |
| F9 | `Cmd+K` placeholder visual (sem ação no MVP) | nice-to-have | Pill no top-bar. Listener pode existir e fazer console.log |

---

## 2. Requisitos Não-Funcionais

### 2.1 Performance (crítico — roda no Pi)

- **Bundle inicial JS** ≤ 80 KB gzipped.
- **CSS inicial** ≤ 15 KB gzipped (Tailwind purgado).
- **LCP** < 1.5s em 4G simulado (Lighthouse mobile).
- **CLS** < 0.05.
- **TBT** < 100ms.
- **Fontes self-hosted** via `@fontsource/jetbrains-mono` (`woff2` only, importar só pesos usados).
- **Sem fontes externas em runtime** (sem Google Fonts CDN).
- **Imagens** em WebP/AVIF com fallback. Lazy-load (`loading="lazy"`) exceto OG e hero.
- **Sem CSS-in-JS runtime** — só Tailwind compilado.
- **Tree-shake agressivo** de `lucide-react`: `import { Github } from 'lucide-react'` (não `import * as`).
- **Code splitting** desnecessário no MVP (single-page, conteúdo curto). Build single-bundle.

### 2.2 SEO

- `<title>`, `<meta description>`, OG/Twitter cards completos.
- JSON-LD `Person` schema (ver `03-content.md` §7).
- OG image gerada (1200×630) em `public/og-image.png`.
- `sitemap.xml` + `robots.txt` em `public/`.
- Canonical URL: `https://leoferolive.com.br/`.
- `lang="pt-BR"` no `<html>`.
- Heading hierarchy correta: 1× `h1` (nome no hero), `h2` por seção, `h3` em cards.

### 2.3 Acessibilidade

- **WCAG AA**: contraste ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande. Validar tokens warm com Stark/Polypane antes de fechar.
- **Navegação por teclado** completa: todos interativos com `:focus-visible` (ver `02-design.md` §8).
- **Skip link** "Pular para conteúdo" (sr-only até foco), pula para `<main id="main">`.
- **Landmarks semânticos**: `<header>`, `<main>`, `<nav>`, `<section aria-labelledby>`, `<footer>`.
- **`prefers-reduced-motion: reduce`** desliga typewriter e fades; mantém apenas feedback de copy (1 frame).
- **`aria-label`** em botões só com ícone.
- **`aria-live="polite"`** no feedback do botão de copy.
- Contraste de placeholders e texto faint precisa ser validado (warn).

### 2.4 Compatibilidade

- Mobile-first. Breakpoints: `sm:480` `md:768` `lg:1024` `xl:1440`.
- Browsers: últimas 2 versões de Chrome/Firefox/Safari + Edge.
- Sem polyfills extras (target ES2020 no `tsconfig`).

### 2.5 Segurança

- **CSP estrita** servida via Nginx/Caddy:
  ```
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' data:;
  connect-src 'self';
  ```
  (`unsafe-inline` em style apenas se Tailwind exigir — ideal: nenhum).
- Sem analytics 3rd-party. Sem cookies. Sem service worker.
- Headers extras: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## 3. Definition of Done (DoD)

### 3.1 Funcional

- [ ] Typewriter completa sem flicker em desktop e mobile.
- [ ] Todas as seções têm anchor ID e a navegação funciona via link e via teclado.
- [ ] Botão "copiar email" mostra checkmark e volta ao normal em 2s.
- [ ] Status bar não cobre conteúdo crítico em mobile (safe-area inset).
- [ ] Links externos validados (sem 404).
- [ ] Em `prefers-reduced-motion: reduce`, conteúdo aparece estaticamente.

### 3.2 Performance

- [ ] Lighthouse Performance ≥ 95 (mobile).
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Best Practices ≥ 95.
- [ ] Bundle JS inicial ≤ 80 KB gzipped (medido via `vite-bundle-visualizer`).

### 3.3 Conteúdo

- [ ] Sem typos. Revisão final dos cases (números: 10k autores, 100k+ artigos, dias→minutos, ~1 mês vs 3+ meses).
- [ ] Cases revisados quanto a NDA Wiley (sem regra de negócio sensível).
- [ ] Links GH/LinkedIn corretos e funcionando.
- [ ] OG image renderizando corretamente em LinkedIn/Twitter preview (testar com [opengraph.xyz](https://opengraph.xyz)).

### 3.4 Deploy

- [ ] CI verde em `main`.
- [ ] HTTPS válido via Cloudflare (cert automático).
- [ ] `leoferolive.com.br` resolvendo e servindo do Pi.
- [ ] Caching headers configurados (assets versionados: `max-age=31536000, immutable`; HTML: `no-cache`).
- [ ] Página estática cacheada na Cloudflare como fallback se Pi cair.

### 3.5 Acessibilidade (validação manual)

- [ ] Tab navigation cobre todos os interativos em ordem visual.
- [ ] VoiceOver/NVDA lê conteúdo na ordem certa.
- [ ] Sem trap de foco.
- [ ] Foco visível em fundo escuro (não confiar só no outline padrão do browser).

# AGENTS.md — leoferolive.com.br

Site pessoal de portfólio. Single-page React + Vite + TS, bilíngue PT/EN, mobile-first, deploy K3s no Raspberry Pi.

## Sempre

- Ler `docs/PRD.md` como ponto de entrada (índice modular pros docs detalhados em `docs/prd/`).
- Spec de design: `docs/superpowers/specs/2026-05-03-cv-enriched-portfolio-design.md`.
- Plans de implementação: `docs/superpowers/plans/`.
- TypeScript strict. Sem `any` exceto justificado em comentário.
- Tailwind v4 apenas (`@theme` em `src/styles/globals.css`). Sem CSS-in-JS runtime.
- Componentes pequenos, props tipadas. Hooks pra comportamento; data em `src/data/`; copy em `src/i18n/{pt,en}.ts`.
- Toda copy nova precisa entrar em PT **e** EN. O `parity.test.ts` falha se chave faltar.

## Comandos

| Comando | Quando |
|---|---|
| `npm run dev` | desenvolvimento (porta 5173) |
| `npm run build` | build de produção (`dist/`) |
| `npm run preview` | preview do build (porta 4173) |
| `npm run lint` | ESLint, zero warnings antes de commit |
| `npm run typecheck` | tsc -b |
| `npm run test:run` | Vitest single-run |
| `npm run format` | Prettier escreve |
| `npm run og:generate` | regenera `public/og-image-{pt,en}.png` via Playwright (requer `npx playwright install chromium` na 1ª vez) |
| `npm run lighthouse` | audita prod local headless (helper) |

Antes de commitar: `npm run lint && npm run typecheck && npm run test:run`.

## Convenções

- Componentes em `src/components/{chrome,sections,ui,layout}/PascalCase.tsx`.
- Hooks em `src/hooks/useCamelCase.ts`. TDD para hooks com lógica.
- Dados estáticos tipados em `src/data/*.ts`.
- Não importar de Google Fonts CDN — usa `@fontsource/jetbrains-mono/latin-{400,500,700,800}.css`.
- Lucide icons em PascalCase (`{ Github, Mail, ... } from 'lucide-react'`).
- SEO: meta estático em `index.html` (default PT — crawlers tipo LinkedIn não rodam JS); `src/seo/Head.tsx` atualiza dinamicamente per-rota no browser.
- OG images em `public/og-image-{pt,en}.png` são geradas pelo template `scripts/og/template.html` + `npm run og:generate` — re-rode quando mudar identidade visual.

## Deploy

- **Runners:** GitHub-hosted (`ubuntu-latest` na maioria, `ubuntu-24.04-arm` no `build-and-push` pra Docker ARM64 nativo). Free pra repos públicos.
- **Branches:** `main` é estável; trabalho em `impl/<topic>` worktrees.
- **CI/CD:**
  - `ci.yml` em PRs e pushes pra main (lint+typecheck+test+build)
  - `release.yml` auto-tagua `vX.Y.Z` em main e dispara dev deploy
  - `deploy-branch-dev.yml` (manual `gh workflow run -f ref=<branch>`) cria RC tag + dev deploy
  - `deploy-prod.yml` (manual `gh workflow run -f tag=vX.Y.Z`) — exige approval no environment `production`
  - `lighthouse.yml` (manual + cron semanal segunda 12 UTC) audita prod
- **Manifests K8s** em `k8s/{prod,dev}/` (raw YAML, no Helm). Imagem em GHCR (`ghcr.io/leoferolive/leoferolive-com-br[-dev]`).
- **Cloudflare Tunnel** termina TLS. Cluster usa HTTP plain. Tunnel já existe e roteia `*.leoferolive.com.br` → Traefik (não precisa adicionar hostname per-projeto).
- **Setup detalhado:** `docs/deploy-guide/`.

## Definition of Done

Ver `docs/prd/04-requirements.md` §3 + delta no spec §8 (CV enrichment).

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

Antes de commitar: `npm run lint && npm run typecheck && npm run test:run`.

## Convenções

- Componentes em `src/components/{chrome,sections,ui,layout}/PascalCase.tsx`.
- Hooks em `src/hooks/useCamelCase.ts`. TDD para hooks com lógica.
- Dados estáticos tipados em `src/data/*.ts`.
- Não importar de Google Fonts CDN — usa `@fontsource/jetbrains-mono/latin-{400,500,700,800}.css`.
- Lucide icons em PascalCase (`{ Github, Mail, ... } from 'lucide-react'`).

## Deploy

- Self-hosted GitHub Actions runner no Pi (ARM64).
- Branches: `main` é estável; trabalho em `impl/<topic>` worktrees.
- CI/CD: pushes em `main` triggam dev deploy automático; prod via `gh workflow run deploy-prod.yml -f tag=vX.Y.Z`.
- Manifests K8s em `k8s/{prod,dev}/`. Imagem em GHCR.
- Cloudflare Tunnel termina TLS. Cluster usa HTTP plain.

## Definition of Done

Ver `docs/prd/04-requirements.md` §3 + delta no spec §8 (CV enrichment).

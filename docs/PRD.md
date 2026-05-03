# PRD — Site Pessoal `leoferolive.com.br`

> **Owner:** Leonardo Fernandes Oliveira
> **Versão:** 0.1 (MVP)
> **Última atualização:** 2026-05-02
> **Status:** Draft → pronto para implementação via Claude Code

---

## TL;DR

Site pessoal de portfólio para **Leonardo Fernandes Oliveira**, Senior Software Engineer com 10+ anos em sistemas distribuídos e foco em **engenharia AI-First**. Materializa a tese *"Construo sistemas que usam IA, e uso IA pra construir sistemas."*

Single-page, dark, terminal/IDE vibe, **PT-BR**. Self-hosted no Raspberry Pi 4B em K3s, exposto via Cloudflare Tunnel em `leoferolive.com.br`. O próprio canal de hospedagem é parte da narrativa.

---

## Decisões-chave (locked)

| Eixo | Decisão |
|---|---|
| Tipo | SPA estática, scroll vertical, 6 seções |
| Idioma | PT-BR (EN fica em v1.1) |
| Tema | Dark fixo, terminal/IDE vibe |
| Stack | React 18 + Vite 5 + TypeScript strict + Tailwind v4 |
| Animação | CSS + IntersectionObserver (sem framer-motion) |
| Tipografia | JetBrains Mono em tudo, self-hosted |
| Ícones | lucide-react (tree-shake) |
| Deploy | Docker multi-stage → Helm chart → K3s no Pi |
| Ingress | Traefik existente + Cloudflare Tunnel |
| CI/CD | GitHub Actions: lint → build → push GHCR → apply via Tailscale |
| Sem | analytics, cookies, blog, CMS, backend, chat IA (v1.2) |

---

## Audiência primária

Recrutadores técnicos e hiring managers de empresas **AI-First** (não "empresas que usam Copilot"). Lê em <60s, escaneia, decide se vale chamar.

---

## Seções (ordem de scroll)

1. **Hero** — nome, tagline com typewriter, CTAs.
2. **Cases de IA em produção** — 4 cards (Log Analyzer, RAG, Revenue Tracking AI-First, Workspace Agêntico).
3. **AI-First Workflow** — como o Leo trabalha (skills, AGENTS.md, MCPs, CI/CD validando código de agente).
4. **Projetos pessoais** — NossaLista, NossaGrana, infra self-hosted.
5. **Stack** — agrupado por domínio.
6. **Contato** — email, GitHub, LinkedIn.

---

## Índice de módulos

Cada módulo é carregado **sob demanda** pelo agente. Este core é a única leitura obrigatória.

| Módulo | Conteúdo | Quando consultar |
|---|---|---|
| [`prd/01-product.md`](./prd/01-product.md) | Contexto, audiência, objetivos, escopo, roadmap, riscos | Decisões de produto, priorização, copy estratégica |
| [`prd/02-design.md`](./prd/02-design.md) | Direção visual, tokens de cor, tipografia, motion, chrome IDE | Implementação visual, componentes, animações |
| [`prd/03-content.md`](./prd/03-content.md) | Copy completo de cada seção (hero, cases, workflow, projects, stack, contact) | Implementação de qualquer seção, ajuste de copy |
| [`prd/04-requirements.md`](./prd/04-requirements.md) | Requisitos funcionais (F1–F9), não-funcionais (perf/SEO/a11y), DoD | Ao codar interações, ao validar entrega |
| [`prd/05-architecture.md`](./prd/05-architecture.md) | Stack detalhado, estrutura de pastas, Dockerfile, Helm, GitHub Actions | Setup do projeto, deploy, CI/CD |

---

## Como usar este PRD (para agentes)

1. **Sempre** ler este `PRD.md` no início da sessão.
2. Carregar apenas os módulos relevantes à tarefa atual:
   - "Implementar hero" → `02-design.md` + `03-content.md` + `04-requirements.md`.
   - "Setup do repo" → `05-architecture.md`.
   - "Ajustar copy do case X" → `03-content.md`.
3. Não inventar conteúdo fora do PRD — se faltar, perguntar.
4. Decisões-chave da tabela acima são **locked**: alterações exigem aprovação explícita.

---

## Próximos passos

1. Revisar copy dos cases em `03-content.md` (sensibilidade de NDA Wiley).
2. Gerar protótipo visual standalone como referência.
3. Iniciar implementação via Claude Code com este PRD + `AGENTS.md` como contexto.
4. Reaproveitar Helm/CI dos projetos NossaLista/NossaGrana.
5. Deploy → validar Lighthouse/SEO → divulgar.

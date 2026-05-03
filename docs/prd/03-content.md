# 03 — Conteúdo

> Copy completo de cada seção. PT-BR.
> **Carregar quando:** implementar qualquer seção, ajustar copy.

---

## 1. Hero (`#home`)

### Layout

```
~ $ whoami

Leonardo Fernandes Oliveira
Senior Software Engineer · AI-First Engineer

> [TYPEWRITER] Construo sistemas que usam IA, e uso IA pra construir sistemas. ▊

Curitiba/BR · 10+ anos · Java · Spring · Wiley

[ GitHub ]  [ LinkedIn ]  [ Email ]
```

### Elementos

- **Prompt linha 1:** `~ $ whoami` (estático).
- **Nome:** `Leonardo Fernandes Oliveira` (display-xl).
- **Subtítulo:** `Senior Software Engineer · AI-First Engineer` (subtitle, `text-muted`).
- **Tagline:** prefixada por `>` em `accent`. Texto faz typewriter ao montar. Cursor block (▊) pisca após terminar.
- **Meta line:** `Curitiba/BR · 10+ anos · Java · Spring · Wiley` (small, `text-faint`).
- **CTAs:** 3 botões estilo "command", layout horizontal em desktop, vertical em mobile.

### CTAs

- `GitHub` → `https://github.com/leoferolive` (target=_blank, rel=noopener)
- `LinkedIn` → `https://www.linkedin.com/in/leonardo-fernandes-oliveira-918935b6/`
- `Email` → `mailto:leoferolive@gmail.com`

### Estilo dos CTAs

```
[ Ícone Label ]
```
Border 1px `border`, hover muda para `border-hover` + glow `accent-soft`. Padding `px-4 py-2`.

---

## 2. Cases de IA em produção (`#cases`)

### Header

- Caption: `// production-ai-cases`
- Title: `Cases de IA em Produção`
- Subtitle: `Quatro entregas que mudaram a operação dentro da Wiley.`

### Cards (4)

Cada card é uma "file card" com:
- **Filename pill** no topo: `01_log_analyzer.case`, `02_rag_platform.case`, etc.
- **Status badge** (canto sup. direito): `✓ in production` em `ok`.
- Bloco JSON-like:
  ```
  {
    problem:  "<…>",
    solution: "<…>",
    impact:   "<…>"
  }
  ```
- Linha de **stack tags** abaixo (pills pequenos).

### Conteúdo dos 4 cases

#### 01 — Análise Automatizada de Logs com LLM
- **filename:** `01_log_analyzer.case`
- **status:** `in production`
- **problem:** `investigação de incidentes levava dias, frequentemente sem identificação da causa raiz.`
- **solution:** `Java 24 + Spring Boot 3 + Spring AI + Azure OpenAI/GPT-4. Consulta Kibana/Elasticsearch por transactionId; LLM identifica sistema de origem e causa raiz.`
- **impact:** `dias → minutos. Em produção, usado por engenharia e suporte.`
- **stack:** `Java 24` `Spring AI` `Azure OpenAI` `Elasticsearch` `Kibana`

#### 02 — Plataforma de Conhecimento RAG
- **filename:** `02_rag_platform.case`
- **status:** `in production (MVP)`
- **problem:** `informação de artigos espalhada em 5+ sistemas internos.`
- **solution:** `Spring AI + Pgvector + Azure OpenAI integrando 5+ fontes. Interfaces de chat e servidor MCP para consultas em linguagem natural.`
- **impact:** `MVP em produção. Suporte e produto consultam por linguagem natural.`
- **stack:** `Spring AI` `Pgvector` `Azure OpenAI` `MCP` `PostgreSQL`

#### 03 — Plataforma AI-First de Tracking de Receita
- **filename:** `03_revenue_tracking.case`
- **status:** `final testing`
- **problem:** `estimativa tradicional 3+ meses para entregar o core.`
- **solution:** `Liderei a vertente de IA em squad de 3. Skills, commands customizados, AGENTS.md e CI/CD validando código gerado por Cursor.`
- **impact:** `core entregue em ~1 mês. Em testes finais.`
- **stack:** `Cursor` `AGENTS.md` `Skills` `CI/CD`

#### 04 — Workspace Agêntico de Engenharia
- **filename:** `04_agentic_workspace.case`
- **status:** `adopted by team`
- **problem:** `onboarding lento e support duty manual.`
- **solution:** `Workspace versionável: skills + AGENTS.md + MCPs (Jira, Kibana). Agente executa support duty E2E (issue → logs → fix → comentário no Jira).`
- **impact:** `adotado pelo time. Disseminado via Conselho de IA Wiley Research BR.`
- **stack:** `Skills` `AGENTS.md` `MCP` `Jira` `Kibana`

---

## 3. AI-First Workflow (`#workflow`)

### Header

- Caption: `// how-i-work`
- Title: `Engenharia AI-First`
- Subtitle: `Mais que autocomplete: agentes entregam features E2E sob revisão humana.`

### Pilares (4 blocos)

```
skills/         convenções reutilizáveis por domínio
                (REST endpoint, Kafka consumer, Spring Security, …)

AGENTS.md       arquitetura, padrões e comandos do projeto
                — contexto que o agente lê primeiro

MCPs            integrações com Jira, Kibana, GitHub, banco
                — agente age, não só sugere

CI/CD ativo     linters + testes + fitness functions + validação
                de contrato. CI vira o revisor automático do agente.
```

### Fechamento

> Resultado: ciclo `issue → plano → código → PR → review → merge` com agente fazendo o trabalho braçal e dev senior validando arquitetura e edge cases.
> Não é magia. É engenharia disciplinada com IA no loop.

---

## 4. Projetos Pessoais (`#projects`)

### Header

- Caption: `// side-projects`
- Title: `Projetos Pessoais`
- Subtitle: `Construídos 100% via AI coding. Em produção, self-hosted.`

### Cards (3)

#### NossaLista
- **type:** `app`
- **name:** `nossalista`
- **description:** `Listas colaborativas em tempo real, compartilhadas entre família/amigos.`
- **stack:** `Java 25` `Spring Boot 4` `React/Vite` `PostgreSQL` `WebSocket`
- **built-with:** `Claude Code + Codex via BMAD`
- **link:** `github.com/leoferolive/nossalista`
- **demo:** `nossalista.leoferolive.com.br`

#### NossaGrana
- **type:** `pwa`
- **name:** `nossagrana`
- **description:** `Gestão de finanças familiares. PWA instalável, offline-first.`
- **stack:** `Node/TS` `React/Vite` `PostgreSQL`
- **built-with:** `Claude Code + Codex`
- **link:** `github.com/leoferolive/nossagrana`

#### Infra Self-Hosted
- **type:** `infra`
- **name:** `homelab`
- **description:** `Tudo em um Raspberry Pi 4B (8GB). K3s, Traefik, Cloudflare Tunnel. OpenClaw + Telegram para administração remota — provisiono bancos, faço deploys e troubleshoot direto pelo chat.`
- **stack:** `Raspberry Pi 4B` `K3s` `Traefik` `Cloudflare Tunnel` `OpenClaw` `Tailscale`
- **link:** `—` (sem repo público; este site é demo viva)

---

## 5. Stack (`#stack`)

### Header

- Caption: `// stack`
- Title: `Stack`
- Subtitle: `Onde sou rápido. Onde sou perigoso.`

### Layout

Quatro colunas em desktop, duas em tablet, uma em mobile. Cada grupo é um "arquivo":

```
ai/                    backend/
├── Spring AI          ├── Java 8–25
├── Pgvector           ├── Spring Boot 4
├── Azure OpenAI       ├── Microservices
├── MCP                ├── BFF
├── Claude Code        ├── Event-driven
├── Cursor             ├── REST + SSE
├── Codex              └── OIDC
├── BMAD
└── RAG

data/                  devops/
├── PostgreSQL         ├── AWS EKS
├── MongoDB            ├── Kubernetes
├── Redis              ├── K3s
├── SQL Server         ├── Helm
├── Oracle             ├── Docker
├── DB2                ├── GitHub Actions
└── Kafka              ├── Jenkins
                       ├── Cloudflare Tunnel
                       └── Traefik
```

Cada item é uma linha mono. Ícone de "└──" antes do último. Hover: `text-primary`.

---

## 6. Contato (`#contact`)

### Header

- Caption: `// contact`
- Title: `Vamos conversar`
- Subtitle: `Curitiba/BR · aberto a remoto · disponibilidade para discutir.`

### Bloco

```
$ contact --leo

email      leoferolive@gmail.com    [📋 copy]
github     github.com/leoferolive
linkedin   /in/leonardo-fernandes-oliveira-918935b6
location   Curitiba, PR — Brasil
```

- Cada linha: chave (text-muted, largura fixa) + valor (link/email).
- Botão `[📋 copy]` → ícone `Copy` do lucide. Ao clicar: troca para `Check` em `ok` por 2s.

### Footer (logo abaixo)

```
~ $ exit

built with React + Vite, hosted on a Raspberry Pi.
2026 · Leonardo Fernandes Oliveira
```

---

## 7. Meta SEO

### `<head>`

- **Title:** `Leonardo Fernandes Oliveira — Senior Software Engineer · AI-First`
- **Description:** `Senior Software Engineer com 10+ anos em Java/Spring e foco em engenharia AI-First. Construo sistemas que usam IA, e uso IA pra construir sistemas.`
- **Lang:** `pt-BR`
- **Canonical:** `https://leoferolive.com.br/`
- **OG image:** `1200×630`, fundo `bg-base`, nome em `display-lg`, tagline, accent dot.

### JSON-LD `Person`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Leonardo Fernandes Oliveira",
  "jobTitle": "Senior Software Engineer",
  "url": "https://leoferolive.com.br",
  "sameAs": [
    "https://github.com/leoferolive",
    "https://www.linkedin.com/in/leonardo-fernandes-oliveira-918935b6/"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  }
}
```

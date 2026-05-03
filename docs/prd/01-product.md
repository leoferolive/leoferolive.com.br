# 01 — Produto

> Contexto, audiência, objetivos, escopo, roadmap e riscos.
> **Carregar quando:** decisões de produto, priorização, copy estratégica, definição de escopo.

---

## 1. Contexto & Visão

Site pessoal de portfólio para **Leonardo Fernandes Oliveira**, Senior Software Engineer com 10+ anos em sistemas distribuídos e foco recente em **engenharia AI-First** (uso de IA para construir software + construção de produtos com IA no core).

A tese central — *"Construo sistemas que usam IA, e uso IA pra construir sistemas"* — deve estar materializada na primeira dobra. O site é a evidência ambulante dessa tese: mínimo, técnico, performático, agêntico no espírito.

### Por que existe

- Posicionamento claro para recrutadores e hiring managers de empresas **AI-First** (não "empresas que usam Copilot", mas empresas onde IA é parte do produto e/ou do fluxo de engenharia).
- Hub único para LinkedIn, GitHub, e contato direto.
- Demonstração técnica viva: o site roda **self-hosted no Raspberry Pi**, em K3s, expondo via Cloudflare Tunnel — coerente com a narrativa do candidato.

---

## 2. Audiência

### Primária

- **Recrutador técnico de empresa AI-First** (hiring manager, CTO, founder). Lê em <60s, escaneia, decide se vale chamar.
- **Engineering Manager / Tech Lead** avaliando senioridade real e fit cultural com fluxos agênticos.

### Secundária

- **Peer devs** vindos do LinkedIn ou GitHub por curiosidade.
- **Convites para palestras / podcasts / Conselho de IA externo.**

### Decisão-chave de copy

Tom direto, técnico, sem jargão de marketing. Português-BR como default (LinkedIn/audiência local). Versão EN fica em backlog (v1.1).

---

## 3. Objetivos & Métricas

| Objetivo | Sinal mensurável |
|---|---|
| Posicionar como AI-First Engineer | Tempo médio na página > 60s |
| Gerar inbound qualificado | Cliques em `mailto:` + cliques em LinkedIn |
| Validar credibilidade técnica | Cliques em projetos GitHub |
| Servir como CTA em outbound | Taxa de reply em candidaturas com o link no rodapé do CV |

### Não-objetivos

Não é blog. Não é capturador de leads. Não tem newsletter. Não tem CMS.

---

## 4. Escopo MVP

### Dentro

- Single-page application, scroll vertical com âncoras.
- 6 seções (`hero`, `cases`, `workflow`, `projects`, `stack`, `contact`).
- Tema dark fixo (terminal/IDE vibe).
- Copy em **PT-BR**.
- Responsivo mobile-first.
- SEO básico (meta, OG image, sitemap, robots).
- Deploy estático no K3s do Pi.

### Fora (v1.1+)

- Chat IA "talk to my portfolio" (RAG do CV via Anthropic API).
- Versão EN com toggle de idioma.
- Blog / case studies longos.
- Analytics (Plausible self-hosted).
- Easter egg `Cmd+K` (command palette).
- Página `/uses` com hardware/software detalhado.

---

## 5. Roadmap

### v1.0 — MVP (este PRD)

PT-BR, sem chat IA, sem analytics, sem blog. Deploy no Pi.

### v1.1 — Polimento

- Versão EN com toggle de idioma.
- Plausible self-hosted.
- `Cmd+K` palette funcional.
- Easter eggs (atalhos `g+letra`, comando secreto).

### v1.2 — Chat IA "Ask Leo"

- Endpoint serverless ou no próprio Pi (Spring Boot AI).
- RAG do CV + cases + LinkedIn about.
- Botão flutuante discreto, abre painel lateral.

### v1.3 — Conteúdo

- 2–3 case studies longos (post-mortem do Log Analyzer, arquitetura do RAG, masterclass de Claude Code).

---

## 6. Riscos

| Risco | Mitigação |
|---|---|
| Pi cair / domínio fora do ar | Cloudflare cache + página estática mesmo se origem falhar |
| Typewriter prejudica LCP | Fonte self-hosted + texto inicial visível, animação só decora |
| Tema dark fixo afasta visitantes | Aceitável — público-alvo é técnico, dark é norma |
| Conteúdo muito específico de IA datar rápido | Manter cases com data implícita ("em produção desde 2025") |
| NDA Wiley em descrições de cases | Revisar `03-content.md` antes de publicar; manter nível de abstração de arquitetura, não de regra de negócio |

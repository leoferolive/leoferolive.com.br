# Spec — Enriquecimento do PRD: portfólio como CV+ bilíngue, mobile-first

> **Status:** Draft → aguardando revisão do usuário
> **Data:** 2026-05-03
> **Owner:** Leonardo Fernandes Oliveira
> **Relação com o PRD:** este documento é um **delta** sobre `docs/PRD.md` + módulos `docs/prd/*`. Onde silente, o PRD original prevalece.

---

## 1. Contexto e motivação

O PRD original posiciona o site como um **portfólio narrativo AI-First** em PT-BR, com 6 seções e EN no backlog (v1.1). Após sessão de brainstorming com o usuário e leitura integral do CV (`docs/Curriculo_Leonardo_Fernandes_Oliveira_PT.docx`), o objetivo do site evoluiu:

- Não é só portfólio — é **CV enriquecido** com mais profundidade que o LinkedIn e os 4 cases originais.
- O usuário busca **vagas internacionais**: EN deixa de ser backlog e vira requisito de MVP.
- O CV revelou material crítico subaproveitado: jornada técnica de 10+ anos (5 deles em sistemas críticos da Bradesco Seguros), case técnico de SSE/Redis Pub/Sub não-IA, liderança/comunidade (Conselho de IA Wiley, mentoria, colaboração com 5 países).
- Acesso esperado é **majoritariamente mobile** (LinkedIn → tap no link no celular). Mobile-first deixa de ser cláusula de compatibilidade e vira **pilar de design**.

A tese central — *"Construo sistemas que usam IA, e uso IA pra construir sistemas"* — permanece, mas ganha **profundidade biográfica** (trajetória) e **alcance internacional** (i18n).

---

## 2. Mudanças nas decisões "locked" do PRD

| Decisão original | Nova decisão | Justificativa |
|---|---|---|
| Idioma: PT-BR (EN em v1.1) | **PT-BR + EN no MVP**, default PT, toggle manual no top bar | Audiência inclui recrutadores internacionais; EN como backlog é incompatível com o objetivo |
| Tipo: SPA, scroll vertical, **6 seções** | SPA, scroll vertical, **7 seções** (adiciona **Trajetória**) | CV traz 10+ anos de experiência cronológica que enriquece credibilidade — sem virar CV burocrático |
| Roteamento: `/` apenas | `/` (PT) + `/en/` (EN), com `hreflang` correto | Necessário para SEO bilíngue; default `.com.br` reforça PT como entry natural |
| Mobile como item de §2.4 (compatibilidade) | **Mobile-first como pilar** (§7 deste doc) | Acesso majoritário será via celular |
| LinkedIn: `linkedin.com/in/leonardo-fernandes-oliveira-918935b6/` | **`linkedin.com/in/leonardo-fer-oliveira/`** | Correção factual — URL no PRD original estava errada |

**Inalteradas:** stack (React 18 + Vite 5 + TS strict + Tailwind v4), tipografia (JetBrains Mono self-hosted), motion (CSS + IntersectionObserver, sem framer-motion), tema dark fixo, deploy (Docker → Helm → K3s/Pi → Cloudflare Tunnel), CI/CD (GitHub Actions), ausências (sem analytics, cookies, blog, CMS, backend, chat IA — chat fica em v1.2).

---

## 3. Arquitetura de informação (7 seções)

Ordem de scroll:

1. **Hero** (`#home`)
2. **Cases de IA + Engenharia em Escala** (`#cases`) — 5 cards (era 4)
3. **Trajetória** (`#career`) — **NOVA**
4. **AI-First Workflow** (`#workflow`)
5. **Projetos Pessoais** (`#projects`)
6. **Stack** (`#stack`)
7. **Contato** (`#contact`)

Top bar persiste; status bar persiste; footer mantém `built with React + Vite, hosted on a Raspberry Pi.`

---

## 4. Detalhamento por seção

> Sintaxe: copy em **PT** é canônica/aprovada. Copy em **EN** é proposta a validar com o usuário antes do go-live (revisão por nativo recomendada).

### 4.1 Hero (`#home`)

**Mudança vs. PRD §3-content.md §1:** + linha de capacidades antes da meta-line; meta-line ajustada.

#### PT
```
~ $ whoami

Leonardo Fernandes Oliveira
Senior Software Engineer · AI-First Engineer

> [TYPEWRITER] Construo sistemas que usam IA, e uso IA pra construir sistemas. ▊

sistemas distribuídos · features de IA em produção · fluxos AI-First
Curitiba/BR · 10+ anos · @Wiley desde 2024

[ GitHub ]  [ LinkedIn ]  [ Email ]
```

#### EN (proposta)
```
~ $ whoami

Leonardo Fernandes Oliveira
Senior Software Engineer · AI-First Engineer

> [TYPEWRITER] I build with AI, and I build AI systems. ▊

distributed systems · AI features in production · AI-First workflows
Curitiba/BR · 10+ years · @Wiley since 2024

[ GitHub ]  [ LinkedIn ]  [ Email ]
```

**Notas de implementação:**
- Linha de capacidades: `text-muted`, sem typewriter (não competir com a tagline).
- Display-xl em `44px` em ≤ 480px (já no PRD §02-design.md §3).
- `@Wiley desde 2024` pode virar âncora pra `#career` (decisão de implementação).

---

### 4.2 Cases de IA + Engenharia em Escala (`#cases`)

**Mudança vs. PRD §3-content.md §2:** passa de 4 → **5 cards**. Adiciona um case técnico não-IA (`04_sse_at_scale.case`). Header da seção atualizado para refletir a inclusão.

**Ordem dos cards (após reorder 2026-05-02):**
1. `01_log_analyzer.case` — Log Analyzer (AI)
2. `02_agentic_workspace.case` — Agentic Workspace (AI) — era id 04
3. `03_revenue_tracking.case` — Revenue Tracking (AI)
4. `04_sse_at_scale.case` — SSE em Escala (Engineering) — era id 05
5. `05_rag_platform.case` — RAG Platform (AI) — era id 02

#### Header

- Caption (PT): `// production-cases`
- Caption (EN): `// production-cases`
- Title (PT): `Cases em Produção`
- Title (EN): `Cases in Production`
- Subtitle (PT): `Cinco entregas que mudaram a operação dentro da Wiley — quatro de IA e uma de engenharia em escala.`
- Subtitle (EN): `Five deliveries that changed operations at Wiley — four AI-driven and one in distributed engineering.`

#### Cards

##### 01 — Log Analyzer (AI)

- **filename:** `01_log_analyzer.case`
- **status:** `in production`
- **category visual:** `ai`
- **stack:** `Java 24` `Spring AI` `Azure OpenAI` `Elasticsearch` `Kibana`

##### 02 — Agentic Workspace (AI)

- **filename:** `02_agentic_workspace.case`
- **status:** `adopted by team`
- **category visual:** `ai`
- **stack:** `Skills` `AGENTS.md` `MCP` `Jira` `Kibana`

##### 03 — Revenue Tracking (AI)

- **filename:** `03_revenue_tracking.case`
- **status:** `final testing`
- **category visual:** `ai`
- **stack:** `Cursor` `AGENTS.md` `Skills` `CI/CD`

##### 04 — SSE em Escala (Redis Pub/Sub + BroadcastChannel)

- **filename:** `04_sse_at_scale.case`
- **status:** `in production`
- **category visual:** `engineering` (badge alternativo, distinto dos cards AI — explorar tom mais frio na implementação se desejável; senão, manter `ok` igual)
- **problem (PT):** `entrega de eventos em tempo real para o frontend em K8s com múltiplos pods — broadcast inconsistente entre instâncias e custo crescente de conexões por aba.`
- **problem (EN):** `real-time event delivery to the frontend in a multi-pod Kubernetes environment — inconsistent broadcast across instances and growing per-tab connection cost.`
- **solution (PT):** `Desenhei E2E a entrega de SSE com Redis Pub/Sub para consistência entre pods, e adicionei camada de BroadcastChannel no frontend para deduplicar conexões por aba. Java 25, Spring Boot 4.`
- **solution (EN):** `Designed end-to-end SSE delivery with Redis Pub/Sub for cross-pod consistency, plus a BroadcastChannel layer on the frontend to deduplicate per-tab connections. Java 25, Spring Boot 4.`
- **impact (PT):** `Eventos consistentes em ambiente multi-pod e redução significativa de carga de conexões no backend. Em produção na plataforma de submissões/publicações da Wiley.`
- **impact (EN):** `Consistent events across pods and significant reduction in backend connection load. In production on Wiley's submissions/publications platform.`
- **stack:** `Java 25` `Spring Boot 4` `Redis Pub/Sub` `SSE` `Kubernetes` `BroadcastChannel API`

##### 05 — RAG Platform (AI)

- **filename:** `05_rag_platform.case`
- **status:** `in production (MVP)`
- **category visual:** `ai`
- **stack:** `Spring AI` `Pgvector` `Azure OpenAI` `MCP` `PostgreSQL`

---

### 4.3 Trajetória (`#career`) — **NOVA**

**Formato escolhido:** opção C do brainstorming — Wiley + Ebix detalhados, demais em uma linha.

#### Header

- Caption (PT): `// career`
- Caption (EN): `// career`
- Title (PT): `Trajetória`
- Title (EN): `Career`
- Subtitle (PT): `Dez anos de engenharia: de sustentação em sinistros a entrega de IA em produção.`
- Subtitle (EN): `Ten years in engineering: from claims systems support to delivering AI in production.`

#### Layout desktop (mono, sem expansão)

```
~/career/

│ Wiley · Senior SE · Dez 2024 → now                    [in progress]
│   UAXD platform · 10k+ autores globalmente · AI-First leadership
│   • Arquitetura SSE/Redis Pub/Sub em K8s com BroadcastChannel — updates assíncronos mantendo a plataforma em tempo real, com sincronia e confiabilidade dos dados
│   • 4 iniciativas de IA em produção (logs, RAG, revenue, workspace)
│   • Co-fundador, Conselho de IA Wiley Research BR
│
│ Ebix · Ref. Técnica · Jun 2019 → Jul 2024             [5 years]
│   Bradesco Seguros · Sinistros · alta criticidade
│   • 500–1.000 sinistros/dia · valores individuais de até R$5M
│   • Integração SAP · BFF P8 FileNet · WebSphere 8 → 9
│   • Mentoria contínua do time — apoio a estagiários e devs juniores no crescimento técnico e arquitetural
│
├── 2024          City Connect · Líder de Projetos · TCE-PR (8 devs)
├── 2018 → 2019   Lumis · SulAmérica · microsserviços OpenShift
└── 2014 → 2018   Persist/Ebix · estágio → pleno
```

#### EN (proposta)
```
~/career/

│ Wiley · Senior SE · Dec 2024 → now                    [in progress]
│   UAXD platform · 10k+ authors globally · AI-First leadership
│   • SSE/Redis Pub/Sub architecture in K8s with BroadcastChannel — async updates keeping the platform real-time, with data sync and reliability
│   • 4 AI initiatives in production (logs, RAG, revenue, workspace)
│   • Co-founder, Wiley Research BR AI Council
│
│ Ebix · Tech Lead · Jun 2019 → Jul 2024                [5 years]
│   Bradesco Seguros · Claims · high financial criticality
│   • 500–1,000 claims/day · individual values up to R$5M
│   • SAP integration · BFF over P8 FileNet · WebSphere 8 → 9 migration
│   • Ongoing team mentorship — supporting interns and junior devs in their technical and architectural growth
│
├── 2024          City Connect · Project Lead · TCE-PR (8 devs)
├── 2018 → 2019   Lumis · SulAmérica · OpenShift microservices
└── 2014 → 2018   Persist/Ebix · intern → mid-level dev
```

#### Comportamento mobile (≤ 480px) — **Decisão C do brainstorming**

- **Wiley:** sempre expandida (header + bullets visíveis).
- **Ebix:** **colapsada por default**. Header visível como `▶ Ebix · Ref. Técnica · 2019 → 2024 [5y]`; tap expande os bullets com transição CSS de `max-height` (sem JS de animação além de toggle de classe).
- **City Connect / Lumis / Persist:** sempre como linha única (já são 1 linha).
- A11y: o "▶" é um `<button aria-expanded>` com `aria-controls` apontando para o painel de bullets; reagir a Enter/Space; respeita `prefers-reduced-motion`.

**Por que C (e não A):** a primeira impressão em mobile precisa caber na tela. Wiley é a posição que conta a história presente; Ebix é prova histórica que recrutador interessado vai abrir. A maioria escaneia rolando — para esses, Ebix colapsada não custa nada.

---

### 4.4 AI-First Workflow (`#workflow`)

**Mudança vs. PRD §3-content.md §3:** + 1 linha de proof point no fechamento.

Header e pilares (skills/, AGENTS.md, MCPs, CI/CD ativo) **mantidos como no PRD**.

#### Fechamento (PT) — versão atualizada
```
> Resultado: ciclo `issue → plano → código → PR → review → merge`
> com agente fazendo o trabalho braçal e dev senior validando arquitetura
> e edge cases. Não é magia. É engenharia disciplinada com IA no loop.
>
> Em 2025: 4 iniciativas de IA em produção, workspace agêntico adotado
> pelo time, padrões disseminados via Conselho de IA Wiley Research BR.
```

#### Fechamento (EN)
```
> Outcome: an `issue → plan → code → PR → review → merge` loop where
> the agent does the legwork and the senior dev validates architecture
> and edge cases. Not magic. Disciplined engineering with AI in the loop.
>
> In 2025: 4 AI initiatives in production, agentic workspace adopted
> by the team, standards rolled out via the Wiley Research BR AI Council.
```

---

### 4.5 Projetos Pessoais (`#projects`)

Três cards: NossaLista, NossaGrana, Homelab.

**Demo links (adicionados 2026-05-02):**
- NossaLista: `demo: 'https://nossalista.leoferolive.com.br'`
- NossaGrana: `demo: 'https://nossagrana.leoferolive.com.br'`
- Homelab: sem demo (o demo É o próprio leoferolive.com.br)

**ProjectCard** renderiza dois links quando presentes:
- `code · github.com/leoferolive/<repo> →`
- `demo · <subdomain>.leoferolive.com.br →`

EN headers/labels:
- Caption: `// side-projects`
- Title (EN): `Personal Projects`
- Subtitle (EN): `Built 100% via AI coding. In production, self-hosted.`
- Cards: traduzir descriptions e built-with conforme PT.

Mobile: grid 1 coluna (já estava no PRD).

---

### 4.6 Stack (`#stack`)

**Mudança vs. PRD §3-content.md §5:** adiciona `ChatGPT` em `ai/`. **Atualizado 2026-05-02:** `Kafka` movido de `data/` para `backend/`; `Tailscale` adicionado em `devops/`.

#### Grupo `ai/` final
```
ai/
├── Spring AI
├── Pgvector
├── Azure OpenAI
├── MCP
├── Claude Code
├── Cursor
├── ChatGPT
├── Codex
├── BMAD
└── RAG
```

#### Grupo `backend/` final
```
backend/
├── Java 8–25
├── Spring Boot 4
├── Microservices
├── BFF
├── Event-driven
├── Kafka
├── REST + SSE
└── OIDC
```

#### Grupo `data/` final
```
data/
├── PostgreSQL
├── MongoDB
├── Redis
├── SQL Server
├── Oracle
└── DB2
```

#### Grupo `devops/` final
```
devops/
├── AWS EKS
├── Kubernetes
├── K3s
├── Helm
├── Docker
├── GitHub Actions
├── Jenkins
├── Cloudflare Tunnel
├── Tailscale
└── Traefik
```

EN headers/labels: traduzir caption/title/subtitle; nomes técnicos permanecem.

Mobile: 1 coluna empilhada (~30 linhas verticais). Decisão consciente: scroll honesto sobre accordion mobile — Stack é seção secundária e recrutador escaneia nomes que reconhece, não lê item por item. Accordion adicionaria JS sem ganho mensurável (sem analytics, não há trigger pra revisitar).

---

### 4.7 Contato (`#contact`)

**Mudança vs. PRD §3-content.md §6:** + 2 linhas (`education`, `languages`); LinkedIn corrigido.

#### PT
```
$ contact --leo

email      leoferolive@gmail.com    [📋 copy]
github     github.com/leoferolive
linkedin   /in/leonardo-fer-oliveira
location   Curitiba, PR — Brasil
education  FAETERJ-RJ · Tec. em Análise e Desenvolvimento de Sistemas
languages  PT (nativo) · EN (profissional)
```

#### EN
```
$ contact --leo

email      leoferolive@gmail.com    [📋 copy]
github     github.com/leoferolive
linkedin   /in/leonardo-fer-oliveira
location   Curitiba, PR — Brazil
education  FAETERJ-RJ · Information Systems Technology
languages  PT (native) · EN (professional)
```

#### Footer (mantido com tradução)

PT:
```
~ $ exit

built with React + Vite, hosted on a Raspberry Pi.
2026 · Leonardo Fernandes Oliveira
```

EN:
```
~ $ exit

built with React + Vite, hosted on a Raspberry Pi.
2026 · Leonardo Fernandes Oliveira
```

Mobile: coluna de chave reduzida (`70px` em vez de `90px`); se < 360px, considerar empilhar chave acima do valor.

---

## 5. Arquitetura i18n

### 5.1 Roteamento

- **PT (default):** `/`, `/#cases`, `/#career`, etc.
- **EN:** `/en/`, `/en/#cases`, `/en/#career`, etc.
- Navegação interna respeita o prefixo de idioma corrente.
- 404 renderiza no idioma corrente.

Implementação: React Router DOM v6 com prefix `:lang?`. SSR não é necessário (SPA + Cloudflare cache).

### 5.2 Fonte da copy

- `src/data/i18n/pt.ts` e `src/data/i18n/en.ts` — objetos tipados com a mesma `interface I18nDictionary`.
- TypeScript garante paridade: chave faltando em qualquer idioma = erro de compilação.
- Hook `useT()` lê o idioma da URL e retorna o dicionário correto.

### 5.3 Toggle PT/EN

- Posição: top bar à direita, **antes** do hint `⌘K`.
- Visual: pill compacta `PT · EN` com idioma corrente sublinhado em `accent` (sem bandeiras — bandeira ↔ idioma é problema cultural; PT pode ser BR ou PT-PT, EN pode ser US/UK/AU).
- Comportamento: click troca a URL para a contraparte (`/` ↔ `/en/`), preservando o hash de seção atual.
- Persistência: `localStorage["lang"]`. Se ao entrar em `/` o usuário já tem `localStorage["lang"] = "en"`, redireciona uma vez para `/en/` (sem auto-detect de browser; só persiste escolha manual prévia).
- A11y: `<button aria-label="Switch language to English / Mudar idioma para Português">` e `aria-pressed` no idioma ativo. `aria-live="polite"` em região anuncia mudança.

### 5.4 SEO bilíngue

- `<html lang>` muda dinamicamente (`pt-BR` ou `en`).
- `<link rel="alternate" hreflang="pt-BR" href="https://leoferolive.com.br/" />` em ambas as páginas.
- `<link rel="alternate" hreflang="en" href="https://leoferolive.com.br/en/" />` em ambas as páginas.
- `<link rel="alternate" hreflang="x-default" href="https://leoferolive.com.br/" />`.
- `<link rel="canonical">` próprio para cada URL (sem cross-canonical).
- `sitemap.xml` lista as duas URLs com `<xhtml:link rel="alternate" hreflang>` em cada uma.
- OG image bilíngue: `public/og-image-pt.png` e `public/og-image-en.png`. `<meta property="og:image">` selecionada conforme idioma.
- `<meta name="description">` traduzida.
- JSON-LD `Person` único (linguagem não-específica), publicado em ambas as páginas.

### 5.5 Fallback

- URL inválida: redireciona para `/` (PT default).
- Sem JS: HTML mínimo serve hero + meta-line (PT na rota `/`, EN na rota `/en/`) — Vite gera HTML estático por rota se necessário; senão, aceitar JS-required.

---

## 6. Mobile-first como pilar (especificação)

### 6.1 Princípio

Projeto começa em `375 × 667` (iPhone SE / base segura). Tudo escala pra cima. **Não** desenhar desktop e espremer.

### 6.2 Targets

| Item | Meta |
|---|---|
| LCP em 4G simulado (mobile) | < 1.5s — gate principal de performance |
| Touch target mínimo | 44 × 44px em todo elemento clicável |
| Tap states explícitos | `:active`, `:focus-visible` definidos para todo interativo |
| Sem hover-only signaling | qualquer feedback de hover tem equivalente visível em mobile |
| Safe-area-inset-bottom | respeitado pela status bar fixa (iOS home indicator) |
| Texto principal | ≥ 16px (evita zoom auto iOS; bom hábito) |

### 6.3 Comportamento por seção em ≤ 480px

| Seção | Comportamento |
|---|---|
| Top bar | breadcrumb central some; mantém traffic lights + toggle PT/EN; hint `⌘K` some |
| Hero | display-xl baixa para 44px; linha de capacidades quebra em 2-3 linhas (assumido no design); CTAs empilhados |
| Cases | grid 1 coluna; filename pill + status badge na mesma linha (ou empilham se não couber) |
| Trajetória | Wiley expandida; **Ebix colapsada por default** (tap to expand); demais como linha única |
| Workflow | pilares empilhados verticalmente |
| Projetos | grid 1 coluna |
| Stack | 1 coluna empilhada (~30 itens scroll vertical — aceitável no MVP) |
| Contato | coluna de chave em 70px; se < 360px empilhar chave/valor |
| Status bar | mantém só esquerda (i18n `chrome.statusBarLeft` — PT: `✓ aberto a remoto · horário UTC-3` / EN: `✓ open to remote · UTC-3 office hours`); esconde direita |

### 6.4 Performance mobile (mais crítica)

- Imagens **sempre WebP/AVIF** com `loading="lazy"` (exceto OG).
- JetBrains Mono: importar **só pesos efetivamente usados**; reavaliar se `200` é necessário (provavelmente removível).
- `loading="eager"` + `fetchpriority="high"` no LCP element do hero.
- Sem JS de scroll/parallax (já vetado no PRD).
- Validar bundle JS gzipped em ≤ 80 KB **incluindo** router + payload de copy bilíngue.

---

## 7. Riscos novos e mitigações

| Risco | Mitigação |
|---|---|
| **Manutenção 2x da copy (PT/EN)** | Tipo TS compartilhado; lint custom que falha se chave faltar em qualquer idioma; PR template com checkbox "atualizei PT e EN" |
| **SEO bilíngue mal configurado** | Hreflang correto em ambas as páginas; sitemap separando URLs; canonical por página; validar com Search Console pós-deploy |
| **Tradução EN preguiçosa** | Revisão por nativo OU revisão por Claude focada em naturalidade idiomática antes do go-live |
| **Trajetória pesada em mobile** | Comportamento C (Ebix colapsada) elimina 5-7 linhas iniciais |
| **SSE case dilui o framing AI-First** | Subtítulo da seção explicita "quatro de IA e uma de engenharia em escala"; ordem dos cards mantém os 4 AI primeiro |
| **Stack mobile longo (1 coluna × ~30 itens)** | Decisão consciente — accordion considerado e descartado (seção secundária, recrutador escaneia, accordion adicionaria JS sem trigger mensurável) |
| **"@Wiley desde 2024" pode parecer pouco tempo de casa** | A Trajetória logo abaixo contextualiza com as 4 iniciativas + Conselho IA — sinaliza impacto, não tempo |
| **Auto-redirect baseado em localStorage pode confundir usuário curioso** | Toggle visível e óbvio; redirect só ocorre se houver escolha prévia explícita; mudança de idioma é 1 click |

---

## 8. Definition of Done (delta sobre PRD §04-requirements.md §3)

### Adições

#### Funcional
- [ ] Toggle PT/EN troca idioma e preserva hash de seção corrente.
- [ ] Toggle PT/EN persiste escolha em `localStorage` e respeita ao recarregar.
- [ ] Trajetória mobile: Ebix colapsada por default; tap expande com transição.
- [ ] Trajetória mobile: respeita `prefers-reduced-motion` (sem transição).
- [ ] SSE case (#05) presente com filename, status, problem/solution/impact, stack pills.
- [ ] Linhas `education` e `languages` presentes no Contato em ambos os idiomas.
- [ ] LinkedIn aponta para `/in/leonardo-fer-oliveira/`.

#### i18n / SEO
- [ ] `<html lang>` muda corretamente entre `pt-BR` e `en`.
- [ ] `hreflang` correto em ambas as páginas (`pt-BR`, `en`, `x-default`).
- [ ] `sitemap.xml` lista as duas URLs com alternates.
- [ ] OG image renderiza versão correta por idioma.
- [ ] Lighthouse ≥ 95 (Perf/A11y/SEO/Best Practices) em **ambas** as URLs (`/` e `/en/`), mobile e desktop.
- [ ] Validação automática de paridade PT/EN (script CI: chaves iguais nos dois dicionários).

#### Mobile-first
- [ ] Todos os interativos com touch target ≥ 44×44px (medido em DevTools).
- [ ] Sem feedback exclusivo de hover (smoke test em DevTools mobile).
- [ ] LCP < 1.5s em 4G simulado (Lighthouse mobile) — em ambas as URLs.
- [ ] Status bar respeita safe-area-inset-bottom em iPhone real ou simulador.

#### Conteúdo
- [ ] Copy EN revisada por nativo OU passada em revisão de naturalidade idiomática.
- [ ] Trajetória revisada quanto a NDA Wiley (números agregados, não regra de negócio sensível).

---

## 9. O que sai do escopo desta spec

- Implementação concreta (componentes, código, deploy) — vai pra plano de implementação separado.
- Chat IA "Ask Leo" — segue em v1.2 do PRD original.
- Easter eggs `g+letra`, `Cmd+K` funcional — seguem em v1.1.
- Analytics — segue em v1.1.
- Versão imprimível do site / export PDF — não previsto.

---

## 10. Próximos passos

1. **Revisão do usuário:** ler este spec e validar (especialmente os textos PT canônicos e a proposta EN).
2. **Atualizar PRD original** (`docs/PRD.md` + `docs/prd/*`) com as mudanças deste delta — pode ser feito como parte do plano de implementação OU como passo separado de "PRD update PR".
3. **Plano de implementação** via skill `writing-plans`: quebra em tarefas executáveis (setup do repo, i18n base, cada seção, deploy).
4. **Execução** via worktrees separadas conforme regra global do usuário.

---

## Anexo A — Resumo de decisões da sessão de brainstorming

| Decisão | Escolha do usuário |
|---|---|
| Direção macro | CV+ (timeline + 1-2 cases técnicos extras + i18n no MVP) |
| Curadoria de cases | A — 4 AI + 1 técnico (SSE/Redis) = 5 total |
| Formato Trajetória | C — Wiley + Ebix detalhados, demais em 1 linha |
| Bloco Liderança & Comunidade | A — absorver em Trajetória, sem bloco dedicado |
| i18n estratégia | B — paridade total + default sempre PT + toggle manual |
| Hero | B — adicionar linha de capacidades antes da meta |
| Workflow + Projetos | apenas mudança 1 — proof point no Workflow (sem badge meta no Homelab, sem links demo extras) |
| Stack | B — adicionar `ChatGPT` em `ai/` |
| Contato | A — duas linhas extras (`education`, `languages`) no bloco existente |
| Mobile-first | elevado a pilar; Trajetória mobile com C (Ebix colapsada) |

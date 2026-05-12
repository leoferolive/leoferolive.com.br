import type { Diagram } from './types';

export const unifiedDiagram: Diagram = {
  id: 'unified',
  title: { pt: 'Arquitetura — visão geral', en: 'Architecture — overview' },
  caption: {
    pt: 'Borda Cloudflare → k3s no Pi 4B 8GB com site estático e chat-api (FastAPI + LLM router + RAG via wiki + observabilidade) — tudo em uma vista.',
    en: 'Cloudflare edge → k3s on a Pi 4B 8GB with the static site and chat-api (FastAPI + LLM router + RAG over the wiki + observability) — everything in one view.',
  },
  nodes: [
    {
      id: 'you',
      label: 'Você',
      sublabel: { pt: 'visitante · qualquer browser', en: 'visitor · any browser' },
      iconSlug: '',
      col: 1,
      row: 5,
      details: {
        description: {
          pt: 'Quem está lendo este diagrama agora — entrada no fluxo HTTPS.',
          en: 'Whoever is reading this diagram — entry point of the HTTPS flow.',
        },
      },
    },
    {
      id: 'developer',
      label: 'Leo',
      sublabel: { pt: 'autor · push de código', en: 'author · code push' },
      iconSlug: 'github',
      col: 3,
      row: 1,
      offsetX: 50,
      details: {
        description: {
          pt: 'Eu (Leonardo). Edito o código localmente e dou `git push` no `main` do repositório do site/chat-api — é o que dispara o pipeline.',
          en: 'Me (Leonardo). I edit the code locally and `git push` to `main` of the site/chat-api repo — that\'s what triggers the pipeline.',
        },
        technical: { kind: 'External' },
      },
    },
    {
      id: 'cloudflare-dns',
      label: 'Cloudflare DNS',
      sublabel: {
        pt: 'leoferolive.com.br · proxy ativo',
        en: 'leoferolive.com.br · proxied',
      },
      iconSlug: 'cloudflare',
      col: 2,
      row: 5,
      details: {
        description: {
          pt: 'Resolve `leoferolive.com.br` e `chat.leoferolive.com.br` e termina TLS na borda da Cloudflare. Certificado universal grátis.',
          en: 'Resolves `leoferolive.com.br` and `chat.leoferolive.com.br` and terminates TLS on the Cloudflare edge. Free universal cert.',
        },
        technical: { kind: 'External' },
        decisions: [
          {
            pt: 'Proxy ativo (nuvem laranja) → IP de origem nunca exposto, mitiga DDoS gratuitamente.',
            en: 'Proxied (orange cloud) → origin IP never exposed, free DDoS mitigation.',
          },
        ],
      },
    },
    {
      id: 'cloudflare-tunnel',
      label: 'Cloudflare Tunnel',
      sublabel: { pt: 'cloudflared · ns: cloudflared', en: 'cloudflared · ns: cloudflared' },
      iconSlug: 'cloudflare',
      col: 3,
      row: 5,
      details: {
        description: {
          pt: 'Pod cloudflared dentro do cluster cria túnel saindo para a Cloudflare. Sem porta aberta no roteador. Recebe tanto requests do site quanto do chat-api.',
          en: 'cloudflared pod inside the cluster opens an outbound tunnel to Cloudflare. No router port opened. Handles both site and chat-api requests.',
        },
        technical: {
          kind: 'Deployment',
          namespace: 'cloudflared',
        },
        decisions: [
          {
            pt: 'Substitui port-forward + DDNS. Conexão saída-only — o Pi nunca aceita conexões do mundo externo diretamente.',
            en: 'Replaces port-forward + DDNS. Outbound-only — the Pi never accepts direct inbound connections.',
          },
        ],
      },
    },
    {
      id: 'traefik',
      label: 'Traefik',
      sublabel: { pt: 'ingress controller · ns: traefik-system', en: 'ingress controller · ns: traefik-system' },
      iconSlug: 'traefikproxy',
      col: 4,
      row: 5,
      details: {
        description: {
          pt: 'Ingress controller padrão do k3s. Roteia 2 hosts: `leoferolive.com.br` → **site Pod**, `chat.leoferolive.com.br` → **chat-api**. **TLS termina na Cloudflare**: todos os IngressRoutes usam apenas o entrypoint `web` (HTTP cleartext) entre Cloudflare Tunnel → Traefik → Pod — confiamos no túnel cloudflared para o transporte criptografado.',
          en: 'Default k3s ingress controller. Routes 2 hosts: `leoferolive.com.br` → **site Pod**, `chat.leoferolive.com.br` → **chat-api**. **TLS terminates at Cloudflare**: all IngressRoutes use only the `web` entrypoint (HTTP cleartext) between Cloudflare Tunnel → Traefik → Pod — we trust the cloudflared tunnel for encrypted transport.',
        },
        technical: {
          kind: 'Deployment',
          namespace: 'traefik-system',
        },
        decisions: [
          {
            pt: 'Mantive o Traefik que vem com o k3s — zero configuração extra para HTTPS/host-routing.',
            en: 'Kept the Traefik that ships with k3s — zero extra config for HTTPS/host-routing.',
          },
        ],
      },
    },
    {
      id: 'site-pod',
      label: 'site Pod',
      sublabel: { pt: 'nginx + dist/ na mesma imagem', en: 'nginx + dist/ in one image' },
      iconSlug: 'nginx',
      col: 5,
      row: 4,
      details: {
        description: {
          pt: 'Imagem multi-stage que serve o build Vite estático com nginx no mesmo container do app. SPA fallback, gzip, cache imutável de assets versionados, headers CSP.',
          en: 'Multi-stage image that serves the static Vite build with nginx inside the same app container. SPA fallback, gzip, immutable cache for versioned assets, CSP headers.',
        },
        technical: {
          kind: 'Deployment',
          namespace: 'leoferolive-com-br',
        },
        decisions: [
          {
            pt: 'Single replica é suficiente — site estático tem zero estado e o ARM64 do Pi é o gargalo, não a réplica.',
            en: 'Single replica is enough — the static site is stateless and the ARM64 Pi is the bottleneck, not replicas.',
          },
          {
            pt: 'Sem CDN próprio: a Cloudflare na frente já cacheia agressivamente os assets versionados.',
            en: 'No own CDN: Cloudflare on the edge already aggressively caches versioned assets.',
          },
        ],
      },
    },
    {
      id: 'fastapi',
      label: 'chat-api',
      sublabel: { pt: 'FastAPI', en: 'FastAPI' },
      iconSlug: 'fastapi',
      col: 5,
      row: 5,
      highlight: true,
      details: {
        description: {
          pt: 'Aplicação FastAPI que serve o stream de chat via SSE. Usa um **LLM router** (`response_format=json_object`) que lê o índice da wiki + as últimas turns e devolve paths validados; em seguida monta prompt PT/EN com persona em terceira pessoa e chama a cadeia de LLMs com fallback.',
          en: 'FastAPI application that serves the chat stream via SSE. Uses an **LLM router** (`response_format=json_object`) that reads the wiki index plus the last turns and returns validated paths; then builds a PT/EN prompt with a third-person persona and calls the LLM fallback chain.',
        },
        technical: {
          kind: 'Deployment',
          namespace: 'chat-api',
        },
        decisions: [
          {
            pt: 'Single replica + Recreate: simples e suficiente para o volume real. Estado vive em PVC, não em memória.',
            en: 'Single replica + Recreate: simple and enough for real traffic. State lives in PVC, not in memory.',
          },
        ],
      },
    },
    {
      id: 'llm-router',
      label: 'LLM Router',
      sublabel: { pt: 'LiteLLM · fallback em cascata', en: 'LiteLLM · cascade fallback' },
      iconSlug: 'python',
      col: 6,
      row: 5,
      details: {
        description: {
          pt: 'LiteLLM abstrai os providers e tenta um por um. Falha no "open" ou "early" (antes do 1º token) → tenta o próximo. Falha "mid" → erro pro cliente.',
          en: 'LiteLLM abstracts providers and tries them in order. "Open" or "early" failure (before the 1st token) → next. "Mid" failure → error to the client.',
        },
        decisions: [
          {
            pt: 'Múltiplos providers de baixo custo > um caro. Latência média menor e custo controlado mesmo se um provider degrada.',
            en: 'Many cheap providers > one premium. Lower median latency and capped cost even when one provider degrades.',
          },
        ],
      },
    },
    {
      id: 'gemini',
      label: 'Gemini 2.5 Flash',
      sublabel: { pt: 'primário · Google', en: 'primary · Google' },
      iconSlug: 'googlegemini',
      col: 7,
      row: 5,
      details: {
        description: {
          pt: 'Provider primário. Boa qualidade para resposta curta, custo baixo, latência aceitável a partir do Brasil.',
          en: 'Primary provider. Good short-answer quality, low cost, acceptable latency from Brazil.',
        },
        technical: { kind: 'External' },
      },
    },
    {
      id: 'openrouter',
      label: 'OpenRouter',
      sublabel: { pt: 'fallback · pool de modelos', en: 'fallback · model pool' },
      iconSlug: 'openrouter',
      col: 8,
      row: 5,
      details: {
        description: {
          pt: 'OpenRouter atua como **pool de fallback** — vários modelos configuráveis acionados em cascata se o primário falhar antes do 1º token. A escolha de modelos exatos é tunada por ambiente em variável de ambiente (`LLM_PROVIDERS`), evitando lock-in num modelo específico.',
          en: 'OpenRouter acts as a **fallback pool** — multiple swappable models triggered in cascade if the primary fails before the 1st token. The exact model lineup is tuned per-environment via the `LLM_PROVIDERS` env var, avoiding lock-in on any single model.',
        },
        technical: { kind: 'External' },
      },
    },
    {
      id: 'wiki-prep',
      label: 'wiki-prep',
      sublabel: { pt: 'init container · busybox', en: 'init container · busybox' },
      iconSlug: 'linux',
      col: 6,
      row: 2,
      details: {
        description: {
          pt: 'Init container idempotente que limpa resíduos legados na raiz do PVC e garante o diretório da wiki com permissões certas para o git-sync.',
          en: 'Idempotent init container that wipes legacy residue at the PVC root and ensures the wiki directory has proper perms for git-sync.',
        },
        technical: { kind: 'Pod' },
      },
    },
    {
      id: 'pvc-wiki',
      label: 'PVC wiki',
      sublabel: { pt: 'wiki sincronizada', en: 'synced wiki' },
      iconSlug: 'kubernetes',
      col: 4,
      row: 3,
      details: {
        description: {
          pt: 'Volume persistente que guarda o clone do repositório de wiki — escrito pelo git-sync, lido (read-only) pelo app.',
          en: 'PersistentVolume that stores the wiki repo clone — written by git-sync, read-only by the app.',
        },
      },
    },
    {
      id: 'git-sync',
      label: 'git-sync',
      sublabel: { pt: 'sidecar', en: 'sidecar' },
      iconSlug: 'git',
      col: 6,
      row: 3,
      details: {
        description: {
          pt: 'Sidecar oficial do Kubernetes que faz git pull periódico no repositório leoferolive-wiki, mantendo o link `current` atualizado para a aplicação ler.',
          en: 'Official Kubernetes sidecar that periodically git-pulls leoferolive-wiki, keeping the `current` symlink fresh for the app to read.',
        },
        technical: {
          kind: 'Pod',
        },
        decisions: [
          {
            pt: 'Sidecar > webhook: o app não precisa lidar com pull/clone/locking. Crash do sidecar não derruba o app.',
            en: 'Sidecar > webhook: the app does not deal with pull/clone/locking. Sidecar crash does not bring the app down.',
          },
        ],
      },
    },
    {
      id: 'wiki-repo',
      label: 'leoferolive-wiki',
      sublabel: { pt: 'github.com · público', en: 'github.com · public' },
      iconSlug: 'github',
      col: 9,
      row: 3,
      details: {
        description: {
          pt: 'Repositório Git separado com índice + páginas markdown. Pattern "LLM Wiki" do Karpathy: index.md como catálogo, categorias em subpastas (entities, skills, projects).',
          en: 'Separate Git repo with index + markdown pages. Karpathy "LLM Wiki" pattern: index.md as catalog, categories in subfolders (entities, skills, projects).',
        },
        technical: { kind: 'External' },
        links: [
          {
            label: { pt: 'ver no GitHub', en: 'view on GitHub' },
            href: 'https://github.com/leoferolive/leoferolive-wiki',
          },
        ],
      },
    },
    {
      id: 'pvc-db',
      label: 'PVC SQLite',
      sublabel: { pt: 'sessions, messages, daily_calls', en: 'sessions, messages, daily_calls' },
      iconSlug: 'sqlite',
      col: 6,
      row: 6,
      details: {
        description: {
          pt: 'SQLite via aiosqlite. Tabelas: sessions, messages, daily_calls. Writes fire-and-forget para não bloquear o stream SSE.',
          en: 'SQLite via aiosqlite. Tables: sessions, messages, daily_calls. Fire-and-forget writes to avoid blocking the SSE stream.',
        },
        decisions: [
          {
            pt: 'SQLite e não Postgres compartilhado: zero conexão de rede, footprint mínimo, e o app é single-pod — não há contenção entre escritores.',
            en: 'SQLite over shared Postgres: zero network hops, tiny footprint, and the app is single-pod — no writer contention.',
          },
        ],
      },
    },
    {
      id: 'github-actions',
      label: 'GitHub Actions',
      sublabel: { pt: 'CI · lint/test/build', en: 'CI · lint/test/build' },
      iconSlug: 'githubactions',
      col: 4,
      row: 1,
      offsetX: 50,
      details: {
        description: {
          pt: 'Disparada por push em `main` (ou tag de release). CI roda lint + typecheck + Vitest + build Vite. Quando passa, um job dedicado em runner ARM nativo gera a imagem ARM64 e envia ao GHCR. Deploy em **dev** é automático após CI verde; **prod** exige disparo manual com gate.',
          en: 'Triggered by push to `main` (or a release tag). CI runs lint + typecheck + Vitest + Vite build. On green, a dedicated job on a native ARM runner produces the ARM64 image and pushes it to GHCR. **Dev** deploys automatically after green CI; **prod** requires a manual dispatch with a gate.',
        },
        decisions: [
          {
            pt: 'Runner ARM nativo no job de build da imagem evita emulação — build cai de minutos para segundos. CI principal (lint/test) fica em x86, que é mais rápido para Node.',
            en: 'Native ARM runner on the image-build job skips emulation — the build drops from minutes to seconds. The main CI (lint/test) stays on x86, which is faster for Node.',
          },
        ],
      },
    },
    {
      id: 'ghcr',
      label: 'GHCR',
      sublabel: { pt: 'registry de imagens', en: 'image registry' },
      iconSlug: 'github',
      col: 5,
      row: 1,
      offsetX: 50,
      details: {
        description: {
          pt: 'GitHub Container Registry guarda **dois repositórios** para cada projeto: um de prod e um de dev. Site e chat-api seguem o mesmo padrão prod/dev.',
          en: 'GitHub Container Registry stores **two repositories** for each project: one for prod and one for dev. Site and chat-api follow the same prod/dev pattern.',
        },
        technical: { kind: 'External' },
      },
    },
    {
      id: 'tailscale',
      label: 'Tailscale',
      sublabel: { pt: 'VPN para acessar o k3s', en: 'VPN to reach the k3s API' },
      iconSlug: 'tailscale',
      col: 3,
      row: 6,
      offsetX: -50,
      details: {
        description: {
          pt: 'GitHub Action sobe na VPN Tailscale para atingir o API server do k3s sem expor a porta dele publicamente.',
          en: 'The GitHub Action joins the Tailscale VPN to reach the k3s API server without exposing its port publicly.',
        },
        technical: { kind: 'External' },
      },
    },
    {
      id: 'k3s',
      label: 'k3s',
      sublabel: { pt: 'cluster · Raspberry Pi ARM64', en: 'cluster · ARM64 Raspberry Pi' },
      iconSlug: 'kubernetes',
      type: 'cluster',
      col: 4,
      row: 2,
      offsetX: -30,
      offsetY: -50,
      width: 1860,
      height: 1210,
      details: {
        description: {
          pt: 'k3s single-node rodando num Raspberry Pi ARM64 com Ubuntu. Hospeda este site, o chat-api, dois apps full-stack (nossagrana, nossalista), Postgres compartilhado e o stack kube-prometheus. Tudo dentro deste retângulo roda no mesmo cluster.',
          en: 'k3s single-node running on an ARM64 Raspberry Pi with Ubuntu. Hosts this site, chat-api, two full-stack apps (nossagrana, nossalista), shared Postgres and the kube-prometheus stack. Everything inside this rectangle runs on the same cluster.',
        },
        decisions: [
          {
            pt: 'k3s vs k8s "puro": footprint de memória bem menor, vem com Traefik e local-path-provisioner — caseiro mas honesto.',
            en: 'k3s vs vanilla k8s: much smaller memory footprint, ships with Traefik and local-path-provisioner — homemade but honest.',
          },
        ],
      },
    },
    {
      id: 'prometheus',
      label: 'Prometheus',
      sublabel: { pt: 'kube-prometheus-stack · ns: monitoring', en: 'kube-prometheus-stack · ns: monitoring' },
      iconSlug: 'prometheus',
      col: 6,
      row: 7,
      details: {
        description: {
          pt: 'Scrape periódico do endpoint de métricas via ServiceMonitor. Coleta métricas customizadas (chats, tokens, latência p95, falhas por provider, cost-gate hits, daily calls).',
          en: 'Periodic scrape of the metrics endpoint via ServiceMonitor. Collects custom metrics (chats, tokens, p95 latency, per-provider failures, cost-gate hits, daily calls).',
        },
        technical: {
          kind: 'StatefulSet',
          namespace: 'monitoring',
        },
      },
    },
    {
      id: 'grafana',
      label: 'Grafana',
      sublabel: { pt: 'dashboard chat-api', en: 'chat-api dashboard' },
      iconSlug: 'grafana',
      col: 7,
      row: 7,
      details: {
        description: {
          pt: 'Dashboard `chat-api` dedicado com painéis de chats/min, tokens/dia, gauge de **chamadas LLM hoje vs limite diário** (cost-gate), latências percentílicas, provider mix, falhas por phase (open/early/mid), CPU e memória. Vive em `grafana.leoferolive.com.br`.',
          en: 'Dedicated `chat-api` dashboard with panels for chats/min, tokens/day, a gauge of **today\'s LLM calls vs daily limit** (cost-gate), percentile latencies, provider mix, failures by phase (open/early/mid), CPU and memory. Lives at `grafana.leoferolive.com.br`.',
        },
        technical: { kind: 'Deployment', namespace: 'monitoring' },
      },
    },
    {
      id: 'alertmanager',
      label: 'Alertmanager',
      sublabel: { pt: '14 alertas (cost · pod · latency)', en: '14 alerts (cost · pod · latency)' },
      iconSlug: 'prometheus',
      col: 8,
      row: 7,
      details: {
        description: {
          pt: 'PrometheusRule com 14 alertas em 3 grupos (cost, abuse, health): consumo de tokens, taxa de erro, todos os providers caídos, latência alta, OOMKilled, CrashLoop, ImagePull, pressão de memória, CPU throttling, etc. Publica em **Telegram DM** via dois receivers (warning e critical).',
          en: 'PrometheusRule with 14 alerts across 3 groups (cost, abuse, health): token consumption, error rate, all providers down, high latency, OOMKilled, CrashLoop, ImagePull, memory pressure, CPU throttling, etc. Pushes to **Telegram DM** via two receivers (warning and critical).',
        },
        technical: { kind: 'StatefulSet', namespace: 'monitoring' },
      },
    },
  ],
  edges: [
    // Runtime data path (row 5 horizontal)
    { source: 'you', target: 'cloudflare-dns', label: { pt: 'HTTPS', en: 'HTTPS' }, animated: true, variant: 'data' },
    { source: 'cloudflare-dns', target: 'cloudflare-tunnel', label: { pt: 'túnel', en: 'tunnel' }, animated: true, variant: 'data' },
    { source: 'cloudflare-tunnel', target: 'traefik', animated: true, variant: 'data' },
    { source: 'traefik', target: 'site-pod', sourceHandle: 'top', targetHandle: 'bottom', label: { pt: 'host site', en: 'site host' }, animated: true, variant: 'data' },
    { source: 'traefik', target: 'fastapi', label: { pt: '/chat/stream', en: '/chat/stream' }, animated: true, variant: 'data' },
    { source: 'fastapi', target: 'llm-router', animated: true, variant: 'data' },
    { source: 'llm-router', target: 'gemini', label: { pt: 'primário', en: 'primary' }, animated: true, variant: 'data' },
    { source: 'llm-router', target: 'openrouter', sourceHandle: 'bottom', targetHandle: 'bottom', label: { pt: 'fallback', en: 'fallback' }, animated: true, variant: 'data' },

    // Wiki / RAG
    { source: 'wiki-prep', target: 'pvc-wiki', sourceHandle: 'bottom', targetHandle: 'top', label: { pt: 'chown', en: 'chown' }, animated: true, variant: 'control' },
    { source: 'git-sync', target: 'pvc-wiki', sourceHandle: 'left', targetHandle: 'right', label: { pt: 'sync 60s', en: 'sync 60s' }, animated: true, variant: 'data' },
    { source: 'wiki-repo', target: 'git-sync', sourceHandle: 'left', targetHandle: 'right', label: { pt: 'git pull', en: 'git pull' }, animated: true, variant: 'data' },
    { source: 'pvc-wiki', target: 'fastapi', sourceHandle: 'right', targetHandle: 'left', label: { pt: 'read-only', en: 'read-only' }, animated: true, variant: 'data' },

    // DB
    { source: 'fastapi', target: 'pvc-db', sourceHandle: 'bottom', targetHandle: 'top', label: { pt: 'aiosqlite', en: 'aiosqlite' }, animated: true, variant: 'data' },

    // Build / deploy
    { source: 'developer', target: 'github-actions', label: { pt: 'git push', en: 'git push' }, animated: true, variant: 'control' },
    { source: 'github-actions', target: 'ghcr', label: { pt: 'docker push', en: 'docker push' }, animated: true, variant: 'control' },
    { source: 'ghcr', target: 'k3s', sourceHandle: 'bottom', targetHandle: 'top', label: { pt: 'imagePull', en: 'imagePull' }, animated: true, variant: 'control' },
    { source: 'github-actions', target: 'tailscale', sourceHandle: 'bottom', targetHandle: 'left', label: { pt: 'VPN up', en: 'VPN up' }, animated: true, variant: 'control' },
    { source: 'tailscale', target: 'k3s', sourceHandle: 'right', targetHandle: 'left', label: { pt: 'kubectl set image', en: 'kubectl set image' }, animated: true, variant: 'control' },

    // Observability
    { source: 'prometheus', target: 'fastapi', sourceHandle: 'left', targetHandle: 'bottom', label: { pt: '/metrics 30s', en: '/metrics 30s' }, animated: true, variant: 'observability' },
    { source: 'prometheus', target: 'grafana', animated: true, variant: 'observability' },
    { source: 'prometheus', target: 'alertmanager', sourceHandle: 'bottom', targetHandle: 'bottom', animated: true, variant: 'observability' },
  ],
};

# Deploy Infra Plan (Plano 2 de 2)

> **For agentic workers:** REQUIRED SUB-SKILL: `@superpowers:subagent-driven-development` (recommended) or `@superpowers:executing-plans` to implement task-by-task.
>
> **For verification:** REQUIRED SUB-SKILL: `@superpowers:verification-before-completion`. Run commands; confirm output before marking done.
>
> **Worktree:** execute in `../leoferolive.com.br-impl-deploy` on branch `impl/deploy`.

**Goal:** Colocar `leoferolive.com.br` em produção no Raspberry Pi via K3s + Cloudflare Tunnel, com pipeline de CI/CD que: (1) builda e empurra imagem ARM64 ao GHCR, (2) deploya em ambiente `dev` automaticamente em pushes pra `main`, (3) deploya em `prod` via dispatch manual + approval em GitHub Environment.

**Architecture:** Raw K8s YAML (sem Helm) em `k8s/{dev,prod}/`, copiando o padrão de `nossalista` e `nossagrana`. Pi atua como self-hosted GitHub Actions runner (sem hosted runner, sem SSH). Cloudflare Tunnel termina TLS e roteia para o serviço K8s plain HTTP via tunnel já existente no cluster. Imagem multi-stage Node builder → `nginx:alpine` para servir o `dist/` da Vite com fallback SPA + CSP estrita.

**Tech Stack:**
- **Container:** `node:20-alpine` (build) + `nginx:1.27-alpine` (runtime)
- **Orquestração:** K3s no Pi 4B, namespace `leoferolive-com-br` (prod) e `leoferolive-com-br-dev` (dev)
- **Ingress:** Traefik (já no cluster) com `traefik.ingress.kubernetes.io/router.entrypoints: web`
- **Registry:** GHCR (`ghcr.io/leoferolive/leoferolive-com-br`)
- **CI/CD:** GitHub Actions self-hosted runner ARM64 no Pi
- **Tunnel:** `cloudflared` Deployment (já existente em ns `cloudflared`), public hostname configurado via Cloudflare Zero Trust Dashboard
- **Versionamento:** SemVer (`vX.Y.Z`) em prod, `vX.Y.Z-rc.<sha>` em dev

**Decisão de divergência do PRD §05-architecture.md:**
O PRD original prescrevia **Helm chart + IngressRoute Traefik CRD + Tailscale OAuth via hosted runner**. Plan 2 usa **raw YAML + standard Ingress + self-hosted runner no Pi** porque é o padrão dos projetos irmãos (nossalista/nossagrana). Plan 2 inclui task pra atualizar `docs/prd/05-architecture.md` refletindo essa realidade.

**Pre-requisito:** Plan 1 completo (merged em `main`). Site buildable via `npm run build`, dist com SPA + i18n + 7 seções funcionando.

---

## Mapa de arquivos

```
leoferolive.com.br/
├── Dockerfile                                  (NOVO — multi-stage Node→nginx)
├── nginx.conf                                  (NOVO — SPA fallback + CSP + /health)
├── .dockerignore                               (NOVO)
├── AGENTS.md                                   (NOVO — context for Claude Code)
├── k8s/
│   ├── prod/
│   │   ├── namespace.yaml                      (NOVO)
│   │   ├── deployment.yaml                     (NOVO)
│   │   ├── service.yaml                        (NOVO)
│   │   └── ingress.yaml                        (NOVO)
│   └── dev/
│       ├── namespace.yaml                      (NOVO)
│       ├── deployment.yaml                     (NOVO)
│       ├── service.yaml                        (NOVO)
│       └── ingress.yaml                        (NOVO)
├── .github/
│   └── workflows/
│       ├── ci.yml                              (NOVO — lint+typecheck+test em PRs)
│       ├── release.yml                         (NOVO — auto-tag em main + trigger dev deploy)
│       ├── deploy-environment.yml              (NOVO — reusable workflow)
│       ├── deploy-branch-dev.yml               (NOVO — RC tag + dev deploy)
│       └── deploy-prod.yml                     (NOVO — manual dispatch + approval)
├── docs/
│   ├── prd/
│   │   └── 05-architecture.md                  (MODIFY — atualizar pra refletir raw YAML)
│   └── deploy-guide/                           (NOVO — pasta com docs operacionais)
│       ├── 01-overview.md
│       ├── 02-cluster-setup.md
│       ├── 03-github-secrets.md
│       ├── 04-cloudflare-tunnel.md
│       └── 05-first-deploy.md
└── (existing — Plan 1 output, untouched)
    ├── package.json
    ├── src/
    └── ...
```

---

## Convenções

- **Branch:** `impl/deploy` no worktree `../leoferolive.com.br-impl-deploy`.
- **Commits:** atômicos por step de "Commit". Conventional commits.
- **No code changes to `src/`:** Plan 2 só toca infra (Docker, K8s YAML, workflows, docs). `src/` permanece exatamente como está em `main`.
- **Verify cycle por task:** quando aplicável, rodar `npm run build` (confirma dist gera) e/ou validar YAML/Dockerfile via lint quando ferramenta disponível.

---

# PHASE 0 — Container e local infra

Objetivo: Dockerfile + nginx.conf + .dockerignore + AGENTS.md. Tudo committable, build local funcional.

---

### Task 0.1: Worktree + atualização do PRD §05

**Files:** Create worktree. Modify: `docs/prd/05-architecture.md`.

- [ ] **Step 1: Criar worktree em nova branch**

```bash
cd /home/leoferolive/projetos/leoferolive.com.br
git worktree add -b impl/deploy ../leoferolive.com.br-impl-deploy main
cd ../leoferolive.com.br-impl-deploy
```

- [ ] **Step 2: Atualizar PRD §05 (`docs/prd/05-architecture.md`) refletindo a realidade**

A seção atual fala em Helm, IngressRoute, hosted runner. Atualizar para raw YAML + Ingress padrão + self-hosted runner no Pi. Substituir as seções relevantes:

- §1 Stack: trocar "Helm chart simples (Deployment + Service + IngressRoute Traefik)" por "Raw K8s YAML em `k8s/{prod,dev}/` (Deployment + Service + Ingress padrão); ingress class `traefik` com annotation `traefik.ingress.kubernetes.io/router.entrypoints: web`."
- §1 CI/CD: trocar "GitHub Actions: lint → build → docker push (GHCR) → kubectl apply via SSH/Tailscale" por "GitHub Actions self-hosted runner no Pi (ARM64): build → push GHCR → kubectl apply local. Tailscale opcional (rodando como serviço persistente no Pi para conectividade com kube API)."
- §2 Estrutura de pastas: substituir `deploy/Dockerfile` + `deploy/helm/` por `Dockerfile`, `nginx.conf`, `.dockerignore`, `k8s/prod/`, `k8s/dev/`.
- §4 Helm chart: **deletar inteira esta seção**.
- §5 GitHub Actions: substituir por referência ao Plan 2 (`docs/superpowers/plans/2026-05-03-deploy-infra.md`).

Manter §3 (Dockerfile) e §nginx.conf como referência, mas notar que o Plan 2 evolui esses templates (adiciona `/health`, ajusta CSP, etc.).

- [ ] **Step 3: Verify**

Worktree em `impl/deploy`, atual no commit do `main`. PRD §05 atualizado. `git status` clean (após commit).

- [ ] **Step 4: Commit**

```bash
git add docs/prd/05-architecture.md
git commit -m "docs: align PRD §05 with raw-YAML deploy strategy"
```

---

### Task 0.2: Dockerfile multi-stage

**Files:** Create `Dockerfile`, `.dockerignore`

**`Dockerfile`** — copiado de nossagrana `apps/web/Dockerfile`, simplificado pra projeto não-monorepo:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Notas:
- `node:20-alpine` casa com `.nvmrc` do projeto.
- Build gera `/app/dist/` (saída padrão Vite).
- Runtime corre como `nginx` user (não root), `chown` no estado padrão garante write access nos dirs necessários.
- `nginx.conf` (próxima task) define server block.

**`.dockerignore`** — evitar context bloat:

```
node_modules
dist
.git
.github
docs
.vscode
.idea
*.log
.env
.env.local
.env.*.local
*.tsbuildinfo
vite.config.d.ts
vite.config.js
.eslintrc.cjs
.prettierrc.json
.prettierignore
README.md
```

- [ ] **Step 1: Criar arquivos.**

- [ ] **Step 2: Build local pra validar**

```bash
docker build -t leoferolive-com-br:local-test .
docker images | grep leoferolive
```

Expected: imagem criada, < 50MB. Também rodar:

```bash
docker run --rm -d -p 8080:80 --name leo-test leoferolive-com-br:local-test
sleep 2
curl -sI http://localhost:8080/ | head -1   # → HTTP/1.1 200 OK
curl -s http://localhost:8080/ | head -3    # → vê <!DOCTYPE html><html lang="pt-BR">
docker stop leo-test
```

- [ ] **Step 3: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat(deploy): add Dockerfile multi-stage Node + nginx"
```

---

### Task 0.3: nginx.conf

**File:** Create `nginx.conf`

Copiado de nossagrana `apps/web/nginx.conf` com ajustes de CSP pro nosso caso (sem WebSocket, sem mic):

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  server_tokens off;

  # Security headers
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;

  # SPA fallback — qualquer rota desconhecida cai no index.html (React Router resolve)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Health endpoint (usado por K8s probes)
  location /health {
    default_type text/plain;
    return 200 'ok';
  }

  # Cache agressivo em assets versionados (Vite hash)
  location ~* \.(js|css|woff2|svg|webp|avif|png|jpg|jpeg|gif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # HTML não cacheia
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # gzip
  gzip on;
  gzip_types text/css application/javascript image/svg+xml application/json text/plain;
  gzip_min_length 1024;
}
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Rebuild + test local**

```bash
docker build -t leoferolive-com-br:local-test .
docker run --rm -d -p 8080:80 --name leo-test leoferolive-com-br:local-test
sleep 2

# SPA fallback
curl -sI http://localhost:8080/qualquer-rota | head -1   # → HTTP/1.1 200 OK
curl -s http://localhost:8080/qualquer-rota | grep -o '<title>[^<]*</title>'   # → <title>Leonardo Fernandes Oliveira...

# Health endpoint
curl -s http://localhost:8080/health   # → ok

# CSP header
curl -sI http://localhost:8080/ | grep -i 'content-security-policy'   # → presente

# Cache em assets
curl -sI http://localhost:8080/assets/index-*.css | grep -i 'cache-control'   # → public, immutable

docker stop leo-test
```

- [ ] **Step 3: Commit**

```bash
git add nginx.conf
git commit -m "feat(deploy): add nginx.conf with SPA fallback, CSP, /health"
```

---

### Task 0.4: AGENTS.md

**File:** Create `AGENTS.md`

Para futuras sessões de Claude Code (e Codex via AGENTS.md spec), criar contexto compacto:

```md
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
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md with project context for AI assistants"
```

---

# PHASE 1 — K8s manifests

Objetivo: manifests YAML committed pra prod e dev. Sem aplicar no cluster ainda (Phase 4 faz isso).

---

### Task 1.1: Manifests prod

**Files:** Create `k8s/prod/{namespace,deployment,service,ingress}.yaml`

**`k8s/prod/namespace.yaml`:**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: leoferolive-com-br
```

**`k8s/prod/deployment.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: leoferolive-com-br
  namespace: leoferolive-com-br
spec:
  replicas: 1
  selector:
    matchLabels:
      app: leoferolive-com-br
  template:
    metadata:
      labels:
        app: leoferolive-com-br
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: leoferolive-com-br
          image: ghcr.io/leoferolive/leoferolive-com-br:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 25m
              memory: 32Mi
            limits:
              cpu: 250m
              memory: 128Mi
          readinessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 15
```

**`k8s/prod/service.yaml`:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: leoferolive-com-br
  namespace: leoferolive-com-br
spec:
  selector:
    app: leoferolive-com-br
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: ClusterIP
```

**`k8s/prod/ingress.yaml`:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: leoferolive-com-br
  namespace: leoferolive-com-br
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
    - host: leoferolive.com.br
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: leoferolive-com-br
                port:
                  number: 80
```

- [ ] **Step 1: Criar arquivos.**

- [ ] **Step 2: Validar YAML**

Se `kubectl` disponível localmente:
```bash
kubectl apply --dry-run=client -f k8s/prod/
```

Senão, validar mentalmente: indent 2 spaces, `apiVersion`/`kind`/`metadata.name`/`spec` presentes em cada arquivo.

- [ ] **Step 3: Commit**

```bash
git add k8s/prod/
git commit -m "feat(deploy): add k8s prod manifests (namespace, deployment, service, ingress)"
```

---

### Task 1.2: Manifests dev

**Files:** Create `k8s/dev/{namespace,deployment,service,ingress}.yaml`

Mesma estrutura, com sufixo `-dev` no nome e `host: leoferolive-dev.local` (será resolvido via Traefik no Pi local; não precisa de Cloudflare Tunnel pra dev).

**`k8s/dev/namespace.yaml`:**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: leoferolive-com-br-dev
```

**`k8s/dev/deployment.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: leoferolive-com-br-dev
  namespace: leoferolive-com-br-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: leoferolive-com-br-dev
  template:
    metadata:
      labels:
        app: leoferolive-com-br-dev
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: leoferolive-com-br-dev
          image: ghcr.io/leoferolive/leoferolive-com-br-dev:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 25m
              memory: 32Mi
            limits:
              cpu: 250m
              memory: 128Mi
          readinessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 15
```

**`k8s/dev/service.yaml`:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: leoferolive-com-br-dev
  namespace: leoferolive-com-br-dev
spec:
  selector:
    app: leoferolive-com-br-dev
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: ClusterIP
```

**`k8s/dev/ingress.yaml`:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: leoferolive-com-br-dev
  namespace: leoferolive-com-br-dev
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
    - host: leoferolive-dev.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: leoferolive-com-br-dev
                port:
                  number: 80
```

> **Nota sobre `leoferolive-dev.local`:** essa rota só funciona via `/etc/hosts` apontando pro Pi (ou via Tailscale Magic DNS configurado). Documentado na seção de cluster setup. Se preferir tunnel pra dev também, adicionar public hostname no Cloudflare apontando pra `leoferolive-com-br-dev.leoferolive-com-br-dev.svc.cluster.local:80` e usar host `dev.leoferolive.com.br` aqui.

- [ ] **Step 1: Criar arquivos.**

- [ ] **Step 2: Validar.**

- [ ] **Step 3: Commit**

```bash
git add k8s/dev/
git commit -m "feat(deploy): add k8s dev manifests"
```

---

# PHASE 2 — GitHub Actions workflows

Objetivo: 4 workflows committed cobrindo CI, release, deploy dev, deploy prod.

---

### Task 2.1: CI workflow

**File:** Create `.github/workflows/ci.yml`

Roda lint+typecheck+test+build em PRs. Bloqueia merge se quebrar.

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: [self-hosted, Linux, ARM64]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint/typecheck/test/build workflow"
```

---

### Task 2.2: deploy-environment.yml (reusable)

**File:** Create `.github/workflows/deploy-environment.yml`

Workflow reusável chamado por release.yml e deploy-prod.yml. Faz prepare → build/push → deploy.

```yaml
name: Deploy to Environment

on:
  workflow_call:
    inputs:
      environment:
        description: "Ambiente alvo: 'dev' ou 'prod'"
        required: true
        type: string
      tag:
        description: 'Tag da imagem Docker a deployar'
        required: true
        type: string
      ref:
        description: 'Git ref (tag, SHA ou branch) para fazer checkout do codigo'
        required: true
        type: string

jobs:
  prepare:
    runs-on: [self-hosted, Linux, ARM64]
    outputs:
      resolved_sha: ${{ steps.meta.outputs.resolved_sha }}
      build_time: ${{ steps.meta.outputs.build_time }}
      namespace: ${{ steps.meta.outputs.namespace }}
      deployment: ${{ steps.meta.outputs.deployment }}
      container: ${{ steps.meta.outputs.container }}
      image_repository: ${{ steps.meta.outputs.image_repository }}
      image_uri: ${{ steps.meta.outputs.image_uri }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.ref }}
          fetch-depth: 0

      - name: Resolve deploy metadata
        id: meta
        run: |
          set -euo pipefail
          RESOLVED_SHA="$(git rev-parse HEAD)"
          BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
          if [ "${{ inputs.environment }}" = "prod" ]; then
            NAMESPACE="leoferolive-com-br"
            DEPLOYMENT="leoferolive-com-br"
            CONTAINER="leoferolive-com-br"
            IMAGE_REPOSITORY="ghcr.io/${{ github.repository_owner }}/leoferolive-com-br"
          else
            NAMESPACE="leoferolive-com-br-dev"
            DEPLOYMENT="leoferolive-com-br-dev"
            CONTAINER="leoferolive-com-br-dev"
            IMAGE_REPOSITORY="ghcr.io/${{ github.repository_owner }}/leoferolive-com-br-dev"
          fi
          IMAGE_URI="${IMAGE_REPOSITORY}:${{ inputs.tag }}"
          echo "resolved_sha=$RESOLVED_SHA" >> "$GITHUB_OUTPUT"
          echo "build_time=$BUILD_TIME" >> "$GITHUB_OUTPUT"
          echo "namespace=$NAMESPACE" >> "$GITHUB_OUTPUT"
          echo "deployment=$DEPLOYMENT" >> "$GITHUB_OUTPUT"
          echo "container=$CONTAINER" >> "$GITHUB_OUTPUT"
          echo "image_repository=$IMAGE_REPOSITORY" >> "$GITHUB_OUTPUT"
          echo "image_uri=$IMAGE_URI" >> "$GITHUB_OUTPUT"

  build-and-push:
    needs: prepare
    runs-on: [self-hosted, Linux, ARM64]
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.ref }}
          fetch-depth: 0

      - uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GHCR_PAT || github.token }}

      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/arm64
          push: true
          tags: |
            ${{ needs.prepare.outputs.image_repository }}:latest
            ${{ needs.prepare.outputs.image_uri }}
          labels: |
            org.opencontainers.image.title=leoferolive.com.br
            org.opencontainers.image.source=https://github.com/${{ github.repository }}
            org.opencontainers.image.version=${{ inputs.tag }}
            org.opencontainers.image.revision=${{ needs.prepare.outputs.resolved_sha }}
            org.opencontainers.image.created=${{ needs.prepare.outputs.build_time }}
          cache-from: type=gha,scope=${{ inputs.environment }}
          cache-to: type=gha,mode=max,scope=${{ inputs.environment }}

  deploy:
    needs: [prepare, build-and-push]
    runs-on: [self-hosted, Linux, ARM64]
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.ref }}

      - name: Setup Tailscale
        uses: tailscale/github-action@v2
        with:
          authkey: ${{ secrets.TAILSCALE_AUTHKEY }}
          args: --accept-routes --reset

      - name: Configure KUBECONFIG
        env:
          KUBECONFIG_B64: ${{ secrets.KUBECONFIG }}
        run: |
          mkdir -p "$HOME/.kube"
          echo "$KUBECONFIG_B64" | base64 -d > "$HOME/.kube/config"
          chmod 600 "$HOME/.kube/config"

      - name: Apply Kubernetes manifests
        run: kubectl apply -f "./k8s/${{ inputs.environment }}"

      - name: Update deployment image
        run: |
          NAMESPACE="${{ needs.prepare.outputs.namespace }}"
          kubectl set image "deployment/${{ needs.prepare.outputs.deployment }}" \
            "${{ needs.prepare.outputs.container }}=${{ needs.prepare.outputs.image_uri }}" \
            -n "$NAMESPACE"
          kubectl annotate "deployment/${{ needs.prepare.outputs.deployment }}" \
            "deploy.site/tag=${{ inputs.tag }}" \
            "deploy.site/sha=${{ needs.prepare.outputs.resolved_sha }}" \
            "deploy.site/build-time=${{ needs.prepare.outputs.build_time }}" \
            --overwrite -n "$NAMESPACE"

      - name: Wait for rollout
        run: |
          NAMESPACE="${{ needs.prepare.outputs.namespace }}"
          kubectl rollout status "deployment/${{ needs.prepare.outputs.deployment }}" \
            -n "$NAMESPACE" --timeout=300s
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-environment.yml
git commit -m "ci: add reusable deploy-environment workflow (build, push, kubectl)"
```

---

### Task 2.3: deploy-branch-dev.yml

**File:** Create `.github/workflows/deploy-branch-dev.yml`

Trigger via `workflow_dispatch` com `ref` (branch, tag, ou SHA). Cria RC tag `vX.Y.Z-rc.<sha>`, builda+deploya em dev. Cleanup de RC tags antigas (mantém últimas 10) e imagens (últimas 3).

```yaml
name: Deploy Branch to Dev

on:
  workflow_dispatch:
    inputs:
      ref:
        description: 'Branch, tag ou SHA para deploy em dev'
        required: true
        default: 'main'

concurrency:
  group: deploy-dev
  cancel-in-progress: false

jobs:
  prepare-rc-tag:
    runs-on: [self-hosted, Linux, ARM64]
    outputs:
      rc_tag: ${{ steps.tag.outputs.rc_tag }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.ref }}
          fetch-depth: 0

      - name: Compute RC tag
        id: tag
        env:
          GH_TOKEN: ${{ secrets.GHCR_PAT || github.token }}
        run: |
          set -euo pipefail
          # Pega última stable tag, ou v0.0.0 se nenhuma
          LAST_STABLE="$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | grep -v '-rc\.' | head -1 || echo v0.0.0)"
          # Bump patch
          MAJOR=$(echo "$LAST_STABLE" | sed 's/v\([0-9]*\)\.[0-9]*\.[0-9]*/\1/')
          MINOR=$(echo "$LAST_STABLE" | sed 's/v[0-9]*\.\([0-9]*\)\.[0-9]*/\1/')
          PATCH=$(echo "$LAST_STABLE" | sed 's/v[0-9]*\.[0-9]*\.\([0-9]*\)/\1/')
          NEXT="v${MAJOR}.${MINOR}.$((PATCH + 1))"
          SHORT_SHA="$(git rev-parse --short HEAD)"
          RC_TAG="${NEXT}-rc.${SHORT_SHA}"
          git tag "$RC_TAG"
          git push origin "$RC_TAG"
          echo "rc_tag=$RC_TAG" >> "$GITHUB_OUTPUT"

  deploy-dev:
    needs: prepare-rc-tag
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/deploy-environment.yml
    with:
      environment: dev
      tag: ${{ needs.prepare-rc-tag.outputs.rc_tag }}
      ref: ${{ needs.prepare-rc-tag.outputs.rc_tag }}
    secrets: inherit

  cleanup:
    needs: deploy-dev
    runs-on: [self-hosted, Linux, ARM64]
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Delete old RC tags (keep last 10)
        env:
          GH_TOKEN: ${{ secrets.GHCR_PAT || github.token }}
        run: |
          set -euo pipefail
          git fetch --tags
          OLD_TAGS=$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*-rc.*' --sort=-v:refname | tail -n +11 || true)
          for t in $OLD_TAGS; do
            git tag -d "$t" || true
            git push origin --delete "$t" || true
          done

      - name: Delete old dev images from GHCR (keep last 3)
        env:
          GH_TOKEN: ${{ secrets.GHCR_PAT || github.token }}
        run: |
          # gh api pra listar versões do package
          # filtrar tags rc, manter últimas 3, deletar resto
          # (script omitido — adaptar do nossagrana se necessário)
          echo "TODO: implement GHCR cleanup if storage matters"
```

- [ ] **Step 1: Criar arquivo.** Adapte o cleanup script de `nossagrana/.github/workflows/deploy-branch-dev.yml` se quiser GHCR cleanup automático.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-branch-dev.yml
git commit -m "ci: add deploy-branch-dev workflow (RC tag + dev deploy)"
```

---

### Task 2.4: deploy-prod.yml

**File:** Create `.github/workflows/deploy-prod.yml`

Manual dispatch com tag estável (vX.Y.Z) + approval no environment "production".

```yaml
name: Deploy Prod

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag estavel para deploy em producao, ex: v1.2.3'
        required: true

concurrency:
  group: deploy-prod
  cancel-in-progress: false

jobs:
  validate-tag:
    runs-on: [self-hosted, Linux, ARM64]
    steps:
      - name: Validar formato da tag estavel
        run: |
          set -euo pipefail
          TAG="${{ inputs.tag }}"
          if [[ ! "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "::error::Tag invalida: '$TAG'. Producao aceita apenas tag estavel vX.Y.Z."
            exit 1
          fi

      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Garantir que a tag existe no repositorio
        run: git rev-parse "${{ inputs.tag }}^{commit}" >/dev/null

  approve:
    needs: validate-tag
    runs-on: [self-hosted, Linux, ARM64]
    environment: production
    steps:
      - run: echo "Aprovacao recebida para deploy da tag ${{ inputs.tag }} em producao."

  deploy:
    needs: approve
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/deploy-environment.yml
    with:
      environment: prod
      tag: ${{ inputs.tag }}
      ref: ${{ inputs.tag }}
    secrets: inherit
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-prod.yml
git commit -m "ci: add deploy-prod workflow (vX.Y.Z + environment approval)"
```

---

### Task 2.5: release.yml

**File:** Create `.github/workflows/release.yml`

Trigger automático após CI passar em `main`. Cria/reusa stable tag + GitHub Release. NÃO triga deploy automaticamente em prod (prod é só manual). Triga deploy em dev.

```yaml
name: Release

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]

jobs:
  tag-and-release:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: [self-hosted, Linux, ARM64]
    permissions:
      contents: write
    outputs:
      stable_tag: ${{ steps.tag.outputs.stable_tag }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Compute next stable tag
        id: tag
        run: |
          set -euo pipefail
          LAST="$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | grep -v '-rc\.' | head -1 || echo v0.0.0)"
          MAJOR=$(echo "$LAST" | sed 's/v\([0-9]*\)\.[0-9]*\.[0-9]*/\1/')
          MINOR=$(echo "$LAST" | sed 's/v[0-9]*\.\([0-9]*\)\.[0-9]*/\1/')
          PATCH=$(echo "$LAST" | sed 's/v[0-9]*\.[0-9]*\.\([0-9]*\)/\1/')
          NEXT="v${MAJOR}.${MINOR}.$((PATCH + 1))"
          # Skip se commit head já tem stable tag
          EXISTING="$(git tag --points-at HEAD | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -1 || true)"
          if [ -n "$EXISTING" ]; then
            echo "stable_tag=$EXISTING" >> "$GITHUB_OUTPUT"
            exit 0
          fi
          git tag "$NEXT"
          git push origin "$NEXT"
          echo "stable_tag=$NEXT" >> "$GITHUB_OUTPUT"

      - name: Create GitHub Release
        env:
          GH_TOKEN: ${{ secrets.GHCR_PAT || github.token }}
        run: |
          gh release create "${{ steps.tag.outputs.stable_tag }}" \
            --generate-notes \
            --title "${{ steps.tag.outputs.stable_tag }}" \
            || echo "Release já existe"

  deploy-dev:
    needs: tag-and-release
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/deploy-environment.yml
    with:
      environment: dev
      tag: ${{ needs.tag-and-release.outputs.stable_tag }}
      ref: ${{ needs.tag-and-release.outputs.stable_tag }}
    secrets: inherit
```

- [ ] **Step 1: Criar arquivo.**

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow (auto-tag + dev deploy on main)"
```

---

# PHASE 3 — Docs operacionais

Objetivo: 5 markdowns em `docs/deploy-guide/` que documentam o setup manual (cluster, secrets, tunnel, primeiro deploy).

---

### Task 3.1: docs/deploy-guide/01-overview.md

```md
# Deploy Guide — Overview

Site `leoferolive.com.br` — deploy K3s no Raspberry Pi 4B com Cloudflare Tunnel.

## Arquitetura

```
User → HTTPS → Cloudflare Edge → Cloudflare Tunnel
  → cloudflared Pod (cluster ns: cloudflared)
  → leoferolive-com-br.leoferolive-com-br.svc.cluster.local:80
  → Traefik → nginx Pod
```

## Componentes

| Componente | Onde |
|---|---|
| Source code | `src/`, build via `npm run build` → `dist/` |
| Container | `Dockerfile` multi-stage Node + nginx (`nginx:1.27-alpine`) |
| Manifests | `k8s/prod/` e `k8s/dev/` (raw YAML, no Helm) |
| Registry | GHCR (`ghcr.io/leoferolive/leoferolive-com-br`) |
| Cluster | K3s no Pi (ARM64) |
| Ingress | Traefik (já no cluster) |
| Tunnel | cloudflared Deployment (já no cluster, ns `cloudflared`) |
| CI/CD | GitHub Actions self-hosted runner no Pi |

## Fluxos de deploy

| Trigger | Workflow | Resultado |
|---|---|---|
| Push em `main` | `ci.yml` → `release.yml` | Cria stable tag + deploy em dev |
| `gh workflow run deploy-branch-dev.yml -f ref=<branch>` | `deploy-branch-dev.yml` | Cria RC tag + deploy em dev |
| `gh workflow run deploy-prod.yml -f tag=vX.Y.Z` | `deploy-prod.yml` | Approval + deploy em prod |

## Setup necessário (one-time)

Ver guias em ordem:
1. [02-cluster-setup.md](./02-cluster-setup.md) — namespace + pull secret no Pi
2. [03-github-secrets.md](./03-github-secrets.md) — TAILSCALE_AUTHKEY, KUBECONFIG, GHCR_PAT
3. [04-cloudflare-tunnel.md](./04-cloudflare-tunnel.md) — public hostname pra leoferolive.com.br
4. [05-first-deploy.md](./05-first-deploy.md) — checklist do primeiro deploy
```

- [ ] **Commit:**
```bash
git add docs/deploy-guide/01-overview.md
git commit -m "docs: deploy-guide overview"
```

---

### Task 3.2: docs/deploy-guide/02-cluster-setup.md

```md
# Cluster Setup

Pré-requisitos no Pi: K3s rodando, namespace `cloudflared` com `cloudflared` Deployment ativo, Traefik como ingress controller.

## Criar namespaces

```bash
kubectl apply -f k8s/prod/namespace.yaml
kubectl apply -f k8s/dev/namespace.yaml
```

## Copiar pull secret pro GHCR

Os outros projetos têm o secret `ghcr-secret` em algum namespace. Replicar pros nossos:

```bash
# Identificar um namespace fonte com o secret (ex: nossagrana)
SOURCE_NS=nossagrana

# Copiar pra prod
kubectl get secret ghcr-secret -n $SOURCE_NS -o yaml \
  | sed "s/namespace: $SOURCE_NS/namespace: leoferolive-com-br/" \
  | grep -v '^\s*resourceVersion:' \
  | grep -v '^\s*uid:' \
  | grep -v '^\s*creationTimestamp:' \
  | kubectl apply -f -

# Copiar pra dev
kubectl get secret ghcr-secret -n $SOURCE_NS -o yaml \
  | sed "s/namespace: $SOURCE_NS/namespace: leoferolive-com-br-dev/" \
  | grep -v '^\s*resourceVersion:' \
  | grep -v '^\s*uid:' \
  | grep -v '^\s*creationTimestamp:' \
  | kubectl apply -f -
```

## Validar

```bash
kubectl get ns | grep leoferolive
# leoferolive-com-br        Active
# leoferolive-com-br-dev    Active

kubectl get secret ghcr-secret -n leoferolive-com-br
kubectl get secret ghcr-secret -n leoferolive-com-br-dev
```
```

- [ ] **Commit:**
```bash
git add docs/deploy-guide/02-cluster-setup.md
git commit -m "docs: cluster setup guide"
```

---

### Task 3.3: docs/deploy-guide/03-github-secrets.md

```md
# GitHub Secrets

Repo: <https://github.com/leoferolive/leoferolive.com.br/settings/secrets/actions>

## TAILSCALE_AUTHKEY

Gerar em <https://login.tailscale.com/admin/settings/keys>:
- ✅ Reusable
- ✅ Ephemeral
- Tags: `tag:ci`

Copiar e adicionar como secret `TAILSCALE_AUTHKEY`.

## KUBECONFIG

No Pi:
```bash
# Pegar IP Tailscale do Pi
TAILSCALE_IP=$(tailscale ip -4)

# Substituir 127.0.0.1 pelo IP Tailscale e codificar em base64
sudo sed "s/127.0.0.1/$TAILSCALE_IP/g" /etc/rancher/k3s/k3s.yaml | base64 -w 0
```

Copiar saída e adicionar como secret `KUBECONFIG`.

## GHCR_PAT (opcional, mas recomendado)

Gerar PAT em <https://github.com/settings/tokens/new> com escopos:
- ✅ `write:packages`
- ✅ `delete:packages`
- ✅ `workflow`

Adicionar como secret `GHCR_PAT`. Sem isso, workflows usam `GITHUB_TOKEN` (limitado — não consegue triggrar outros workflows nem deletar imagens GHCR).

## Environment "production"

Settings → Environments → New environment → `production`:
- ✅ Required reviewers: você (`leoferolive`)
- ✅ Wait timer: 0 min (ou maior, se quiser cooldown)

Isso bloqueia `deploy-prod.yml` esperando seu OK manual.
```

- [ ] **Commit:**
```bash
git add docs/deploy-guide/03-github-secrets.md
git commit -m "docs: github secrets and environment setup"
```

---

### Task 3.4: docs/deploy-guide/04-cloudflare-tunnel.md

```md
# Cloudflare Tunnel — Public Hostname

O Pi já tem `cloudflared` rodando (namespace `cloudflared`) com tunnel ativo. Não precisa criar tunnel novo, só adicionar um public hostname.

## Adicionar hostname

1. <https://one.dash.cloudflare.com> → Networks → Tunnels → seu tunnel ativo
2. **Public Hostnames** → **Add a public hostname**:
   - Subdomain: `(deixar vazio)` — ou `www` se preferir www como canônico
   - Domain: `leoferolive.com.br`
   - Type: `HTTP`
   - URL: `leoferolive-com-br.leoferolive-com-br.svc.cluster.local:80`
3. Save.

## DNS

Cloudflare auto-gerencia o CNAME pro tunnel (não precisa configurar manualmente).

## Validar

```bash
# Do seu computador (não precisa estar na tailnet):
curl -sI https://leoferolive.com.br/health
# → HTTP/2 200
# → content-type: text/plain
```

## (Opcional) Dev tunnel

Se quiser dev acessível externamente em `dev.leoferolive.com.br`:
1. Adicionar outro public hostname:
   - Subdomain: `dev`
   - Domain: `leoferolive.com.br`
   - URL: `leoferolive-com-br-dev.leoferolive-com-br-dev.svc.cluster.local:80`
2. Editar `k8s/dev/ingress.yaml` mudando `host: leoferolive-dev.local` para `host: dev.leoferolive.com.br`. Re-aplicar.

Senão, dev fica acessível só via `/etc/hosts` apontando o Pi pra `leoferolive-dev.local` (ou via Tailscale Magic DNS).
```

- [ ] **Commit:**
```bash
git add docs/deploy-guide/04-cloudflare-tunnel.md
git commit -m "docs: cloudflare tunnel public hostname guide"
```

---

### Task 3.5: docs/deploy-guide/05-first-deploy.md

```md
# Primeiro Deploy

Pré-requisitos completos:
- [ ] [02-cluster-setup.md](./02-cluster-setup.md) — namespaces criados, ghcr-secret copiado
- [ ] [03-github-secrets.md](./03-github-secrets.md) — TAILSCALE_AUTHKEY, KUBECONFIG, GHCR_PAT, environment `production` configurados
- [ ] [04-cloudflare-tunnel.md](./04-cloudflare-tunnel.md) — public hostname adicionado pra `leoferolive.com.br`

## Passos

1. **Verificar runner self-hosted ativo:**
   ```bash
   # No Pi
   sudo systemctl status actions.runner.leoferolive-leoferolive.com.br.<runner-name>
   # Active: active (running)
   ```

2. **Push deste plan-2 branch e mergear pra main** (se ainda não foi).

3. **Triggrar deploy em dev:**
   ```bash
   gh workflow run deploy-branch-dev.yml -f ref=main
   gh run watch
   ```
   Esperado: cria RC tag, builda imagem ARM64, push GHCR, kubectl apply, rollout completo.

4. **Validar dev:**
   ```bash
   # Se dev tunnel não configurado, via Pi local:
   curl -sI http://leoferolive-dev.local/health
   # → HTTP/1.1 200 OK
   ```

5. **Promover pra prod:**
   ```bash
   # Pegar a stable tag mais recente
   gh release list --limit 1
   # ex: v0.1.0

   gh workflow run deploy-prod.yml -f tag=v0.1.0
   gh run watch
   ```
   Workflow vai pausar pedindo approval no environment `production`. Aprovar via UI: <https://github.com/leoferolive/leoferolive.com.br/actions> → run → Review pending deployments.

6. **Validar prod:**
   ```bash
   curl -sI https://leoferolive.com.br/
   # → HTTP/2 200
   # → server: cloudflare

   curl -s https://leoferolive.com.br/health
   # → ok

   # E abrir no browser pra confirmar SPA + i18n
   ```

7. **Lighthouse audit:** abrir <https://leoferolive.com.br/> e <https://leoferolive.com.br/en> em Chrome → DevTools → Lighthouse → mobile + desktop. Confirmar Performance/A11y/SEO/Best Practices ≥ 95 em todos.

## Troubleshooting

**Imagem não puxa (ImagePullBackOff):**
- Confirmar `ghcr-secret` no namespace
- Confirmar imagem existe: `gh api /user/packages/container/leoferolive-com-br/versions`

**404 do Cloudflare:**
- Confirmar public hostname configurado (passo 4-tunnel)
- Confirmar service ClusterIP up: `kubectl get svc -n leoferolive-com-br`
- Confirmar pod healthy: `kubectl get pod -n leoferolive-com-br`

**502 Bad Gateway:**
- Provavelmente o pod ainda está startando ou nginx morreu. `kubectl logs -n leoferolive-com-br -l app=leoferolive-com-br`
```

- [ ] **Commit:**
```bash
git add docs/deploy-guide/05-first-deploy.md
git commit -m "docs: first deploy checklist and troubleshooting"
```

---

# PHASE 4 — Manual setup (USUÁRIO executa fora do plan)

> Esta fase **não é executada por agente**. São ações manuais que você faz no Pi, GitHub UI, e Cloudflare UI. O plan documenta porque a sequência importa.

### Task 4.1: Cluster setup (no Pi)

Seguir `docs/deploy-guide/02-cluster-setup.md`. Resultado esperado:
- `kubectl get ns leoferolive-com-br` → Active
- `kubectl get ns leoferolive-com-br-dev` → Active
- `kubectl get secret ghcr-secret -n leoferolive-com-br` → existe
- `kubectl get secret ghcr-secret -n leoferolive-com-br-dev` → existe

### Task 4.2: GitHub secrets + environment

Seguir `docs/deploy-guide/03-github-secrets.md`. Resultado esperado:
- Settings → Secrets → `TAILSCALE_AUTHKEY`, `KUBECONFIG`, `GHCR_PAT` configurados
- Settings → Environments → `production` com você como required reviewer

### Task 4.3: Cloudflare Tunnel

Seguir `docs/deploy-guide/04-cloudflare-tunnel.md`. Resultado esperado:
- Public hostname `leoferolive.com.br` → `leoferolive-com-br.leoferolive-com-br.svc.cluster.local:80` ativo

### Task 4.4: First deploy

Seguir `docs/deploy-guide/05-first-deploy.md`. Resultado esperado:
- Site acessível em `https://leoferolive.com.br/`
- Lighthouse mobile ≥ 95 em Performance, A11y, SEO, Best Practices em ambas URLs (`/` e `/en`)

---

# Checkpoint final

Após Phases 0-3 (committed) + Phases 4 (manual):

- [ ] `git log` mostra ~14 commits no `impl/deploy`
- [ ] CI verde em PR pra main
- [ ] Site no ar em `https://leoferolive.com.br/`
- [ ] Site no ar em `https://leoferolive.com.br/en`
- [ ] Lighthouse mobile ≥ 95 em ambas URLs
- [ ] OG preview testado (LinkedIn share preview, Slack unfurl)
- [ ] DNS apex + (opcional) www redirect funcionando

**Próximo:** divulgar 🎉. Atualizar LinkedIn, CV, perfis com `leoferolive.com.br`. Iterar sobre conteúdo conforme feedback.

---

## Anexo — Decisões e tradeoffs

| Decisão | Por quê |
|---|---|
| Raw YAML em vez de Helm | Padrão dos projetos irmãos. Helm vira complexidade desnecessária pra single-Deployment. |
| Self-hosted runner no Pi | Já existe pra os outros projetos. Builds ARM64 nativo (sem QEMU). Latência baixíssima pra `kubectl`. |
| Cloudflare Tunnel termina TLS | Cluster usa HTTP plain. Sem cert-manager, sem renovação. Cloudflare faz tudo. |
| GitHub Environment + manual approval em prod | Plano original era CD direto; mudou pra ter um gate humano antes de prod (especialmente útil pra portfolio onde você quer revisar antes de divulgar). |
| Dev usa `leoferolive-dev.local` (não tunneled) | Acesso interno via Tailscale/hosts file. Evita expor URL "intermediária" ao mundo. Trocável pra `dev.leoferolive.com.br` em 2 linhas. |
| `ghcr-secret` copiado de outro ns (não criado do zero) | Já tem o auth configurado. Sed-substitute namespace é o que nossagrana faz. |
| `latest` tag movida + version-pinned tag (`vX.Y.Z`) | `latest` pro fallback do `imagePullPolicy: Always` em hot-restart. Tag versionada pra anotar deployment com SHA/build-time. |

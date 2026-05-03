# 05 — Arquitetura

> Stack detalhado, estrutura de pastas, Docker, Helm, CI/CD.
> **Carregar quando:** setup do repo, build, deploy, infra.

---

## 1. Stack

### Frontend
- **React 18** + **Vite 5**.
- **TypeScript** (`strict: true`).
- **Tailwind CSS v4**.
- **lucide-react** (tree-shaken, ver `02-design.md` §7).
- **clsx** para condicionais de classe.
- **@fontsource/jetbrains-mono** (fonte self-hosted).
- Sem framer-motion. Animações via CSS + IntersectionObserver.

### Build & Deploy
- Build estático: `vite build` → `dist/`.
- Imagem Docker multi-stage: builder Node + final `nginx:alpine` (ou `caddy:alpine`).
- Tamanho final ≤ 30 MB.
- Helm chart simples (`Deployment` + `Service` + `IngressRoute` Traefik).
- GitHub Actions: lint → build → docker push (GHCR) → `kubectl apply` via SSH/Tailscale.

### Infraestrutura
- Cluster: K3s no Raspberry Pi 4B (8GB).
- Ingress: Traefik (já em uso pelos outros projetos).
- TLS/CDN: Cloudflare Tunnel para `leoferolive.com.br`.
- Domínio raiz: apex `leoferolive.com.br` + redirect de `www`.

---

## 2. Estrutura de Pastas

```
leoferolive-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── deploy/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── helm/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingressroute.yaml
├── docs/
│   ├── PRD.md
│   └── prd/
│       ├── 01-product.md
│       ├── 02-design.md
│       ├── 03-content.md
│       ├── 04-requirements.md
│       └── 05-architecture.md
├── public/
│   ├── og-image.png
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Chrome.tsx           (top bar IDE)
│   │   ├── StatusBar.tsx
│   │   ├── Hero.tsx
│   │   ├── Cases.tsx
│   │   ├── Workflow.tsx
│   │   ├── Projects.tsx
│   │   ├── Stack.tsx
│   │   ├── Contact.tsx
│   │   ├── ExternalLink.tsx
│   │   └── ui/
│   │       ├── CaseCard.tsx
│   │       ├── ProjectCard.tsx
│   │       └── StackGroup.tsx
│   ├── hooks/
│   │   ├── useTypewriter.ts
│   │   └── useReveal.ts
│   ├── data/
│   │   ├── cases.ts
│   │   ├── projects.ts
│   │   └── stack.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── AGENTS.md                    ← contexto pra Claude Code
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Dockerfile (referência)

```dockerfile
# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf` (resumo)

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Assets versionados (Vite hash)
  location ~* \.(js|css|woff2|svg|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # HTML não cacheia
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # Headers de segurança
  add_header X-Content-Type-Options "nosniff";
  add_header Referrer-Policy "strict-origin-when-cross-origin";
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";

  # CSP
  add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'";

  # gzip
  gzip on;
  gzip_types text/css application/javascript image/svg+xml application/json;
  gzip_min_length 1024;
}
```

---

## 4. Helm Chart (referência)

### `Chart.yaml`

```yaml
apiVersion: v2
name: leoferolive-portfolio
description: Personal portfolio site
type: application
version: 0.1.0
appVersion: "1.0.0"
```

### `values.yaml`

```yaml
image:
  repository: ghcr.io/leoferolive/portfolio
  tag: latest
  pullPolicy: Always

replicaCount: 1

resources:
  requests:
    cpu: 25m
    memory: 32Mi
  limits:
    cpu: 100m
    memory: 64Mi

ingress:
  host: leoferolive.com.br
  entryPoints:
    - web
    - websecure
```

### `templates/deployment.yaml` (essencial)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
    spec:
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 80
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 10
```

### `templates/ingressroute.yaml` (Traefik)

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: {{ .Chart.Name }}
spec:
  entryPoints: {{ .Values.ingress.entryPoints | toYaml | nindent 4 }}
  routes:
    - match: Host(`{{ .Values.ingress.host }}`)
      kind: Rule
      services:
        - name: {{ .Chart.Name }}
          port: 80
```

---

## 5. GitHub Actions (referência)

### `.github/workflows/deploy.yml`

```yaml
name: deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build

      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          file: deploy/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/portfolio:latest
            ghcr.io/${{ github.repository_owner }}/portfolio:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Tailscale connect
        uses: tailscale/github-action@v2
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
          tags: tag:ci
      - name: Helm upgrade
        run: |
          helm upgrade --install portfolio ./deploy/helm \
            --set image.tag=${{ github.sha }} \
            --kubeconfig <(echo "${{ secrets.K3S_KUBECONFIG }}" | base64 -d) \
            --namespace portfolio --create-namespace
```

---

## 6. Scripts `package.json` (referência)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "typecheck": "tsc -b --noEmit",
    "format": "prettier --write ."
  }
}
```

---

## 7. AGENTS.md (esqueleto recomendado)

Criar `AGENTS.md` na raiz com:

```md
# AGENTS.md — leoferolive-portfolio

## Contexto
Portfolio pessoal. PRD em `docs/PRD.md` (core) + módulos em `docs/prd/`.

## Sempre
- Ler `docs/PRD.md` antes de qualquer mudança.
- Carregar módulos sob demanda conforme tabela do core.
- TypeScript strict. Sem `any` exceto justificado em comentário.
- Tailwind apenas. Sem CSS-in-JS runtime.
- Componentes pequenos, props tipadas.

## Comandos
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run lint && npm run typecheck` — antes de commitar

## Convenções
- Componentes em `src/components/PascalCase.tsx`.
- Hooks em `src/hooks/useCamelCase.ts`.
- Dados estáticos em `src/data/*.ts` (typed).
- Não importar de Google Fonts CDN.

## Definition of Done
Ver `docs/prd/04-requirements.md` §3.
```

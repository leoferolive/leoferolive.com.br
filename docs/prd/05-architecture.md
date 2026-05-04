# 05 — Arquitetura

> Stack detalhado, estrutura de pastas, Docker, CI/CD.
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
- Imagem Docker multi-stage: builder Node 20 + final `nginx:1.27-alpine`.
- Tamanho final ≤ 30 MB.
- Raw K8s YAML em `k8s/{prod,dev}/` (`Deployment` + `Service` + `Ingress` padrão); ingress class traefik com annotation `traefik.ingress.kubernetes.io/router.entrypoints: web`.
- GitHub Actions self-hosted runner no Pi (ARM64): build → push GHCR → `kubectl apply` local. Tailscale rodando como serviço persistente no Pi para conectividade com kube API.

### Infraestrutura
- Cluster: K3s no Raspberry Pi 4B (8GB).
- Ingress: Traefik (já em uso pelos outros projetos).
- TLS/CDN: Cloudflare Tunnel para `leoferolive.com.br`.
- Domínio raiz: apex `leoferolive.com.br` + redirect de `www`.

---

## 2. Estrutura de Pastas

```
leoferolive-portfolio/
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── AGENTS.md
├── k8s/
│   ├── prod/
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   └── dev/
│       └── ... (mesma estrutura)
├── .github/workflows/
│   ├── ci.yml
│   ├── release.yml
│   ├── deploy-environment.yml
│   ├── deploy-branch-dev.yml
│   └── deploy-prod.yml
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
└── src/ (unchanged from Plan 1)
```

---

## 3. Dockerfile (referência)

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

*Versão evoluída em Plan 2 inclui `/health` endpoint, CSP estrita, ajustes de cache.*

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

  # Health endpoint (usado por K8s probes)
  location /health {
    default_type text/plain;
    return 200 'ok';
  }

  # Assets versionados (Vite hash)
  location ~* \.(js|css|woff2|svg|webp|avif|png|jpg|jpeg|gif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # HTML não cacheia
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # Headers de segurança
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  # CSP estrita
  add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;

  # gzip
  gzip on;
  gzip_types text/css application/javascript image/svg+xml application/json text/plain;
  gzip_min_length 1024;
}
```

---

## 5. GitHub Actions (referência)

Workflows detalhados em Plan 2: `docs/superpowers/plans/2026-05-03-deploy-infra.md` §Phase 2. Padrão: `ci.yml` (lint/test/build em PRs), `release.yml` (auto-tag em main + dev deploy), `deploy-branch-dev.yml` (RC tag manual + dev deploy), `deploy-prod.yml` (vX.Y.Z + environment approval), `deploy-environment.yml` (reusable build+push+kubectl).

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

Criar `AGENTS.md` na raiz com contexto completo para AI assistants: stack, comandos, convenções de código, estrutura de deploy e Definition of Done. Ver `AGENTS.md` na raiz do repositório para a versão atualizada conforme Plan 2.

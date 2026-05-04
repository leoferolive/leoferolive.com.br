# Deploy Guide — Overview

Site `leoferolive.com.br` — deploy K3s no Raspberry Pi 4B com Cloudflare Tunnel.

## Arquitetura

````
User → HTTPS → Cloudflare Edge → Cloudflare Tunnel
  → cloudflared Pod (cluster ns: cloudflared)
  → leoferolive-com-br.leoferolive-com-br.svc.cluster.local:80
  → Traefik → nginx Pod
````

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

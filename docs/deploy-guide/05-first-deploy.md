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

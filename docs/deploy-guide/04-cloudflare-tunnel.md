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

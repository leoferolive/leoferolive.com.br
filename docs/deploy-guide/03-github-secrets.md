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

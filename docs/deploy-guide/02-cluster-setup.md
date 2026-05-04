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

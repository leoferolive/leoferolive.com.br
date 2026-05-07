# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-05-06] Validações de UI usam `browser-use`, nunca Playwright MCP**
   Do instead: para qualquer inspeção visual/UX, abra com `browser-use open <url>` → `state` → `screenshot`. Playwright MCP só como fallback explícito do usuário.

2. **[2026-05-06] Planos/avaliações grandes rodam em worktree própria**
   Do instead: criar `.worktrees/<slug>` (já no .gitignore) antes de iniciar; manter workspace principal limpo.

## Shell & Command Reliability
1. **[2026-05-06] `git check-ignore` retorna exit 1 quando não-ignorado**
   Do instead: ao encadear com `&&`, espere falha quando o caminho ainda não é ignorado; verifique o estado real após `mkdir -p`.

## Domain Behavior Guardrails
1. **[2026-05-06] Site é bilíngue (PT default, EN via /en)**
   Do instead: ao avaliar conteúdo/SEO, sempre cobrir ambos idiomas; chave i18n vive em `src/i18n`.

## User Directives
1. **[2026-05-06] Responder sempre em português, com acentuação correta**
   Do instead: nunca substituir acentos por ASCII; manter ortografia plena.

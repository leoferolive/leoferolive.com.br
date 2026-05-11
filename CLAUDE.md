# CLAUDE.md — leoferolive.com.br

## Antes de propor commit

Sempre rode o quality gate e cole a tabela final na resposta:

```bash
npm run quality
```

Se qualquer linha sair `✗`, **corrija antes de commitar**. Não desligue regras de
ESLint nem reduza thresholds em `vitest.config.ts` sem justificativa explícita
em commit message — o gate é a fonte da verdade objetiva, não um obstáculo.

## O que o gate cobre

Lint (zero warning), TypeScript (`tsc -b`), Vitest + cobertura (v8) e build.
Detalhe das dimensões e thresholds em `docs/quality-gate.md`.

## O que o gate NÃO cobre

- Segurança runtime (XSS, CSP, headers) — auditar manualmente.
- Race conditions / async (testes são jsdom single-thread).
- Intenção (o teste pode passar e o código fazer a coisa errada).
- Performance / a11y / SEO em produção — coberto por `lighthouse.yml`
  (workflow agendado semanal). Para validação visual local de UI use o
  CLI `browser-use`, conforme instruções globais; **não** use Playwright MCP.

## Convenções

- Português em commits, PRs e docs.
- Componentes React em PascalCase; hooks `use*`; testes ao lado do arquivo.
- Tailwind 4 com tokens em `src/styles`.

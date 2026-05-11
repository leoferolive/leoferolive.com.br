# Quality Gate

Objetivo: medir, não revisar.

## Dimensões e thresholds atuais

| Dimensão            | Threshold | Onde mora                            |
| ------------------- | --------- | ------------------------------------ |
| Lint warnings       | 0         | `.eslintrc.cjs` + `--max-warnings 0` |
| Complexidade ciclo. | ≤ 10      | regra `complexity`                   |
| Linhas por função   | ≤ 60      | regra `max-lines-per-function`       |
| Profundidade        | ≤ 4       | regra `max-depth`                    |
| Type errors         | 0         | `tsc -b`                             |
| Test pass rate      | 100%      | `vitest run`                         |
| Cobertura linhas    | ≥ 49%     | `vitest --coverage`                  |
| Cobertura funções   | ≥ 41%     | `vitest --coverage`                  |
| Cobertura state.    | ≥ 47%     | `vitest --coverage`                  |
| Cobertura branches  | ≥ 36%     | `vitest --coverage`                  |
| Build               | green     | `vite build`                         |

> Os pisos de cobertura são provisórios (baseline 2026-05-11 menos 5pp).
> Veja seção **Ratchet** para a regra de subida.

## Como rodar

```bash
npm run quality
```

Saída: tabela final ✓/✗ por dimensão. Exit code != 0 se qualquer etapa falhou.

## Ratchet

Padrão "trinco": a baseline da primeira execução vira o piso. A cada PR que
_aumenta_ uma métrica, atualizamos o threshold no commit. Nunca baixamos sem
justificativa explícita.

Marcos:

- **M1 (1 mês após merge):** lines ≥ 65, branches ≥ 55.
- **M2 (3 meses):** lines ≥ 70, branches ≥ 60. Daí em diante, congela.

## Foco recomendado de cobertura

Priorize testes em:

- `src/hooks/` (lógica reutilizada, fácil de testar isoladamente)
- `src/components/chat/` (estado, side-effects)
- `src/components/chrome/` (a11y, atalhos, tema)
- `src/i18n/` (paridade de chaves)

Desprioriza testes pesados em páginas decorativas (`src/components/sections/`),
cobertas indiretamente por testes de smoke e Lighthouse.

## Relação com Lighthouse CI

Performance, acessibilidade, _best practices_ e SEO **NÃO** estão neste gate.
Esses sinais vivem em `.github/workflows/lighthouse.yml` (workflow semanal +
manual dispatch) e seus thresholds (perf ≥ 0.9, a11y ≥ 0.95, BP ≥ 0.9,
SEO ≥ 0.95) seguem em `lighthouserc.json`. São **gate complementar**, não
duplicado, e rodam contra a URL pública porque dependem de CDN/cache reais.

## Limitações reconhecidas

Este gate **não substitui**:

- Code review humano para arquitetura, naming e intenção.
- Auditoria de segurança (CSP, headers, dependências — Dependabot cuida do
  último; CSP é validada manualmente).
- Testes E2E em browser real (deferidos; podem ser adicionados via
  `browser-use` se necessário).
- Detecção de race conditions / problemas de concorrência.

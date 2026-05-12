# Quality Gate Plan — leoferolive.com.br

> **Para agentes:** SUB-SKILL obrigatória: `@superpowers:executing-plans` (ou `@superpowers:subagent-driven-development`) para executar tarefa-a-tarefa com checkpoint humano.
>
> **Verificação:** SUB-SKILL obrigatória: `@superpowers:verification-before-completion`. Rode os comandos e confirme a saída antes de marcar como feito.
>
> **Worktree:** este plano já vive em `../leoferolive.com.br-wt-quality-gate` na branch `quality-gate-plan`. Execute a implementação na mesma worktree (ou crie outra a partir dela).

**Goal:** Instalar um *quality gate* objetivo e reprodutível em `leoferolive.com.br` que falhe localmente e na CI quando métricas regredirem. Inspirado no post da Codeminer42 "Pare de ler código de IA, comece a medi-lo" (stack Rails), mas **calibrado para a realidade deste repositório**: site pessoal/portfólio em TypeScript+React, sem backend, sem PII, sem regulação. O gate cobre o que importa aqui (lint zero-warning, type-check, testes verdes, cobertura mínima, complexidade ciclomática limitada) e referencia o workflow `lighthouse.yml` já existente para performance/a11y/SEO. **Não inclui mutation testing.**

**Architecture:** Um único script `npm run quality` que orquestra as ferramentas existentes (ESLint, `tsc`, Vitest) e adiciona cobertura via `@vitest/coverage-v8`. O script imprime uma tabela final ✓/✗ por dimensão. Pre-commit hook via Husky + lint-staged dispara Prettier e ESLint apenas nos arquivos staged (rápido), enquanto a CI roda o `quality` completo (lento). Padrão **ratchet**: a 1ª medição vira piso; thresholds sobem progressivamente conforme cobertura real cresce.

**Tech Stack adicionado:**
- `@vitest/coverage-v8` (provider de cobertura nativo do V8, já compatível com Vitest 4)
- `husky@^9` + `lint-staged@^15` (hook `pre-commit`)
- Regras nativas do ESLint: `complexity`, `max-lines-per-function`, `max-depth` (sem plugins extras)
- Script Node.js `scripts/quality/run.mjs` que orquestra etapas e imprime a tabela

**Por que thresholds mais baixos que o post:**

| Dimensão | Post Codeminer42 (Rails SaaS) | Este plano (site pessoal) | Justificativa |
|---|---|---|---|
| Linhas | ≥ 95% | **≥ 60%** (alvo final 70%) | Site é majoritariamente conteúdo estático/UI decorativa. Forçar 95% incentiva *testes de fachada* (snapshots vazios, asserções triviais) que não pegam bug nenhum. |
| Branches | ≥ 90% | **≥ 50%** (alvo final 60%) | Pouca lógica condicional fora de hooks; ramos de UI são exercitados melhor por testes manuais e Lighthouse. |
| Funções | — | **≥ 60%** | Em React, "função" inclui componentes — meta espelha linhas. |
| Statements | — | **≥ 60%** | Idem. |
| Complexidade ciclomática | ≤ 6 | **≤ 10** | Limite "padrão de mercado" do ESLint; ≤ 6 é restritivo demais para JSX (cada `&&` conta). |
| `max-lines-per-function` | — | **≤ 60** | Componentes React grandes são *code smell*; 60 linhas é generoso para JSX. |
| `max-depth` | — | **≤ 4** | Evita aninhamento exagerado sem ser draconiano. |
| Mutation testing | ≥ 69,5% | **descartado** | Custo de manutenção desproporcional ao risco do projeto. |

Test ratio atual é ~18%. Pular para 95% seria desonesto; o ratchet (seção dedicada abaixo) força subida gradual sustentável.

---

## Mapa de arquivos

```
leoferolive.com.br/
├── package.json                                 (MODIFY — scripts + devDeps + lint-staged config)
├── vitest.config.ts                             (MODIFY — bloco coverage com thresholds)
├── .eslintrc.cjs                                (MODIFY — regras complexity, max-lines-per-function, max-depth)
├── .gitignore                                   (MODIFY — ignorar coverage/)
├── CLAUDE.md                                    (NOVO — instrução p/ IA rodar npm run quality antes de commitar)
├── .husky/
│   └── pre-commit                               (NOVO — chama npx lint-staged)
├── scripts/quality/
│   └── run.mjs                                  (NOVO — orquestrador + tabela final ✓/✗)
├── docs/
│   ├── quality-gate.md                          (NOVO — 1 página: dimensões, thresholds, ratchet, limitações)
│   └── superpowers/plans/
│       └── 2026-05-11-quality-gate.md           (ESTE ARQUIVO)
└── .github/workflows/
    └── ci.yml                                   (MODIFY — substituir 4 comandos pelo único `npm run quality`)
```

---

## Tarefa 1 — Instalar dependências de cobertura, husky e lint-staged

**Por quê:** Vitest não embute provider de cobertura por padrão; husky e lint-staged habilitam o pre-commit barato. Sem essas três libs nada do resto compila.

- [ ] **1.1** Adicionar devDeps:
  ```bash
  cd /home/leoferolive/projetos/leoferolive.com.br-wt-quality-gate
  npm install --save-dev @vitest/coverage-v8@^4.1.5 husky@^9.1.7 lint-staged@^15.2.10
  ```
- [ ] **1.2** Verificar que `package.json` lista as três em `devDependencies` e que `package-lock.json` foi atualizado:
  ```bash
  grep -E '"(@vitest/coverage-v8|husky|lint-staged)"' package.json
  ```
  Saída esperada: 3 linhas, uma por pacote.
- [ ] **1.3** Não rodar `npm run test:run -- --coverage` ainda — vitest.config.ts não tem o bloco coverage. Próxima tarefa.

---

## Tarefa 2 — Configurar coverage no vitest.config.ts

**Por quê:** Sem `coverage.thresholds`, Vitest mede mas não falha. O gate precisa falhar.

- [ ] **2.1** Editar `vitest.config.ts`. Substituir o bloco `test: { ... }` por:
  ```ts
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: false,
    exclude: ['**/node_modules/**', '**/dist/**', '.worktrees/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/tests/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.stories.{ts,tsx}',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 50,
      },
    },
  },
  ```
- [ ] **2.2** Adicionar `coverage/` ao `.gitignore` (se não estiver):
  ```bash
  grep -q '^coverage' .gitignore || echo 'coverage/' >> .gitignore
  ```
- [ ] **2.3** Rodar uma vez sem `--coverage` para garantir que nada quebrou:
  ```bash
  npm run test:run
  ```
  Saída esperada: todos os 10 arquivos passam.
- [ ] **2.4** Rodar com cobertura:
  ```bash
  npm run test:run -- --coverage
  ```
  Anotar os 4 percentuais reportados (lines / functions / statements / branches). Eles são a **baseline ratchet** (ver Tarefa 8). Se algum estiver abaixo dos thresholds da 2.1, ajustar PROVISORIAMENTE para 5 pontos abaixo do medido e abrir issue para subir.

---

## Tarefa 3 — Endurecer ESLint com complexity / max-lines-per-function / max-depth

**Por quê:** Lint atualmente só pega estilo. Adicionar limites de complexidade transforma o lint em gate estrutural.

- [ ] **3.1** Editar `.eslintrc.cjs`. Substituir o bloco `rules: { ... }` por:
  ```js
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'complexity': ['error', { max: 10 }],
    'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true, IIFEs: true }],
    'max-depth': ['error', 4],
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'src/tests/**/*'],
      rules: {
        'max-lines-per-function': 'off',
        'complexity': 'off',
      },
    },
  ],
  ```
- [ ] **3.2** Rodar:
  ```bash
  npm run lint
  ```
  Se aparecerem violações nas regras novas, **NÃO** desligue as regras. Para cada arquivo violando: (a) refatorar agora se for trivial, ou (b) adicionar comentário `// eslint-disable-next-line <rule> -- TODO(quality-gate): refatorar até <data>` e abrir issue. Documentar quantos disables foram necessários no commit message.

---

## Tarefa 4 — Pre-commit hook com husky + lint-staged

**Por quê:** CI lenta não substitui feedback no commit. Husky roda Prettier+ESLint apenas nos staged em ~2s.

- [ ] **4.1** Inicializar husky:
  ```bash
  npx husky init
  ```
  Isso cria `.husky/pre-commit` com `npm test` por padrão.
- [ ] **4.2** Substituir o conteúdo de `.husky/pre-commit` por:
  ```sh
  #!/usr/bin/env sh
  npx lint-staged
  ```
  E garantir permissão de execução:
  ```bash
  chmod +x .husky/pre-commit
  ```
- [ ] **4.3** Adicionar bloco `lint-staged` no `package.json` (no topo, antes de `"scripts"`):
  ```json
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --max-warnings 0 --fix",
      "prettier --write"
    ],
    "*.{json,md,css,html,yml,yaml}": [
      "prettier --write"
    ]
  },
  ```
- [ ] **4.4** Adicionar script `prepare` em `package.json` para que `npm install` configure o husky em quem clonar:
  ```json
  "prepare": "husky"
  ```
- [ ] **4.5** Teste manual: criar arquivo `src/__scratch.ts` com `const x  =  1;` (espaços duplos), stageá-lo, commitar; o pre-commit deve reescrever e commitar limpo. Depois apagar o arquivo.

---

## Tarefa 5 — Script orquestrador `npm run quality` com tabela ✓/✗

**Por quê:** É a peça central da tese do post: **um comando, uma tabela**. A IA roda isso antes de commitar e o humano lê só 5 linhas.

- [ ] **5.1** Criar `scripts/quality/run.mjs`:
  ```js
  #!/usr/bin/env node
  // Quality gate orchestrator — single entry point.
  // Roda 4 etapas em sequência, captura sucesso/falha de cada uma,
  // imprime tabela final e sai com código != 0 se qualquer etapa falhou.

  import { spawnSync } from 'node:child_process';

  const steps = [
    { name: 'Lint (zero warnings)', cmd: 'npm', args: ['run', 'lint'] },
    { name: 'Type-check (tsc)',     cmd: 'npm', args: ['run', 'typecheck'] },
    { name: 'Tests + Coverage',     cmd: 'npm', args: ['run', 'test:run', '--', '--coverage'] },
    { name: 'Build (vite)',         cmd: 'npm', args: ['run', 'build'] },
  ];

  const results = [];
  for (const step of steps) {
    process.stdout.write(`\n=== ${step.name} ===\n`);
    const r = spawnSync(step.cmd, step.args, { stdio: 'inherit', shell: false });
    results.push({ name: step.name, ok: r.status === 0 });
    if (r.status !== 0) {
      // Continua executando próximas etapas para dar visão completa,
      // mas marca falha para o resumo.
    }
  }

  const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
  const width = Math.max(...results.map(r => r.name.length)) + 2;

  console.log('\n\n┌' + '─'.repeat(width + 6) + '┐');
  console.log('│ ' + pad('Quality Gate', width + 4) + ' │');
  console.log('├' + '─'.repeat(width + 6) + '┤');
  for (const r of results) {
    const mark = r.ok ? '✓' : '✗';
    console.log(`│ ${mark}  ${pad(r.name, width)} │`);
  }
  console.log('└' + '─'.repeat(width + 6) + '┘');

  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} etapa(s) falharam: ${failed.map(f => f.name).join(', ')}`);
    process.exit(1);
  }
  console.log('\nTodas as métricas dentro dos thresholds.');
  ```
- [ ] **5.2** Adicionar script em `package.json`:
  ```json
  "quality": "node scripts/quality/run.mjs"
  ```
- [ ] **5.3** Tornar executável e rodar:
  ```bash
  chmod +x scripts/quality/run.mjs
  npm run quality
  ```
  Saída esperada: tabela com 4 linhas `✓` e exit code 0. Se algum `✗`, **NÃO** seguir para Tarefa 6 até corrigir.

---

## Tarefa 6 — Substituir comandos avulsos da CI pelo `quality`

**Por quê:** Manter `ci.yml` em sincronia com o gate local. Hoje a CI roda 4 comandos; vamos para 1.

- [ ] **6.1** Editar `.github/workflows/ci.yml`. Substituir o bloco de steps a partir de `- run: npm ci` por:
  ```yaml
      - run: npm ci
      - run: npm run quality

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ github.run_id }}
          path: coverage/
          retention-days: 14
  ```
- [ ] **6.2** Garantir que `actions/upload-artifact@v4` ainda é a versão suportada pela época. Se já existir uma referência mais nova em outro workflow do repo, alinhar.
- [ ] **6.3** Abrir PR draft com a branch atual; observar a primeira execução da CI. Se falhar por threshold, voltar à Tarefa 2.4 e calibrar baseline.

---

## Tarefa 7 — Criar `CLAUDE.md` raiz instruindo a IA

**Por quê:** A tese inteira do post depende de a IA rodar o gate antes de pedir review humano. Sem essa instrução, o gate vira apenas verificação tardia na CI.

- [ ] **7.1** Criar `/home/leoferolive/projetos/leoferolive.com.br/CLAUDE.md` com conteúdo mínimo:
  ```md
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
  ```
- [ ] **7.2** Não duplicar com `AGENTS.md` já existente — `CLAUDE.md` é o ponto de entrada específico para Claude Code (este harness lê primeiro CLAUDE.md). `AGENTS.md` permanece para Codex/outros agentes.

---

## Tarefa 8 — Documento `docs/quality-gate.md`

**Por quê:** Plano vira referência permanente para tomadas de decisão futuras sobre subir/baixar thresholds.

- [ ] **8.1** Criar `docs/quality-gate.md`:
  ```md
  # Quality Gate

  Objetivo: medir, não revisar.

  ## Dimensões e thresholds atuais

  | Dimensão           | Threshold | Onde mora                     |
  |--------------------|-----------|-------------------------------|
  | Lint warnings      | 0         | `.eslintrc.cjs` + `--max-warnings 0` |
  | Complexidade ciclo.| ≤ 10      | regra `complexity`            |
  | Linhas por função  | ≤ 60      | regra `max-lines-per-function`|
  | Profundidade       | ≤ 4       | regra `max-depth`             |
  | Type errors        | 0         | `tsc -b`                      |
  | Test pass rate     | 100%      | `vitest run`                  |
  | Cobertura linhas   | ≥ 60%     | `vitest --coverage`           |
  | Cobertura funções  | ≥ 60%     | `vitest --coverage`           |
  | Cobertura state.   | ≥ 60%     | `vitest --coverage`           |
  | Cobertura branches | ≥ 50%     | `vitest --coverage`           |
  | Build              | green     | `vite build`                  |

  ## Como rodar

  ```bash
  npm run quality
  ```

  ## Ratchet

  Padrão "trinco": a baseline da primeira execução vira o piso. A cada PR que
  *aumenta* uma métrica, atualizamos o threshold no commit. Nunca baixamos sem
  justificativa explícita. Meta de longo prazo: 70% linhas / 60% branches.

  ## Foco recomendado de cobertura

  Priorize testes em:
  - `src/hooks/` (lógica reutilizada, fácil de testar isoladamente)
  - `src/components/chat/` (estado, side-effects)
  - `src/components/chrome/` (a11y, atalhos, tema)
  - `src/i18n/` (paridade de chaves)

  Desprioriza testes pesados em páginas decorativas (`src/components/sections/`),
  cobertas indiretamente por testes de smoke e Lighthouse.

  ## Relação com Lighthouse CI

  Performance, acessibilidade, *best practices* e SEO **NÃO** estão neste gate.
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
  ```

---

## Tarefa 9 — Estratégia Ratchet (operacional)

**Por quê:** Sem ratchet, thresholds viram peso morto: ou alguém baixa quando atrapalha, ou ninguém sobe quando melhora. Precisa de regra.

- [ ] **9.1** Documentar a regra dentro do próprio `vitest.config.ts` como comentário acima do bloco `thresholds`:
  ```ts
  // RATCHET: estes valores são pisos. Quando o relatório de cobertura
  // mostrar +3 pontos em qualquer métrica por 2 PRs consecutivos,
  // atualize o piso aqui (sempre subindo, nunca descendo sem ADR).
  ```
- [ ] **9.2** Criar issue de seguimento (manual, fora do plano):
  - Título: "Quality gate: revisar baselines de cobertura mensalmente"
  - Corpo: link para `docs/quality-gate.md` § Ratchet.
- [ ] **9.3** Estabelecer metas-marco (não vão para código, ficam no doc):
  - **M1 (1 mês após merge):** lines ≥ 65, branches ≥ 55.
  - **M2 (3 meses):** lines ≥ 70, branches ≥ 60. Daí em diante, congela.

---

## Tarefa 10 — Verificação ponta-a-ponta

- [ ] **10.1** Rodar localmente da estaca zero:
  ```bash
  rm -rf node_modules coverage
  npm ci
  npm run quality
  ```
  Resultado esperado: 4 linhas `✓` e exit 0.
- [ ] **10.2** Forçar uma falha proposital para validar a tabela:
  - Inserir `// eslint-disable-next-line` faltando regra em um arquivo qualquer, rodar `npm run quality`. Esperado: tabela mostra `✗ Lint`, processo exit 1, mas as outras etapas ainda rodaram.
  - Reverter.
- [ ] **10.3** Forçar regressão de cobertura: comentar 1 `describe` inteiro num teste, rodar. Esperado: `✗ Tests + Coverage` com mensagem do Vitest indicando qual métrica caiu abaixo do piso.
  - Reverter.
- [ ] **10.4** Abrir PR. Pedir review humano *apenas* da estrutura (script, configs); confiar no gate para correção/qualidade.

---

## Relação com Lighthouse CI (resumo executivo)

`lighthouse.yml` permanece intocado. Roda semanalmente e via dispatch contra `https://leoferolive.com.br`. Mede coisas que **só fazem sentido em produção**: tamanho de bundle servido com gzip+brotli, LCP/CLS reais, contraste em CSS final, sitemap. Esse plano cobre o que faz sentido medir **antes do deploy**. Ambos juntos = gate completo.

## Limitações reconhecidas (do gate inteiro)

Copiando o que o post original já admite e adaptando:
1. **Não cobre segurança runtime** — CSP, headers, XSS dependem de auditoria manual / DAST externo.
2. **Não cobre race conditions** — Vitest é single-thread em jsdom; concorrência só pega em E2E.
3. **Não cobre intenção** — teste verde com mock errado segue verde. Code review humano permanece necessário para "isso resolve o problema certo?".
4. **Não cobre regressão visual** — sem snapshots de imagem; usar `browser-use` ad-hoc quando refatorar layout.
5. **Cobertura é proxy fraco** — 70% de cobertura com testes de fachada vale menos que 40% com testes que falham quando o código quebra. Por isso a meta congela em 70% e o foco vai para qualidade dos testes, não quantidade.

Esses limites são **explícitos** justamente para que ninguém confunda "gate verde" com "código correto". Gate verde significa: *nenhuma das métricas que sabemos medir regrediu*. Nada mais.

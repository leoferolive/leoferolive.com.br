#!/usr/bin/env node
// Quality gate orchestrator — single entry point.
// Roda 4 etapas em sequência, captura sucesso/falha de cada uma,
// imprime tabela final e sai com código != 0 se qualquer etapa falhou.

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const steps = [
  { name: 'Lint (zero warnings)', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'Type-check (tsc)', cmd: 'npm', args: ['run', 'typecheck'] },
  { name: 'Tests + Coverage', cmd: 'npm', args: ['run', 'test:run', '--', '--coverage'] },
  { name: 'Build (vite)', cmd: 'npm', args: ['run', 'build'] },
];

// Pisos provisórios espelhados de vitest.config.ts.
// Mantenha em sincronia com `test.coverage.thresholds` lá.
const COVERAGE_THRESHOLDS = {
  lines: 49,
  functions: 41,
  statements: 47,
  branches: 36,
};

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

// Lê coverage-summary.json (emitido pelo reporter 'json-summary' do v8) e
// expande a linha "Tests + Coverage" em linhas detalhadas por métrica.
const coverageMetrics = [];
const summaryPath = path.resolve('coverage/coverage-summary.json');
if (existsSync(summaryPath)) {
  try {
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
    const total = summary.total ?? {};
    for (const key of ['lines', 'functions', 'statements', 'branches']) {
      const pct = total[key]?.pct;
      const threshold = COVERAGE_THRESHOLDS[key];
      if (typeof pct === 'number' && typeof threshold === 'number') {
        coverageMetrics.push({
          name: `  ${key} coverage`,
          pct,
          threshold,
          ok: pct >= threshold,
        });
      }
    }
  } catch {
    // Silencioso: se o JSON estiver mal-formado, seguimos só com a linha agregada.
  }
}

if (!results.length) {
  console.log('Nenhum check configurado.');
  process.exit(0);
}

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
const fmtPct = (n) => `${n.toFixed(2)}%`;
const detailFor = (m) =>
  `${pad(fmtPct(m.pct), 7)} >= ${pad(fmtPct(m.threshold), 7)}`;

const nameWidth =
  Math.max(
    ...results.map((r) => r.name.length),
    ...coverageMetrics.map((m) => m.name.length),
  ) + 2;
const detailWidth = coverageMetrics.length
  ? Math.max(...coverageMetrics.map((m) => detailFor(m).length))
  : 0;
const innerWidth = 4 + nameWidth + (detailWidth ? detailWidth + 2 : 0);

console.log('\n\n┌' + '─'.repeat(innerWidth + 2) + '┐');
console.log('│ ' + pad('Quality Gate', innerWidth) + ' │');
console.log('├' + '─'.repeat(innerWidth + 2) + '┤');
for (const r of results) {
  const mark = r.ok ? '✓' : '✗';
  const detailCell = detailWidth ? '  ' + pad('', detailWidth) : '';
  console.log(`│ ${mark}  ${pad(r.name, nameWidth)}${detailCell} │`);
  if (r.name === 'Tests + Coverage' && coverageMetrics.length) {
    for (const m of coverageMetrics) {
      const subMark = m.ok ? '✓' : '✗';
      console.log(
        `│ ${subMark}  ${pad(m.name, nameWidth)}  ${pad(detailFor(m), detailWidth)} │`,
      );
    }
  }
}
console.log('└' + '─'.repeat(innerWidth + 2) + '┘');

const failed = [
  ...results.filter((r) => !r.ok),
  ...coverageMetrics.filter((m) => !m.ok).map((m) => ({ name: m.name.trim() })),
];
if (failed.length > 0) {
  console.error(
    `\n${failed.length} etapa(s)/métrica(s) falharam: ${failed.map((f) => f.name).join(', ')}`,
  );
  process.exit(1);
}
console.log('\nTodas as métricas dentro dos thresholds.');

#!/usr/bin/env node
// Quality gate orchestrator — single entry point.
// Roda 4 etapas em sequência, captura sucesso/falha de cada uma,
// imprime tabela final e sai com código != 0 se qualquer etapa falhou.

import { spawnSync } from 'node:child_process';

const steps = [
  { name: 'Lint (zero warnings)', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'Type-check (tsc)', cmd: 'npm', args: ['run', 'typecheck'] },
  { name: 'Tests + Coverage', cmd: 'npm', args: ['run', 'test:run', '--', '--coverage'] },
  { name: 'Build (vite)', cmd: 'npm', args: ['run', 'build'] },
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

if (!results.length) {
  console.log('Nenhum check configurado.');
  process.exit(0);
}

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
const width = Math.max(...results.map((r) => r.name.length)) + 2;

console.log('\n\n┌' + '─'.repeat(width + 6) + '┐');
console.log('│ ' + pad('Quality Gate', width + 4) + ' │');
console.log('├' + '─'.repeat(width + 6) + '┤');
for (const r of results) {
  const mark = r.ok ? '✓' : '✗';
  console.log(`│ ${mark}  ${pad(r.name, width)} │`);
}
console.log('└' + '─'.repeat(width + 6) + '┘');

const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} etapa(s) falharam: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
console.log('\nTodas as métricas dentro dos thresholds.');

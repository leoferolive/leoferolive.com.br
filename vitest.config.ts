import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: false,
    // Stray git worktrees inside `.worktrees/` would otherwise drag broken
    // tests (and conflicting React copies) into the run.
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
      // RATCHET: estes valores são pisos. Quando o relatório de cobertura
      // mostrar +3 pontos em qualquer métrica por 2 PRs consecutivos,
      // atualize o piso aqui (sempre subindo, nunca descendo sem ADR).
      //
      // Baseline 2026-05-11 (primeira medição):
      //   lines 54.08%, functions 46.42%, statements 52.33%, branches 41.46%.
      // Pisos provisórios = baseline - 5pp (conforme Tarefa 2.4 do plano).
      // Alvo intermediário (M1, 1 mês): lines 65, branches 55.
      // Alvo final (M2, 3 meses): lines 70, branches 60.
      thresholds: {
        lines: 49,
        functions: 41,
        statements: 47,
        branches: 36,
      },
    },
  },
});

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
  },
});

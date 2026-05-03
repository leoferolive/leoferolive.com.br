import { describe, it, expect } from 'vitest';
import { pt } from './pt';
import { en } from './en';

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  if (typeof obj === 'function') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    collectKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe('i18n parity', () => {
  it('PT e EN têm exatamente as mesmas chaves', () => {
    const ptKeys = collectKeys(pt).sort();
    const enKeys = collectKeys(en).sort();
    expect(ptKeys).toEqual(enKeys);
  });
});

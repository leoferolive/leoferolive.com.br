import { describe, it, expect } from 'vitest';
import { swapLangPath, langFromPath } from './routing';

describe('swapLangPath', () => {
  it('home: pt → en', () => {
    expect(swapLangPath('/', '', 'en')).toBe('/en');
  });
  it('home: en → pt', () => {
    expect(swapLangPath('/en', '', 'pt')).toBe('/');
  });
  it('mantém hash', () => {
    expect(swapLangPath('/', '#cases', 'en')).toBe('/en#cases');
  });
  it('arquitetura: pt → en mapeia para /en/architecture', () => {
    expect(swapLangPath('/arquitetura', '', 'en')).toBe('/en/architecture');
  });
  it('arquitetura: en → pt mapeia para /arquitetura', () => {
    expect(swapLangPath('/en/architecture', '', 'pt')).toBe('/arquitetura');
  });
});

describe('langFromPath', () => {
  it('detecta /en/architecture como en', () => {
    expect(langFromPath('/en/architecture')).toBe('en');
  });
  it('detecta /arquitetura como pt', () => {
    expect(langFromPath('/arquitetura')).toBe('pt');
  });
});

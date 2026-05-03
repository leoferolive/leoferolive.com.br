# Site Implementation Plan (Plano 1 de 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `@superpowers:subagent-driven-development` (recommended) or `@superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **For TDD discipline:** REQUIRED SUB-SKILL: `@superpowers:test-driven-development`. Apply rigorously to hooks and behavior; pragmatically (single smoke test) to pure presentational components.
>
> **For completion claims:** REQUIRED SUB-SKILL: `@superpowers:verification-before-completion`. Run the verification commands and confirm output before marking any task done.
>
> **Worktree:** per `~/.claude/CLAUDE.md`, execute this plan in a dedicated worktree (`git worktree add ../leoferolive.com.br-impl-site main`). Keep `main` clean.

**Goal:** Implementar a SPA do portfólio (HTML/CSS/JS) conforme `docs/superpowers/specs/2026-05-03-cv-enriched-portfolio-design.md`, entregando um build estático que roda localmente via `npm run preview` com **todas as 7 seções**, **i18n PT/EN funcional**, **mobile-first** e **Lighthouse ≥ 95** em ambas as URLs.

**Architecture:** SPA React 18 + Vite 5 com TypeScript strict. Roteamento por idioma (`/` PT, `/en` EN) via React Router. Copy bilíngue tipada em `src/i18n/{pt,en}.ts` com paridade garantida por test de CI. Estilos via Tailwind v4 (config CSS-based com `@theme`). Fontes self-hosted via `@fontsource/jetbrains-mono`. Animações CSS + IntersectionObserver, sem framer-motion.

**Tech Stack:**
- **Build/runtime:** Vite 5, React 18, TypeScript 5 (strict)
- **Estilo:** Tailwind v4 + `@tailwindcss/vite` plugin, CSS custom properties para tokens
- **Roteamento:** React Router DOM v6
- **i18n:** dicionários TS tipados (sem lib externa)
- **Ícones:** `lucide-react` tree-shaken
- **Fontes:** `@fontsource/jetbrains-mono`
- **Testes:** Vitest + React Testing Library + jsdom
- **Qualidade:** ESLint (config oficial Vite + a11y) + Prettier

**Fora do escopo deste plano (vai pro Plano 2):**
- Dockerfile + nginx.conf
- Helm chart
- GitHub Actions de deploy
- DNS + Cloudflare Tunnel
- OpenClaw/Tailscale/K3s

---

## Mapa de arquivos

```
leoferolive.com.br/
├── .gitignore                                  (já existe — adicionar entradas novas)
├── .gitattributes                              (NOVO — eol=lf consistente)
├── .nvmrc                                      (NOVO — pin Node 20)
├── .editorconfig                               (NOVO)
├── .eslintrc.cjs                               (NOVO)
├── .prettierrc.json                            (NOVO)
├── package.json                                (NOVO)
├── package-lock.json                           (gerado)
├── tsconfig.json                               (NOVO)
├── tsconfig.node.json                          (NOVO)
├── vite.config.ts                              (NOVO)
├── vitest.config.ts                            (NOVO)
├── index.html                                  (NOVO — root HTML PT)
├── public/
│   ├── favicon.svg                             (NOVO — placeholder)
│   ├── robots.txt                              (NOVO)
│   ├── sitemap.xml                             (NOVO)
│   ├── og-image-pt.png                         (NOVO — placeholder gerado)
│   └── og-image-en.png                         (NOVO — placeholder gerado)
├── docs/                                       (já existe)
└── src/
    ├── main.tsx                                (NOVO — entry point)
    ├── App.tsx                                 (NOVO — router + provider)
    ├── styles/
    │   ├── globals.css                         (NOVO — @import tailwindcss + @theme + base)
    │   └── animations.css                      (NOVO — keyframes typewriter/blink/reveal)
    ├── i18n/
    │   ├── types.ts                            (NOVO — interface I18nDictionary)
    │   ├── pt.ts                               (NOVO — copy completo PT)
    │   ├── en.ts                               (NOVO — copy completo EN)
    │   ├── context.tsx                         (NOVO — Provider + Lang type)
    │   ├── useT.ts                             (NOVO — hook)
    │   ├── parity.test.ts                      (NOVO — checa paridade chaves)
    │   └── routing.ts                          (NOVO — helpers swap entre /e /en)
    ├── hooks/
    │   ├── useTypewriter.ts                    (NOVO)
    │   ├── useReveal.ts                        (NOVO)
    │   ├── useCopyToClipboard.ts               (NOVO)
    │   └── useReducedMotion.ts                 (NOVO)
    ├── components/
    │   ├── chrome/
    │   │   ├── TopBar.tsx                      (NOVO)
    │   │   ├── StatusBar.tsx                   (NOVO)
    │   │   ├── LanguageToggle.tsx              (NOVO)
    │   │   └── SkipLink.tsx                    (NOVO)
    │   ├── layout/
    │   │   └── PageShell.tsx                   (NOVO)
    │   ├── ui/
    │   │   ├── ExternalLink.tsx                (NOVO)
    │   │   ├── PromptLine.tsx                  (NOVO)
    │   │   ├── SectionHeader.tsx               (NOVO)
    │   │   ├── CaseCard.tsx                    (NOVO)
    │   │   ├── ProjectCard.tsx                 (NOVO)
    │   │   ├── StackGroup.tsx                  (NOVO)
    │   │   ├── CareerEntryDetailed.tsx         (NOVO — Wiley/Ebix)
    │   │   ├── CareerEntryLine.tsx             (NOVO — single line)
    │   │   └── CopyButton.tsx                  (NOVO)
    │   └── sections/
    │       ├── Hero.tsx                        (NOVO)
    │       ├── Cases.tsx                       (NOVO)
    │       ├── Career.tsx                      (NOVO)
    │       ├── Workflow.tsx                    (NOVO)
    │       ├── Projects.tsx                    (NOVO)
    │       ├── Stack.tsx                       (NOVO)
    │       └── Contact.tsx                     (NOVO)
    ├── data/
    │   ├── cases.ts                            (NOVO — 5 cases)
    │   ├── projects.ts                         (NOVO — 3 projects)
    │   ├── career.ts                           (NOVO — 5 entries)
    │   └── stack.ts                            (NOVO — 4 groups)
    ├── seo/
    │   ├── jsonld.ts                           (NOVO — Person schema)
    │   └── Head.tsx                            (NOVO — meta tags por idioma)
    └── tests/
        └── setup.ts                            (NOVO — Vitest config)
```

**Princípio de decomposição:** componentes pequenos, focados, com props tipadas. Cada arquivo tem **uma** responsabilidade. Hooks abstraem comportamento reusável. Dados tipados em `src/data/*.ts` (não em componentes).

---

## Convenções

- **Commits:** atômicos por step de "Commit". Conventional commits (`feat:`, `chore:`, `test:`, `style:`, `refactor:`, `docs:`).
- **Branch:** trabalhar em `main` no worktree (não criar feature branches por task — overhead desnecessário pra plano linear).
- **Lint/typecheck:** `npm run lint && npm run typecheck` antes de cada commit (Step de Commit assume isto OK).
- **Testes:** `npm test` (Vitest watch). CI futuro rodará `npm test -- --run`.
- **Mobile-first:** breakpoints Tailwind padrão (`sm:640 md:768 lg:1024 xl:1280`). Spec usa `sm:480` — overridar via @theme.

---

# PHASE 0 — Foundation

Objetivo: projeto Vite + React + TS + Tailwind v4 + Vitest configurado e rodando o "Hello World".

---

### Task 0.1: Criar worktree e configurar gitattributes

**Files:**
- Create: `../leoferolive.com.br-impl-site/` (worktree)
- Create: `.gitattributes`

- [ ] **Step 1: Criar worktree na pasta irmã**

```bash
cd /home/leoferolive/projetos/leoferolive.com.br
git worktree add ../leoferolive.com.br-impl-site main
cd ../leoferolive.com.br-impl-site
```

Expected: worktree criado, `git status` mostra "On branch main, nothing to commit".

- [ ] **Step 2: Criar `.gitattributes` para normalizar EOL**

```gitattributes
* text=auto eol=lf
*.png binary
*.woff2 binary
```

Por quê: WSL/Windows estava avisando sobre CRLF. Forçar LF no repo evita ruído futuro.

- [ ] **Step 3: Commit**

```bash
git add .gitattributes
git commit -m "chore: normalize line endings via .gitattributes"
```

---

### Task 0.2: Scaffold Vite + React + TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.nvmrc`, `.editorconfig`

- [ ] **Step 1: Pin Node version**

`.nvmrc`:
```
20
```

- [ ] **Step 2: Inicializar Vite com template react-ts**

```bash
npm create vite@latest . -- --template react-ts
```

Quando perguntar sobre overwrite (vai perguntar por causa dos `docs/`), aceite mesmo assim — só sobrescreve `index.html`, `src/`, etc., e os `docs/` ficam intocados.

- [ ] **Step 3: Verificar arquivos gerados e ajustar `package.json`**

`package.json` deve ter `name: "leoferolive-com-br"`, `version: "0.1.0"`, scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 4173",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 4: Configurar `tsconfig.json` strict + paths**

Adicionar/substituir blocos relevantes:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src", "vite.config.ts", "vitest.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Configurar `vite.config.ts` com path alias**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 6: Criar `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

- [ ] **Step 7: Atualizar `.gitignore` com entradas Node/Vite**

Adicionar ao `.gitignore` existente:
```
# Node
node_modules/
dist/
*.log
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
.DS_Store
```

- [ ] **Step 8: Verificar dev server**

```bash
npm install
npm run dev
```

Expected: servidor sobe em http://localhost:5173 com a tela default do template Vite. Ctrl+C pra parar.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React 18 + TypeScript strict"
```

---

### Task 0.3: Instalar e configurar Tailwind v4

**Files:**
- Modify: `vite.config.ts`, `package.json`
- Create: `src/styles/globals.css`
- Modify: `src/main.tsx` (importar globals.css)

- [ ] **Step 1: Instalar Tailwind v4 e plugin Vite**

```bash
npm install -D tailwindcss@^4 @tailwindcss/vite@^4
```

- [ ] **Step 2: Adicionar plugin ao `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 3: Criar `src/styles/globals.css` com @theme**

Tokens vêm de `docs/prd/02-design.md` §2 (cores) e §3 (tipografia).

```css
@import "tailwindcss";

@theme {
  /* Cores (warm dark) — PRD §02-design.md §2 */
  --color-bg-base: #0a0908;
  --color-bg-surface: #15110d;
  --color-bg-elevated: #1f1813;
  --color-border: #2a201a;
  --color-border-hover: #3a2a1f;
  --color-text-primary: #f4ede4;
  --color-text-muted: #a89484;
  --color-text-faint: #6b5d52;
  --color-accent: #ff7a45;
  --color-ok: #5fb56e;
  --color-warn: #ffd166;
  --color-err: #ff6b6b;

  /* Família mono única */
  --font-mono: "JetBrains Mono", ui-monospace, "Cascadia Code",
    "Source Code Pro", monospace;

  /* Breakpoints (override default — spec usa sm:480) */
  --breakpoint-sm: 30rem;   /* 480 */
  --breakpoint-md: 48rem;   /* 768 */
  --breakpoint-lg: 64rem;   /* 1024 */
  --breakpoint-xl: 90rem;   /* 1440 */
}

@layer base {
  html {
    scroll-behavior: smooth;
    background: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-feature-settings: "calt", "liga";
  }
  body {
    margin: 0;
    min-height: 100vh;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
  :where(button) {
    appearance: none;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }
}
```

- [ ] **Step 4: Importar `globals.css` em `src/main.tsx`**

Substituir qualquer import de `index.css` por:
```ts
import './styles/globals.css';
```

E remover o `index.css` gerado pelo template.

- [ ] **Step 5: Smoke-test do Tailwind**

Editar `src/App.tsx` temporariamente:
```tsx
export default function App() {
  return (
    <main className="p-8 text-text-primary">
      <h1 className="text-4xl font-bold text-accent">tailwind v4 ok</h1>
      <p className="text-text-muted">background warm dark</p>
    </main>
  );
}
```

`npm run dev` → verificar visualmente: fundo warm dark, título laranja, mono em tudo.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Tailwind v4 with @theme tokens (warm dark, mono)"
```

---

### Task 0.4: Adicionar JetBrains Mono self-hosted

**Files:**
- Modify: `package.json`, `src/main.tsx`

- [ ] **Step 1: Instalar pesos necessários**

Pesos usados (PRD §02-design.md §3): 400, 500, 700, 800. (200 não recomendado — validado contra a escala.)

```bash
npm install @fontsource/jetbrains-mono
```

- [ ] **Step 2: Importar pesos específicos em `src/main.tsx`**

Antes do `import './styles/globals.css'`:
```ts
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
```

Por quê: importar pesos individuais garante tree-shake (PRD §04-requirements.md §2.1).

- [ ] **Step 3: Verificar fonte aplicada**

`npm run dev` → DevTools → Computed → confirma `JetBrains Mono` (não fallback `monospace`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: self-host JetBrains Mono (weights 400/500/700/800)"
```

---

### Task 0.5: Adicionar lucide-react com tree-shake

**Files:** Modify: `package.json`

- [ ] **Step 1: Instalar**

```bash
npm install lucide-react
```

- [ ] **Step 2: Smoke-test (importação tree-shaken)**

Em `src/App.tsx` adicionar temporariamente:
```tsx
import { Github } from 'lucide-react';
// ...
<Github size={20} strokeWidth={1.5} />
```

`npm run dev` → ícone aparece. Remover depois (ou manter — vai ser usado).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add lucide-react for icons"
```

---

### Task 0.6: Configurar Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`, `src/tests/setup.ts`
- Modify: `package.json`, `tsconfig.json`

- [ ] **Step 1: Instalar deps**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Criar `vitest.config.ts`**

```ts
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
  },
});
```

- [ ] **Step 3: Criar `src/tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Adicionar tipos em `tsconfig.json`**

Em `compilerOptions.types`:
```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 5: Smoke test**

Criar `src/tests/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm run test:run`
Expected: 1 test passed.

Deletar o smoke test após validar.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Vitest + React Testing Library + jsdom"
```

---

### Task 0.7: Configurar ESLint e Prettier

**Files:**
- Create: `.eslintrc.cjs`, `.prettierrc.json`, `.prettierignore`

- [ ] **Step 1: Instalar deps**

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  prettier eslint-config-prettier eslint-plugin-prettier
```

- [ ] **Step 2: Criar `.eslintrc.cjs`**

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  settings: { react: { version: '18' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist', 'node_modules'],
};
```

- [ ] **Step 3: Criar `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 4: Criar `.prettierignore`**

```
node_modules
dist
package-lock.json
docs
*.png
*.woff2
```

- [ ] **Step 5: Rodar lint e formatar**

```bash
npm run lint
npm run format
```

Expected: zero errors. Se warnings persistirem, corrigir antes do commit.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add ESLint (a11y plugin) + Prettier"
```

---

### Task 0.8: Adicionar React Router

**Files:**
- Modify: `package.json`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Instalar**

```bash
npm install react-router-dom@^6
```

- [ ] **Step 2: Wrapper Router em `main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 3: Smoke-test routes em `App.tsx`** (temporário)

```tsx
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <main className="p-8">
      <nav className="mb-4 flex gap-4">
        <Link to="/" className="text-accent">PT</Link>
        <Link to="/en" className="text-accent">EN</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>portfolio PT</p>} />
        <Route path="/en" element={<p>portfolio EN</p>} />
      </Routes>
    </main>
  );
}
```

`npm run dev` → clicar PT/EN → URL muda, conteúdo muda.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add React Router DOM v6"
```

---

# PHASE 1 — Chrome e layout

Objetivo: top bar, status bar, skip link, layout shell. Tudo sem conteúdo de seções ainda — só "moldura" do app.

---

### Task 1.1: SkipLink (a11y first)

**Files:**
- Create: `src/components/chrome/SkipLink.tsx`
- Create: `src/components/chrome/SkipLink.test.tsx`

- [ ] **Step 1: Test (TDD)**

```tsx
import { render, screen } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('rende link "Pular para conteúdo" apontando para #main', () => {
    render(<SkipLink label="Pular para conteúdo" />);
    const link = screen.getByRole('link', { name: 'Pular para conteúdo' });
    expect(link).toHaveAttribute('href', '#main');
  });
});
```

- [ ] **Step 2: Run test (deve falhar)**

```bash
npm run test:run -- SkipLink
```
Expected: FAIL — `Cannot find module './SkipLink'`.

- [ ] **Step 3: Implementar**

```tsx
type SkipLinkProps = { label: string };

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-bg-elevated focus:px-3 focus:py-2 focus:text-accent"
    >
      {label}
    </a>
  );
}
```

- [ ] **Step 4: Run test**

```bash
npm run test:run -- SkipLink
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(chrome): add SkipLink"
```

---

### Task 1.2: TopBar (sem toggle de idioma ainda)

**Files:**
- Create: `src/components/chrome/TopBar.tsx`
- Create: `src/components/chrome/TopBar.test.tsx`

- [ ] **Step 1: Test (TDD)**

```tsx
import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('renderiza traffic lights, breadcrumb e hint ⌘K', () => {
    render(<TopBar breadcrumb="~/leoferolive/portfolio" />);
    expect(screen.getByText('~/leoferolive/portfolio')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test (deve falhar)**

- [ ] **Step 3: Implementar (PRD §02-design.md §5)**

```tsx
type TopBarProps = { breadcrumb: string };

export function TopBar({ breadcrumb }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 flex h-9 items-center justify-between border-b border-border bg-bg-base/90 px-4 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff5f57] opacity-70" />
        <span className="size-2.5 rounded-full bg-[#febc2e] opacity-70" />
        <span className="size-2.5 rounded-full bg-[#28c840] opacity-70" />
      </div>
      <div className="hidden text-text-muted text-xs sm:block">{breadcrumb}</div>
      <div className="rounded border border-border px-2 py-0.5 text-text-faint text-[11px]">
        ⌘K
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test (PASS)** + visual check em `App.tsx` temp.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(chrome): add TopBar with traffic lights and breadcrumb"
```

---

### Task 1.3: StatusBar

**Files:**
- Create: `src/components/chrome/StatusBar.tsx`
- Create: `src/components/chrome/StatusBar.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renderiza branch e status na esquerda', () => {
    render(<StatusBar branch="main" status="✓ deployed" lastCommit="2h ago" />);
    expect(screen.getByText(/main/)).toBeInTheDocument();
    expect(screen.getByText(/deployed/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implementar (PRD §02-design.md §5)**

```tsx
type StatusBarProps = {
  branch: string;
  status: string;
  lastCommit: string;
};

export function StatusBar({ branch, status, lastCommit }: StatusBarProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex h-7 items-center justify-between border-t border-border bg-bg-surface px-4 text-text-faint text-[11px]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      role="contentinfo"
      aria-label="Status"
    >
      <div className="flex gap-3">
        <span>git:({branch})</span>
        <span>{status}</span>
        <span className="hidden sm:inline">last commit: {lastCommit}</span>
      </div>
      <div className="hidden md:flex gap-3">
        <span>Curitiba/BR</span>
        <span>UTC-3</span>
        <span>LF</span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Run tests (PASS)** + visual.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(chrome): add StatusBar with safe-area-inset support"
```

---

### Task 1.4: PageShell

**Files:**
- Create: `src/components/layout/PageShell.tsx`
- Modify: `src/App.tsx` (usar shell)

- [ ] **Step 1: Implementar shell**

```tsx
import { TopBar } from '@/components/chrome/TopBar';
import { StatusBar } from '@/components/chrome/StatusBar';
import { SkipLink } from '@/components/chrome/SkipLink';
import type { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
  skipLabel: string;
  breadcrumb: string;
  branch: string;
  status: string;
  lastCommit: string;
};

export function PageShell({
  children,
  skipLabel,
  breadcrumb,
  branch,
  status,
  lastCommit,
}: PageShellProps) {
  return (
    <>
      <SkipLink label={skipLabel} />
      <TopBar breadcrumb={breadcrumb} />
      <main id="main" className="mx-auto max-w-5xl px-6 pb-16 lg:px-8">
        {children}
      </main>
      <StatusBar branch={branch} status={status} lastCommit={lastCommit} />
    </>
  );
}
```

- [ ] **Step 2: Usar em `App.tsx`** (placeholder ainda)

```tsx
import { Routes, Route } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageShell
            skipLabel="Pular para conteúdo"
            breadcrumb="~/leoferolive/portfolio"
            branch="main"
            status="✓ deployed"
            lastCommit="hoje"
          >
            <p className="py-12">conteúdo das seções vai aqui</p>
          </PageShell>
        }
      />
    </Routes>
  );
}
```

`npm run dev` → ver shell completo (top bar + main + status bar).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(layout): add PageShell with skip link, top bar, status bar"
```

---

### Task 1.5: Animation keyframes

**Files:**
- Create: `src/styles/animations.css`
- Modify: `src/main.tsx` (importar)

- [ ] **Step 1: Criar keyframes**

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

.reveal {
  opacity: 0;
}
.reveal.is-revealed {
  animation: reveal 600ms cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .cursor-blink,
  .reveal,
  .reveal.is-revealed {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Importar em `main.tsx`** (após `globals.css`)

```ts
import './styles/animations.css';
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style: add typewriter/blink/reveal keyframes with reduced-motion guard"
```

---

# PHASE 2 — i18n base

Objetivo: roteamento por idioma, dicionários tipados, toggle PT/EN funcional, paridade garantida.

---

### Task 2.1: Tipo I18nDictionary com seções vazias

**Files:**
- Create: `src/i18n/types.ts`

- [ ] **Step 1: Criar interface tipada (placeholder vazio agora; preenchemos por seção depois)**

```ts
export type Lang = 'pt' | 'en';

export interface I18nDictionary {
  meta: {
    title: string;
    description: string;
    htmlLang: 'pt-BR' | 'en';
  };
  chrome: {
    skipLabel: string;
    breadcrumb: string;
    branch: string;
    status: string;
    lastCommit: string;
    languageToggleLabel: string;
  };
  // Seções preenchidas em Phase 3
  hero: {
    promptCommand: string;
    name: string;
    subtitle: string;
    tagline: string;
    capabilities: string;
    metaLine: string;
    cta: { github: string; linkedin: string; email: string };
  };
  cases: {
    caption: string;
    title: string;
    subtitle: string;
  };
  career: {
    caption: string;
    title: string;
    subtitle: string;
    inProgress: string;
    yearsBadge: (n: number) => string;
    expandLabel: string;
  };
  workflow: {
    caption: string;
    title: string;
    subtitle: string;
    closing: string;
    proof: string;
  };
  projects: {
    caption: string;
    title: string;
    subtitle: string;
  };
  stack: {
    caption: string;
    title: string;
    subtitle: string;
  };
  contact: {
    caption: string;
    title: string;
    subtitle: string;
    promptCommand: string;
    keys: {
      email: string;
      github: string;
      linkedin: string;
      location: string;
      education: string;
      languages: string;
    };
    values: {
      location: string;
      education: string;
      languages: string;
    };
    copyEmailAria: string;
    copiedFeedback: string;
    footerExit: string;
    footerNote: string;
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(i18n): define I18nDictionary interface"
```

---

### Task 2.2: PT e EN dicionários iniciais (estrutura completa, copy stub)

**Files:**
- Create: `src/i18n/pt.ts`
- Create: `src/i18n/en.ts`

> Copy completo virá nas tasks de cada seção. Aqui criamos a estrutura para satisfazer os types.

- [ ] **Step 1: PT dict**

`src/i18n/pt.ts`:
```ts
import type { I18nDictionary } from './types';

export const pt: I18nDictionary = {
  meta: {
    title: 'Leonardo Fernandes Oliveira — Senior Software Engineer · AI-First',
    description:
      'Senior Software Engineer com 10+ anos em Java/Spring e foco em engenharia AI-First. Construo sistemas que usam IA, e uso IA pra construir sistemas.',
    htmlLang: 'pt-BR',
  },
  chrome: {
    skipLabel: 'Pular para conteúdo',
    breadcrumb: '~/leoferolive/portfolio',
    branch: 'main',
    status: '✓ deployed',
    lastCommit: 'hoje',
    languageToggleLabel: 'Trocar idioma para inglês',
  },
  hero: {
    promptCommand: '~ $ whoami',
    name: 'Leonardo Fernandes Oliveira',
    subtitle: 'Senior Software Engineer · AI-First Engineer',
    tagline: 'Construo sistemas que usam IA, e uso IA pra construir sistemas.',
    capabilities:
      'sistemas distribuídos · features de IA em produção · fluxos AI-First',
    metaLine: 'Curitiba/BR · 10+ anos · @Wiley desde 2024',
    cta: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' },
  },
  cases: {
    caption: '// production-cases',
    title: 'Cases em Produção',
    subtitle:
      'Cinco entregas que mudaram a operação dentro da Wiley — quatro de IA e uma de engenharia em escala.',
  },
  career: {
    caption: '// career',
    title: 'Trajetória',
    subtitle:
      'Dez anos de engenharia: de sustentação em sinistros a entrega de IA em produção.',
    inProgress: 'in progress',
    yearsBadge: (n) => `${n} years`,
    expandLabel: 'Expandir detalhes',
  },
  workflow: {
    caption: '// how-i-work',
    title: 'Engenharia AI-First',
    subtitle:
      'Mais que autocomplete: agentes entregam features E2E sob revisão humana.',
    closing:
      'Resultado: ciclo `issue → plano → código → PR → review → merge` com agente fazendo o trabalho braçal e dev senior validando arquitetura e edge cases. Não é magia. É engenharia disciplinada com IA no loop.',
    proof:
      'Em 2025: 4 iniciativas de IA em produção, workspace agêntico adotado pelo time, padrões disseminados via Conselho de IA Wiley Research BR.',
  },
  projects: {
    caption: '// side-projects',
    title: 'Projetos Pessoais',
    subtitle: 'Construídos 100% via AI coding. Em produção, self-hosted.',
  },
  stack: {
    caption: '// stack',
    title: 'Stack',
    subtitle: 'Onde sou rápido. Onde sou perigoso.',
  },
  contact: {
    caption: '// contact',
    title: 'Vamos conversar',
    subtitle: 'Curitiba/BR · aberto a remoto · disponibilidade para discutir.',
    promptCommand: '$ contact --leo',
    keys: {
      email: 'email',
      github: 'github',
      linkedin: 'linkedin',
      location: 'location',
      education: 'education',
      languages: 'languages',
    },
    values: {
      location: 'Curitiba, PR — Brasil',
      education: 'FAETERJ-RJ · Tec. em Análise e Desenvolvimento de Sistemas',
      languages: 'PT (nativo) · EN (profissional)',
    },
    copyEmailAria: 'Copiar email',
    copiedFeedback: 'Copiado',
    footerExit: '~ $ exit',
    footerNote:
      'built with React + Vite, hosted on a Raspberry Pi.\n2026 · Leonardo Fernandes Oliveira',
  },
};
```

- [ ] **Step 2: EN dict**

`src/i18n/en.ts`:
```ts
import type { I18nDictionary } from './types';

export const en: I18nDictionary = {
  meta: {
    title: 'Leonardo Fernandes Oliveira — Senior Software Engineer · AI-First',
    description:
      'Senior Software Engineer with 10+ years in Java/Spring and a focus on AI-First engineering. I build systems that use AI, and I use AI to build systems.',
    htmlLang: 'en',
  },
  chrome: {
    skipLabel: 'Skip to content',
    breadcrumb: '~/leoferolive/portfolio',
    branch: 'main',
    status: '✓ deployed',
    lastCommit: 'today',
    languageToggleLabel: 'Switch language to Portuguese',
  },
  hero: {
    promptCommand: '~ $ whoami',
    name: 'Leonardo Fernandes Oliveira',
    subtitle: 'Senior Software Engineer · AI-First Engineer',
    tagline: 'I build with AI, and I build AI systems.',
    capabilities:
      'distributed systems · AI features in production · AI-First workflows',
    metaLine: 'Curitiba/BR · 10+ years · @Wiley since 2024',
    cta: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' },
  },
  cases: {
    caption: '// production-cases',
    title: 'Cases in Production',
    subtitle:
      'Five deliveries that changed operations at Wiley — four AI-driven and one in distributed engineering.',
  },
  career: {
    caption: '// career',
    title: 'Career',
    subtitle:
      'Ten years in engineering: from claims systems support to delivering AI in production.',
    inProgress: 'in progress',
    yearsBadge: (n) => `${n} years`,
    expandLabel: 'Expand details',
  },
  workflow: {
    caption: '// how-i-work',
    title: 'AI-First Engineering',
    subtitle:
      'Beyond autocomplete: agents deliver features end-to-end under human review.',
    closing:
      'Outcome: an `issue → plan → code → PR → review → merge` loop where the agent does the legwork and the senior dev validates architecture and edge cases. Not magic. Disciplined engineering with AI in the loop.',
    proof:
      'In 2025: 4 AI initiatives in production, agentic workspace adopted by the team, standards rolled out via the Wiley Research BR AI Council.',
  },
  projects: {
    caption: '// side-projects',
    title: 'Personal Projects',
    subtitle: 'Built 100% via AI coding. In production, self-hosted.',
  },
  stack: {
    caption: '// stack',
    title: 'Stack',
    subtitle: 'Where I move fast. Where I am dangerous.',
  },
  contact: {
    caption: '// contact',
    title: "Let's talk",
    subtitle: 'Curitiba/BR · open to remote · available to discuss.',
    promptCommand: '$ contact --leo',
    keys: {
      email: 'email',
      github: 'github',
      linkedin: 'linkedin',
      location: 'location',
      education: 'education',
      languages: 'languages',
    },
    values: {
      location: 'Curitiba, PR — Brazil',
      education: 'FAETERJ-RJ · Information Systems Technology',
      languages: 'PT (native) · EN (professional)',
    },
    copyEmailAria: 'Copy email',
    copiedFeedback: 'Copied',
    footerExit: '~ $ exit',
    footerNote:
      'built with React + Vite, hosted on a Raspberry Pi.\n2026 · Leonardo Fernandes Oliveira',
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(i18n): add PT and EN dictionaries"
```

---

### Task 2.3: Provider, hook e routing helpers

**Files:**
- Create: `src/i18n/context.tsx`, `src/i18n/useT.ts`, `src/i18n/routing.ts`

- [ ] **Step 1: Routing helpers**

`src/i18n/routing.ts`:
```ts
import type { Lang } from './types';

export const langPathPrefix = (lang: Lang) => (lang === 'pt' ? '' : '/en');

export const langFromPath = (pathname: string): Lang =>
  pathname.startsWith('/en') ? 'en' : 'pt';

export const swapLangPath = (pathname: string, hash: string, target: Lang) => {
  const stripped = pathname.replace(/^\/en/, '') || '/';
  const base = target === 'en' ? `/en${stripped === '/' ? '' : stripped}` : stripped;
  return `${base}${hash}`;
};
```

- [ ] **Step 2: Provider e contexto**

`src/i18n/context.tsx`:
```tsx
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { I18nDictionary, Lang } from './types';
import { pt } from './pt';
import { en } from './en';

const dicts: Record<Lang, I18nDictionary> = { pt, en };

type I18nContextValue = {
  lang: Lang;
  t: I18nDictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: dicts[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
```

- [ ] **Step 3: Hook conveniência**

`src/i18n/useT.ts`:
```ts
import { useI18n } from './context';

export const useT = () => useI18n().t;
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(i18n): add Provider, hook, and routing helpers"
```

---

### Task 2.4: Routing por idioma + sincronia com `<html lang>`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Implementar wrapper de rotas**

```tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { I18nProvider } from '@/i18n/context';
import { langFromPath } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { useT } from '@/i18n/useT';

function LocalizedShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <PageShell
      skipLabel={t.chrome.skipLabel}
      breadcrumb={t.chrome.breadcrumb}
      branch={t.chrome.branch}
      status={t.chrome.status}
      lastCommit={t.chrome.lastCommit}
    >
      {children}
    </PageShell>
  );
}

function HtmlLangSync() {
  const t = useT();
  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;
  }, [t]);
  return null;
}

function LangApp({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  return (
    <I18nProvider lang={lang}>
      <HtmlLangSync />
      <LocalizedShell>{children}</LocalizedShell>
    </I18nProvider>
  );
}

const PlaceholderHome = () => <p className="py-12">conteúdo das seções aqui</p>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LangApp><PlaceholderHome /></LangApp>} />
      <Route path="/en" element={<LangApp><PlaceholderHome /></LangApp>} />
      <Route path="*" element={<LangApp><PlaceholderHome /></LangApp>} />
    </Routes>
  );
}
```

- [ ] **Step 2: Verificar manualmente**

`npm run dev` → `/` mostra "Pular para conteúdo" no skip link; `/en` mostra "Skip to content". `<html>` no devtools tem `lang="pt-BR"` ou `lang="en"`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(i18n): wire routes /, /en with provider and html lang sync"
```

---

### Task 2.5: LanguageToggle no top bar

**Files:**
- Create: `src/components/chrome/LanguageToggle.tsx`, `src/components/chrome/LanguageToggle.test.tsx`
- Modify: `src/components/chrome/TopBar.tsx`

- [ ] **Step 1: Test (TDD — comportamento de URL)**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { I18nProvider } from '@/i18n/context';
import { LanguageToggle } from './LanguageToggle';

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname}</div>;
}

describe('LanguageToggle', () => {
  it('clicar troca de PT (/) para EN (/en)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider lang="pt">
          <LanguageToggle />
          <LocationProbe />
        </I18nProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /Trocar idioma/i }));
    expect(screen.getByTestId('loc')).toHaveTextContent('/en');
  });
});
```

- [ ] **Step 2: Implementar**

```tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useI18n } from '@/i18n/context';
import { swapLangPath } from '@/i18n/routing';

const STORAGE_KEY = 'lang';

export function LanguageToggle() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const target = lang === 'pt' ? 'en' : 'pt';
  const onSwitch = () => {
    const next = swapLangPath(location.pathname, location.hash, target);
    navigate(next);
  };

  return (
    <button
      type="button"
      aria-label={t.chrome.languageToggleLabel}
      className="rounded border border-border px-2 py-0.5 text-text-faint text-[11px] hover:border-border-hover hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      onClick={onSwitch}
    >
      <span className={lang === 'pt' ? 'text-accent' : ''}>PT</span>
      <span className="mx-1 text-text-faint">·</span>
      <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
    </button>
  );
}
```

- [ ] **Step 3: Adicionar ao `TopBar.tsx`**

Substituir o pill `⌘K` decorativo por:
```tsx
<div className="flex items-center gap-2">
  <LanguageToggle />
  <div className="hidden md:block rounded border border-border px-2 py-0.5 text-text-faint text-[11px]">
    ⌘K
  </div>
</div>
```

- [ ] **Step 4: Run tests** + visual.

- [ ] **Step 5: Persistência via localStorage** — adicionar leitura inicial em `App.tsx`:

No componente raiz, antes do `<Routes>`:
```tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PersistedLangRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/' && localStorage.getItem('lang') === 'en') {
      navigate('/en' + location.hash, { replace: true });
    }
  }, []);
  return null;
}
```

E renderizar `<PersistedLangRedirect />` no nível mais alto (dentro do `<BrowserRouter>` mas antes do `<Routes>`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(i18n): add LanguageToggle with localStorage persistence"
```

---

### Task 2.6: Test de paridade PT/EN

**Files:**
- Create: `src/i18n/parity.test.ts`

- [ ] **Step 1: Implementar test**

```ts
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
```

- [ ] **Step 2: Run test (PASS)**

```bash
npm run test:run -- parity
```
Expected: 1 test passed.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test(i18n): assert PT/EN dictionary key parity"
```

---

# PHASE 3 — Sections

Objetivo: implementar as 7 seções com copy real, mobile-first.

---

### Task 3.1: UI primitives (PromptLine, SectionHeader, ExternalLink)

**Files:**
- Create: `src/components/ui/PromptLine.tsx`, `src/components/ui/SectionHeader.tsx`, `src/components/ui/ExternalLink.tsx`

- [ ] **Step 1: PromptLine**

```tsx
type PromptLineProps = { command: string };

export function PromptLine({ command }: PromptLineProps) {
  return (
    <div className="font-mono text-text-muted">
      <span className="text-text-faint">~</span>{' '}
      <span className="text-accent">$</span>{' '}
      <span className="text-text-primary">{command}</span>
    </div>
  );
}
```

- [ ] **Step 2: SectionHeader**

```tsx
type SectionHeaderProps = {
  caption: string;
  title: string;
  subtitle?: string;
  id: string;
};

export function SectionHeader({ caption, title, subtitle, id }: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <p className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
        {caption}
      </p>
      <h2 id={id} className="text-3xl font-bold text-text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
    </header>
  );
}
```

- [ ] **Step 3: ExternalLink**

```tsx
import type { ReactNode, AnchorHTMLAttributes } from 'react';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): add PromptLine, SectionHeader, ExternalLink primitives"
```

---

### Task 3.2: Hero (com typewriter)

**Files:**
- Create: `src/hooks/useTypewriter.ts`, `src/hooks/useReducedMotion.ts`
- Create: `src/components/sections/Hero.tsx`
- Create: `src/hooks/useTypewriter.test.ts`
- Modify: `src/App.tsx` (renderizar Hero)

- [ ] **Step 1: useReducedMotion hook**

```ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: useTypewriter hook + test (TDD)**

`src/hooks/useTypewriter.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from './useTypewriter';

describe('useTypewriter', () => {
  it('retorna texto completo imediatamente quando disabled', () => {
    const { result } = renderHook(() => useTypewriter('hello', { disabled: true }));
    expect(result.current).toBe('hello');
  });

  it('progressivamente revela caracteres', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTypewriter('hi', { speedMs: 10 }));
    expect(result.current).toBe('');
    await act(async () => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('h');
    await act(async () => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('hi');
    vi.useRealTimers();
  });
});
```

`src/hooks/useTypewriter.ts`:
```ts
import { useEffect, useState } from 'react';

type Options = { speedMs?: number; disabled?: boolean };

export function useTypewriter(text: string, { speedMs = 30, disabled = false }: Options = {}) {
  const [displayed, setDisplayed] = useState(disabled ? text : '');

  useEffect(() => {
    if (disabled) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, disabled]);

  return displayed;
}
```

Run: `npm run test:run -- useTypewriter` → PASS.

- [ ] **Step 3: Hero component**

```tsx
import { useT } from '@/i18n/useT';
import { PromptLine } from '@/components/ui/PromptLine';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Github, Linkedin, Mail } from 'lucide-react';

const GITHUB_URL = 'https://github.com/leoferolive';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leonardo-fer-oliveira/';
const EMAIL = 'leoferolive@gmail.com';

export function Hero() {
  const t = useT();
  const reduced = useReducedMotion();
  const tagline = useTypewriter(t.hero.tagline, { disabled: reduced });

  return (
    <section id="home" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <PromptLine command={t.hero.promptCommand.replace(/^~ \$ /, '')} />
      <h1 className="mt-6 text-[44px] leading-tight font-extrabold md:text-[72px] md:leading-[1.1]">
        {t.hero.name}
      </h1>
      <p className="mt-2 text-lg text-text-muted md:text-xl">{t.hero.subtitle}</p>
      <p className="mt-6 text-base md:text-lg">
        <span className="text-accent">&gt;</span> {tagline}
        <span className="cursor-blink ml-1 inline-block bg-text-primary text-text-primary">▊</span>
      </p>
      <p className="mt-4 text-text-muted">{t.hero.capabilities}</p>
      <p className="mt-1 text-text-faint text-sm">{t.hero.metaLine}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ExternalLink
          href={GITHUB_URL}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Github size={20} strokeWidth={1.5} /> {t.hero.cta.github}
        </ExternalLink>
        <ExternalLink
          href={LINKEDIN_URL}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Linkedin size={20} strokeWidth={1.5} /> {t.hero.cta.linkedin}
        </ExternalLink>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Mail size={20} strokeWidth={1.5} /> {t.hero.cta.email}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Renderizar em `App.tsx`** (substituir `PlaceholderHome`)

```tsx
import { Hero } from '@/components/sections/Hero';

const Home = () => <Hero />;
// usar <Home /> nas Routes
```

`npm run dev` → ver Hero PT (`/`) e EN (`/en`). Typewriter rola; cursor pisca; CTAs funcionam.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(sections): add Hero with typewriter, reduced-motion guard, CTAs"
```

---

### Task 3.3: Cases section (5 cards)

**Files:**
- Create: `src/data/cases.ts`, `src/components/ui/CaseCard.tsx`, `src/components/sections/Cases.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Tipos + dados (5 cards)**

`src/data/cases.ts` — copy de `docs/superpowers/specs/2026-05-03-cv-enriched-portfolio-design.md` §4.2:

```ts
export type CaseStatus = 'in production' | 'in production (MVP)' | 'final testing' | 'adopted by team';

export type CaseEntry = {
  id: string;
  filename: string;
  status: CaseStatus;
  category: 'ai' | 'engineering';
  problem: { pt: string; en: string };
  solution: { pt: string; en: string };
  impact: { pt: string; en: string };
  stack: readonly string[];
};

export const cases: readonly CaseEntry[] = [
  {
    id: '01',
    filename: '01_log_analyzer.case',
    status: 'in production',
    category: 'ai',
    problem: {
      pt: 'investigação de incidentes levava dias, frequentemente sem identificação da causa raiz.',
      en: 'incident investigations took days, often without root-cause identification.',
    },
    solution: {
      pt: 'Java 24 + Spring Boot 3 + Spring AI + Azure OpenAI/GPT-4. Consulta Kibana/Elasticsearch por transactionId; LLM identifica sistema de origem e causa raiz.',
      en: 'Java 24 + Spring Boot 3 + Spring AI + Azure OpenAI/GPT-4. Queries Kibana/Elasticsearch by transactionId; LLM identifies originating system and root cause.',
    },
    impact: {
      pt: 'dias → minutos. Em produção, usado por engenharia e suporte.',
      en: 'days → minutes. In production, used by engineering and support.',
    },
    stack: ['Java 24', 'Spring AI', 'Azure OpenAI', 'Elasticsearch', 'Kibana'],
  },
  {
    id: '02',
    filename: '02_rag_platform.case',
    status: 'in production (MVP)',
    category: 'ai',
    problem: {
      pt: 'informação de artigos espalhada em 5+ sistemas internos.',
      en: 'article information scattered across 5+ internal systems.',
    },
    solution: {
      pt: 'Spring AI + Pgvector + Azure OpenAI integrando 5+ fontes. Interfaces de chat e servidor MCP para consultas em linguagem natural.',
      en: 'Spring AI + Pgvector + Azure OpenAI integrating 5+ sources. Chat interfaces and MCP server for natural-language queries.',
    },
    impact: {
      pt: 'MVP em produção. Suporte e produto consultam por linguagem natural.',
      en: 'MVP in production. Support and product query through natural language.',
    },
    stack: ['Spring AI', 'Pgvector', 'Azure OpenAI', 'MCP', 'PostgreSQL'],
  },
  {
    id: '03',
    filename: '03_revenue_tracking.case',
    status: 'final testing',
    category: 'ai',
    problem: {
      pt: 'estimativa tradicional 3+ meses para entregar o core.',
      en: 'traditional estimate of 3+ months to deliver the core.',
    },
    solution: {
      pt: 'Liderei a vertente de IA em squad de 3. Skills, commands customizados, AGENTS.md e CI/CD validando código gerado por Cursor.',
      en: 'Led the AI track in a squad of 3. Custom skills, commands, AGENTS.md and CI/CD validating Cursor-generated code.',
    },
    impact: {
      pt: 'core entregue em ~1 mês. Em testes finais.',
      en: 'core delivered in ~1 month. In final testing.',
    },
    stack: ['Cursor', 'AGENTS.md', 'Skills', 'CI/CD'],
  },
  {
    id: '04',
    filename: '04_agentic_workspace.case',
    status: 'adopted by team',
    category: 'ai',
    problem: {
      pt: 'onboarding lento e support duty manual.',
      en: 'slow onboarding and manual support duty.',
    },
    solution: {
      pt: 'Workspace versionável: skills + AGENTS.md + MCPs (Jira, Kibana). Agente executa support duty E2E (issue → logs → fix → comentário no Jira).',
      en: 'Versioned workspace: skills + AGENTS.md + MCPs (Jira, Kibana). Agent runs support duty E2E (issue → logs → fix → Jira comment).',
    },
    impact: {
      pt: 'adotado pelo time. Disseminado via Conselho de IA Wiley Research BR.',
      en: 'adopted by the team. Rolled out via the Wiley Research BR AI Council.',
    },
    stack: ['Skills', 'AGENTS.md', 'MCP', 'Jira', 'Kibana'],
  },
  {
    id: '05',
    filename: '05_sse_at_scale.case',
    status: 'in production',
    category: 'engineering',
    problem: {
      pt: 'entrega de eventos em tempo real para o frontend em K8s com múltiplos pods — broadcast inconsistente entre instâncias e custo crescente de conexões por aba.',
      en: 'real-time event delivery to the frontend in a multi-pod Kubernetes environment — inconsistent broadcast across instances and growing per-tab connection cost.',
    },
    solution: {
      pt: 'Desenhei E2E a entrega de SSE com Redis Pub/Sub para consistência entre pods, e adicionei camada de BroadcastChannel no frontend para deduplicar conexões por aba. Java 25, Spring Boot 4.',
      en: 'Designed end-to-end SSE delivery with Redis Pub/Sub for cross-pod consistency, plus a BroadcastChannel layer on the frontend to deduplicate per-tab connections. Java 25, Spring Boot 4.',
    },
    impact: {
      pt: 'Eventos consistentes em ambiente multi-pod e redução significativa de carga de conexões no backend. Em produção na plataforma de submissões/publicações da Wiley.',
      en: "Consistent events across pods and significant reduction in backend connection load. In production on Wiley's submissions/publications platform.",
    },
    stack: ['Java 25', 'Spring Boot 4', 'Redis Pub/Sub', 'SSE', 'Kubernetes', 'BroadcastChannel API'],
  },
] as const;
```

- [ ] **Step 2: CaseCard component**

```tsx
import type { CaseEntry } from '@/data/cases';
import type { Lang } from '@/i18n/types';

type Props = { caseEntry: CaseEntry; lang: Lang };

export function CaseCard({ caseEntry, lang }: Props) {
  return (
    <article className="rounded border border-border bg-bg-surface p-5 transition-colors hover:border-border-hover hover:bg-bg-elevated">
      <header className="mb-4 flex items-start justify-between gap-3">
        <code className="text-sm text-text-muted">{caseEntry.filename}</code>
        <span className="shrink-0 rounded bg-bg-elevated px-2 py-0.5 text-[11px] text-ok">
          ✓ {caseEntry.status}
        </span>
      </header>
      <pre className="whitespace-pre-wrap font-mono text-sm">
        <span className="text-text-muted">{'{'}</span>
        {'\n'}
        <span className="text-text-faint">  problem:  </span>
        <span className="text-text-primary">"{caseEntry.problem[lang]}"</span>,{'\n'}
        <span className="text-text-faint">  solution: </span>
        <span className="text-text-primary">"{caseEntry.solution[lang]}"</span>,{'\n'}
        <span className="text-text-faint">  impact:   </span>
        <span className="text-text-primary">"{caseEntry.impact[lang]}"</span>
        {'\n'}
        <span className="text-text-muted">{'}'}</span>
      </pre>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {caseEntry.stack.map((s) => (
          <li
            key={s}
            className="rounded border border-border px-2 py-0.5 text-[11px] text-text-faint"
          >
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 3: Cases section**

```tsx
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CaseCard } from '@/components/ui/CaseCard';
import { cases } from '@/data/cases';

export function Cases() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section className="py-16 md:py-24">
      <SectionHeader
        id="cases-title"
        caption={t.cases.caption}
        title={t.cases.title}
        subtitle={t.cases.subtitle}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <CaseCard key={c.id} caseEntry={c} lang={lang} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Renderizar em `App.tsx`** ao lado do Hero.

`npm run dev` → 5 cards visíveis em PT e EN.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(sections): add Cases (5 cards: 4 AI + SSE/Redis)"
```

---

### Task 3.4: Career data + componentes detalhados

**Files:**
- Create: `src/data/career.ts`
- Create: `src/components/ui/CareerEntryDetailed.tsx`
- Create: `src/components/ui/CareerEntryLine.tsx`

- [ ] **Step 1: Career data** (spec §4.3)

```ts
export type CareerBadge = 'in_progress' | { years: number };

export type CareerDetailed = {
  kind: 'detailed';
  id: string;
  company: string;
  role: { pt: string; en: string };
  period: { pt: string; en: string };
  badge: CareerBadge;
  summary: { pt: string; en: string };
  bullets: ReadonlyArray<{ pt: string; en: string }>;
};

export type CareerLine = {
  kind: 'line';
  id: string;
  yearLabel: string;
  text: { pt: string; en: string };
};

export type CareerEntry = CareerDetailed | CareerLine;

export const career: readonly CareerEntry[] = [
  {
    kind: 'detailed',
    id: 'wiley',
    company: 'Wiley',
    role: { pt: 'Senior SE', en: 'Senior SE' },
    period: { pt: 'Dez 2024 → now', en: 'Dec 2024 → now' },
    badge: 'in_progress',
    summary: {
      pt: 'AI-First leadership · UAXD platform · 10k+ autores · 5 países',
      en: 'AI-First leadership · UAXD platform · 10k+ authors · 5 countries',
    },
    bullets: [
      {
        pt: 'Arquitetura SSE/Redis Pub/Sub em K8s + BroadcastChannel',
        en: 'SSE/Redis Pub/Sub architecture in K8s + BroadcastChannel',
      },
      {
        pt: '4 iniciativas de IA em produção (logs, RAG, revenue, workspace)',
        en: '4 AI initiatives in production (logs, RAG, revenue, workspace)',
      },
      {
        pt: 'Co-fundador, Conselho de IA Wiley Research BR',
        en: 'Co-founder, Wiley Research BR AI Council',
      },
    ],
  },
  {
    kind: 'detailed',
    id: 'ebix',
    company: 'Ebix',
    role: { pt: 'Ref. Técnica', en: 'Tech Lead' },
    period: { pt: 'Jun 2019 → Jul 2024', en: 'Jun 2019 → Jul 2024' },
    badge: { years: 5 },
    summary: {
      pt: 'Bradesco Seguros · Sinistros · alta criticidade',
      en: 'Bradesco Seguros · Claims · high financial criticality',
    },
    bullets: [
      {
        pt: '500–1.000 sinistros/dia · valores individuais de até R$5M',
        en: '500–1,000 claims/day · individual values up to R$5M',
      },
      {
        pt: 'Integração SAP · BFF P8 FileNet · WebSphere 8 → 9',
        en: 'SAP integration · BFF over P8 FileNet · WebSphere 8 → 9 migration',
      },
      {
        pt: 'Mentoria de 8+ devs juniores',
        en: 'Mentored 8+ junior developers',
      },
    ],
  },
  {
    kind: 'line',
    id: 'cityconnect',
    yearLabel: '2024',
    text: {
      pt: 'City Connect · Tech Lead · TCE-PR (8 devs)',
      en: 'City Connect · Tech Lead · TCE-PR (8 devs)',
    },
  },
  {
    kind: 'line',
    id: 'lumis',
    yearLabel: '2018 → 2019',
    text: {
      pt: 'Lumis · SulAmérica · microsserviços OpenShift',
      en: 'Lumis · SulAmérica · OpenShift microservices',
    },
  },
  {
    kind: 'line',
    id: 'persist',
    yearLabel: '2014 → 2018',
    text: {
      pt: 'Persist/Ebix · estágio → pleno',
      en: 'Persist/Ebix · intern → mid-level dev',
    },
  },
] as const;
```

- [ ] **Step 2: CareerEntryDetailed (com mobile collapsible)**

```tsx
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CareerDetailed } from '@/data/career';
import type { Lang } from '@/i18n/types';
import { useT } from '@/i18n/useT';

type Props = {
  entry: CareerDetailed;
  lang: Lang;
  defaultExpandedMobile: boolean;
};

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 30rem)').matches;

export function CareerEntryDetailed({ entry, lang, defaultExpandedMobile }: Props) {
  const t = useT();
  const [mobileExpanded, setMobileExpanded] = useState(defaultExpandedMobile);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    const mq = window.matchMedia('(max-width: 30rem)');
    const listener = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const showBullets = !mobile || mobileExpanded;
  const badgeText =
    entry.badge === 'in_progress' ? t.career.inProgress : t.career.yearsBadge(entry.badge.years);

  const Header = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-bold text-text-primary">
        {entry.company} · {entry.role[lang]} · {entry.period[lang]}
      </span>
      <span className="shrink-0 text-text-faint text-[11px]">[{badgeText}]</span>
    </div>
  );

  return (
    <div className="border-l-2 border-border pl-4 py-2">
      {mobile ? (
        <button
          type="button"
          aria-expanded={mobileExpanded}
          aria-controls={`career-${entry.id}-bullets`}
          onClick={() => setMobileExpanded((v) => !v)}
          className="flex w-full items-center gap-2 text-left min-h-[44px]"
        >
          <ChevronRight
            size={14}
            strokeWidth={1.5}
            className={`shrink-0 transition-transform ${mobileExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
          <div className="flex-1">{Header}</div>
        </button>
      ) : (
        Header
      )}
      <p className="mt-1 text-text-muted text-sm">{entry.summary[lang]}</p>
      <ul
        id={`career-${entry.id}-bullets`}
        className={`mt-2 space-y-1 overflow-hidden transition-all ${
          showBullets ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {entry.bullets.map((b, i) => (
          <li key={i} className="text-sm text-text-primary">
            • {b[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: CareerEntryLine**

```tsx
import type { CareerLine } from '@/data/career';
import type { Lang } from '@/i18n/types';

export function CareerEntryLine({ entry, lang }: { entry: CareerLine; lang: Lang }) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-muted">
      <span className="text-text-faint">└──</span>
      <span className="w-28 shrink-0 text-text-faint">{entry.yearLabel}</span>
      <span>{entry.text[lang]}</span>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(career): add detailed/line entry components and data"
```

---

### Task 3.5: Career section

**Files:**
- Create: `src/components/sections/Career.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Section component**

```tsx
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PromptLine } from '@/components/ui/PromptLine';
import { CareerEntryDetailed } from '@/components/ui/CareerEntryDetailed';
import { CareerEntryLine } from '@/components/ui/CareerEntryLine';
import { career } from '@/data/career';

export function Career() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="career" className="py-16 md:py-24">
      <SectionHeader
        id="career-title"
        caption={t.career.caption}
        title={t.career.title}
        subtitle={t.career.subtitle}
      />
      <div className="space-y-3">
        <PromptLine command="cat ~/career/" />
        {career.map((entry) =>
          entry.kind === 'detailed' ? (
            <CareerEntryDetailed
              key={entry.id}
              entry={entry}
              lang={lang}
              defaultExpandedMobile={entry.id === 'wiley'}
            />
          ) : (
            <CareerEntryLine key={entry.id} entry={entry} lang={lang} />
          ),
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Renderizar em `App.tsx`** depois de `<Cases />`.

`npm run dev` → desktop: tudo expandido. Mobile (DevTools 375px): Wiley aberta, Ebix com chevron — clicar expande.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(sections): add Career with mobile-collapsed Ebix"
```

---

### Task 3.6: Workflow section

**Files:** Create: `src/components/sections/Workflow.tsx`

- [ ] **Step 1: Component**

```tsx
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';

const PILLARS = [
  {
    name: 'skills/',
    pt: 'convenções reutilizáveis por domínio (REST endpoint, Kafka consumer, Spring Security, …)',
    en: 'reusable per-domain conventions (REST endpoint, Kafka consumer, Spring Security, …)',
  },
  {
    name: 'AGENTS.md',
    pt: 'arquitetura, padrões e comandos do projeto — contexto que o agente lê primeiro',
    en: 'architecture, patterns and project commands — context the agent reads first',
  },
  {
    name: 'MCPs',
    pt: 'integrações com Jira, Kibana, GitHub, banco — agente age, não só sugere',
    en: 'integrations with Jira, Kibana, GitHub, DB — the agent acts, not just suggests',
  },
  {
    name: 'CI/CD ativo',
    pt: 'linters + testes + fitness functions + validação de contrato. CI vira o revisor automático do agente.',
    en: 'linters + tests + fitness functions + contract validation. CI becomes the agent\'s automated reviewer.',
  },
] as const;

export function Workflow() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="workflow" className="py-16 md:py-24">
      <SectionHeader
        id="workflow-title"
        caption={t.workflow.caption}
        title={t.workflow.title}
        subtitle={t.workflow.subtitle}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PILLARS.map((p) => (
          <article key={p.name} className="rounded border border-border bg-bg-surface p-4">
            <h3 className="font-bold text-accent">{p.name}</h3>
            <p className="mt-2 text-sm text-text-muted">{p[lang]}</p>
          </article>
        ))}
      </div>
      <blockquote className="mt-8 border-l-2 border-accent pl-4 text-text-muted">
        {t.workflow.closing}
      </blockquote>
      <p className="mt-4 text-sm text-text-faint">{t.workflow.proof}</p>
    </section>
  );
}
```

- [ ] **Step 2: Renderizar em `App.tsx`**.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(sections): add Workflow with 4 pillars + 2025 proof line"
```

---

### Task 3.7: Projects section (3 cards)

**Files:** Create: `src/data/projects.ts`, `src/components/ui/ProjectCard.tsx`, `src/components/sections/Projects.tsx`

- [ ] **Step 1: Data** (PRD §3-content.md §4)

```ts
export type ProjectEntry = {
  id: string;
  type: 'app' | 'pwa' | 'infra';
  name: string;
  description: { pt: string; en: string };
  stack: readonly string[];
  builtWith?: string;
  link?: string;
};

export const projects: readonly ProjectEntry[] = [
  {
    id: 'nossalista',
    type: 'app',
    name: 'nossalista',
    description: {
      pt: 'Listas colaborativas em tempo real, compartilhadas entre família/amigos.',
      en: 'Real-time collaborative lists, shared between family/friends.',
    },
    stack: ['Java 25', 'Spring Boot 4', 'React/Vite', 'PostgreSQL', 'WebSocket'],
    builtWith: 'Claude Code + Codex via BMAD',
    link: 'https://github.com/leoferolive/nossalista',
  },
  {
    id: 'nossagrana',
    type: 'pwa',
    name: 'nossagrana',
    description: {
      pt: 'Gestão de finanças familiares. PWA instalável, offline-first.',
      en: 'Family finance management. Installable PWA, offline-first.',
    },
    stack: ['Node/TS', 'React/Vite', 'PostgreSQL'],
    builtWith: 'Claude Code + Codex',
    link: 'https://github.com/leoferolive/nossagrana',
  },
  {
    id: 'homelab',
    type: 'infra',
    name: 'homelab',
    description: {
      pt: 'Tudo em um Raspberry Pi 4B (8GB). K3s, Traefik, Cloudflare Tunnel. OpenClaw + Telegram para administração remota — provisiono bancos, faço deploys e troubleshoot direto pelo chat.',
      en: 'Everything on a Raspberry Pi 4B (8GB). K3s, Traefik, Cloudflare Tunnel. OpenClaw + Telegram for remote admin — I provision databases, deploy, and troubleshoot from chat.',
    },
    stack: ['Raspberry Pi 4B', 'K3s', 'Traefik', 'Cloudflare Tunnel', 'OpenClaw', 'Tailscale'],
  },
] as const;
```

- [ ] **Step 2: ProjectCard**

```tsx
import type { ProjectEntry } from '@/data/projects';
import type { Lang } from '@/i18n/types';
import { ExternalLink } from './ExternalLink';
import { Folder } from 'lucide-react';

export function ProjectCard({ project, lang }: { project: ProjectEntry; lang: Lang }) {
  return (
    <article className="rounded border border-border bg-bg-surface p-5 transition-colors hover:border-border-hover hover:bg-bg-elevated">
      <header className="mb-2 flex items-center gap-2">
        <Folder size={16} strokeWidth={1.5} className="text-text-faint" />
        <span className="text-text-faint text-[11px] uppercase tracking-wider">
          {project.type}
        </span>
        <h3 className="font-bold text-text-primary">{project.name}</h3>
      </header>
      <p className="text-sm text-text-muted">{project.description[lang]}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded border border-border px-2 py-0.5 text-[11px] text-text-faint"
          >
            {s}
          </li>
        ))}
      </ul>
      {project.builtWith && (
        <p className="mt-2 text-[11px] text-text-faint">built with: {project.builtWith}</p>
      )}
      {project.link && (
        <ExternalLink href={project.link} className="mt-3 inline-block text-sm text-accent">
          {project.link.replace('https://', '')} →
        </ExternalLink>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Section**

```tsx
import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';

export function Projects() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="projects" className="py-16 md:py-24">
      <SectionHeader
        id="projects-title"
        caption={t.projects.caption}
        title={t.projects.title}
        subtitle={t.projects.subtitle}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} lang={lang} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Renderizar em `App.tsx`**, commit.

```bash
git add -A
git commit -m "feat(sections): add Projects (NossaLista, NossaGrana, Homelab)"
```

---

### Task 3.8: Stack section

**Files:** Create: `src/data/stack.ts`, `src/components/ui/StackGroup.tsx`, `src/components/sections/Stack.tsx`

- [ ] **Step 1: Data** (PRD §3-content.md §5 + adição `ChatGPT` em ai/)

```ts
export type StackGroupData = {
  id: string;
  name: string;
  items: readonly string[];
};

export const stack: readonly StackGroupData[] = [
  {
    id: 'ai',
    name: 'ai/',
    items: [
      'Spring AI',
      'Pgvector',
      'Azure OpenAI',
      'MCP',
      'Claude Code',
      'Cursor',
      'ChatGPT',
      'Codex',
      'BMAD',
      'RAG',
    ],
  },
  {
    id: 'backend',
    name: 'backend/',
    items: [
      'Java 8–25',
      'Spring Boot 4',
      'Microservices',
      'BFF',
      'Event-driven',
      'REST + SSE',
      'OIDC',
    ],
  },
  {
    id: 'data',
    name: 'data/',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL Server', 'Oracle', 'DB2', 'Kafka'],
  },
  {
    id: 'devops',
    name: 'devops/',
    items: [
      'AWS EKS',
      'Kubernetes',
      'K3s',
      'Helm',
      'Docker',
      'GitHub Actions',
      'Jenkins',
      'Cloudflare Tunnel',
      'Traefik',
    ],
  },
] as const;
```

- [ ] **Step 2: StackGroup**

```tsx
import type { StackGroupData } from '@/data/stack';

export function StackGroup({ group }: { group: StackGroupData }) {
  return (
    <div>
      <h3 className="font-bold text-accent">{group.name}</h3>
      <ul className="mt-2 space-y-0.5 text-sm">
        {group.items.map((item, i) => {
          const last = i === group.items.length - 1;
          return (
            <li key={item} className="text-text-muted hover:text-text-primary transition-colors">
              <span className="text-text-faint">{last ? '└── ' : '├── '}</span>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Section**

```tsx
import { useT } from '@/i18n/useT';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StackGroup } from '@/components/ui/StackGroup';
import { stack } from '@/data/stack';

export function Stack() {
  const t = useT();
  return (
    <section id="stack" className="py-16 md:py-24">
      <SectionHeader
        id="stack-title"
        caption={t.stack.caption}
        title={t.stack.title}
        subtitle={t.stack.subtitle}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((g) => (
          <StackGroup key={g.id} group={g} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Renderizar em `App.tsx`**, commit.

```bash
git add -A
git commit -m "feat(sections): add Stack (4 groups, ai/ includes ChatGPT)"
```

---

### Task 3.9: Contact section + CopyButton + Footer

**Files:**
- Create: `src/hooks/useCopyToClipboard.ts` (+ test)
- Create: `src/components/ui/CopyButton.tsx`
- Create: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Hook + test**

`src/hooks/useCopyToClipboard.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';

describe('useCopyToClipboard', () => {
  it('copia para clipboard e seta copied true por 2s', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => { await result.current.copy('hi'); });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hi');
    expect(result.current.copied).toBe(true);

    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(result.current.copied).toBe(false);
    vi.useRealTimers();
  });
});
```

`src/hooks/useCopyToClipboard.ts`:
```ts
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}
```

- [ ] **Step 2: CopyButton**

```tsx
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type Props = { value: string; ariaLabel: string; copiedLabel: string };

export function CopyButton({ value, ariaLabel, copiedLabel }: Props) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs hover:border-border-hover min-h-[44px]"
      onClick={() => copy(value)}
    >
      {copied ? (
        <>
          <Check size={14} strokeWidth={1.5} className="text-ok" aria-hidden="true" />
          <span aria-live="polite" className="text-ok">
            {copiedLabel}
          </span>
        </>
      ) : (
        <>
          <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>copy</span>
        </>
      )}
    </button>
  );
}
```

- [ ] **Step 3: Contact section**

```tsx
import { useT } from '@/i18n/useT';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PromptLine } from '@/components/ui/PromptLine';
import { CopyButton } from '@/components/ui/CopyButton';
import { ExternalLink } from '@/components/ui/ExternalLink';

const EMAIL = 'leoferolive@gmail.com';
const GITHUB_URL = 'https://github.com/leoferolive';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leonardo-fer-oliveira/';

export function Contact() {
  const t = useT();
  const k = t.contact.keys;
  const v = t.contact.values;

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-20 shrink-0 text-text-faint">{label}</dt>
      <dd className="text-text-primary">{children}</dd>
    </div>
  );

  return (
    <section id="contact" className="py-16 md:py-24">
      <SectionHeader
        id="contact-title"
        caption={t.contact.caption}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
      />
      <PromptLine command={t.contact.promptCommand.replace(/^\$ /, '')} />
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={k.email}>
          <span className="mr-2">
            <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">
              {EMAIL}
            </a>
          </span>
          <CopyButton value={EMAIL} ariaLabel={t.contact.copyEmailAria} copiedLabel={t.contact.copiedFeedback} />
        </Row>
        <Row label={k.github}>
          <ExternalLink href={GITHUB_URL} className="text-accent hover:underline">
            github.com/leoferolive
          </ExternalLink>
        </Row>
        <Row label={k.linkedin}>
          <ExternalLink href={LINKEDIN_URL} className="text-accent hover:underline">
            /in/leonardo-fer-oliveira
          </ExternalLink>
        </Row>
        <Row label={k.location}>{v.location}</Row>
        <Row label={k.education}>{v.education}</Row>
        <Row label={k.languages}>{v.languages}</Row>
      </dl>

      <footer className="mt-12 border-t border-border pt-6">
        <PromptLine command={t.contact.footerExit.replace(/^~ \$ /, '')} />
        <p className="mt-3 whitespace-pre-line text-sm text-text-faint">
          {t.contact.footerNote}
        </p>
      </footer>
    </section>
  );
}
```

- [ ] **Step 4: Renderizar em `App.tsx`**. Run all tests. Commit.

```bash
git add -A
git commit -m "feat(sections): add Contact + CopyButton + footer"
```

---

# PHASE 4 — SEO + perf

---

### Task 4.1: Meta head per language (title/description/canonical/hreflang)

**Files:** Create: `src/seo/Head.tsx`. Modify: `src/App.tsx`

- [ ] **Step 1: Head component**

```tsx
import { useEffect } from 'react';
import { useI18n } from '@/i18n/context';

const SITE_URL = 'https://leoferolive.com.br';

function setOrCreate(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

export function Head() {
  const { lang, t } = useI18n();
  useEffect(() => {
    document.title = t.meta.title;
    setOrCreate('meta[name="description"]', { name: 'description', content: t.meta.description });
    const path = lang === 'pt' ? '/' : '/en';
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: `${SITE_URL}${path}` });
    setOrCreate('link[rel="alternate"][hreflang="pt-BR"]', {
      rel: 'alternate', hreflang: 'pt-BR', href: `${SITE_URL}/`,
    });
    setOrCreate('link[rel="alternate"][hreflang="en"]', {
      rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/en`,
    });
    setOrCreate('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/`,
    });
    const ogImage = lang === 'pt' ? '/og-image-pt.png' : '/og-image-en.png';
    setOrCreate('meta[property="og:title"]', { property: 'og:title', content: t.meta.title });
    setOrCreate('meta[property="og:description"]', { property: 'og:description', content: t.meta.description });
    setOrCreate('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}${ogImage}` });
    setOrCreate('meta[property="og:url"]', { property: 'og:url', content: `${SITE_URL}${path}` });
    setOrCreate('meta[property="og:locale"]', {
      property: 'og:locale', content: lang === 'pt' ? 'pt_BR' : 'en_US',
    });
  }, [lang, t]);
  return null;
}
```

- [ ] **Step 2: Renderizar `<Head />`** dentro do `<I18nProvider>` em App.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): per-route meta head with hreflang and OG"
```

---

### Task 4.2: JSON-LD Person

**Files:** Create: `src/seo/jsonld.ts`. Modify: `src/seo/Head.tsx`

- [ ] **Step 1: JSON-LD**

```ts
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Leonardo Fernandes Oliveira',
  jobTitle: 'Senior Software Engineer',
  url: 'https://leoferolive.com.br',
  sameAs: [
    'https://github.com/leoferolive',
    'https://www.linkedin.com/in/leonardo-fer-oliveira/',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Curitiba',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
};
```

- [ ] **Step 2: Injetar em `<Head />`**

No useEffect, adicionar:
```ts
let script = document.head.querySelector<HTMLScriptElement>('#jsonld-person');
if (!script) {
  script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'jsonld-person';
  document.head.appendChild(script);
}
script.textContent = JSON.stringify(personJsonLd);
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): inject JSON-LD Person schema"
```

---

### Task 4.3: robots.txt e sitemap.xml

**Files:** Create: `public/robots.txt`, `public/sitemap.xml`

- [ ] **Step 1: robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://leoferolive.com.br/sitemap.xml
```

- [ ] **Step 2: sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://leoferolive.com.br/</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://leoferolive.com.br/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://leoferolive.com.br/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leoferolive.com.br/" />
  </url>
  <url>
    <loc>https://leoferolive.com.br/en</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://leoferolive.com.br/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://leoferolive.com.br/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leoferolive.com.br/" />
  </url>
</urlset>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): add robots.txt and sitemap.xml"
```

---

### Task 4.4: Placeholder OG images

**Files:** Create: `public/og-image-pt.png`, `public/og-image-en.png`

- [ ] **Step 1: Geração inicial via script Node** (placeholder simples)

Usar uma das opções:
- **Opção rápida (manual):** abrir Figma/equiv., gerar 1200×630 dark com texto PT/EN, exportar.
- **Opção scriptada:** instalar `@vercel/og` ou `satori` e gerar via Node script no `scripts/gen-og.ts`. (Opcional — pode ficar manual no MVP.)

Para o MVP: salvar dois PNGs 1200×630 placeholder em `public/`. Validar que o arquivo existe e é referenciado pelo `<Head />`.

- [ ] **Step 2: Commit**

```bash
git add public/og-image-pt.png public/og-image-en.png
git commit -m "feat(seo): add OG image placeholders (PT and EN)"
```

---

### Task 4.5: Performance/bundle audit

**Files:** Modify: `package.json` (script analyze opcional)

- [ ] **Step 1: Build de produção e medir**

```bash
npm run build
npm run preview
```

- [ ] **Step 2: Lighthouse mobile + desktop em ambas as URLs**

```bash
# Em outra aba: chrome://inspect → DevTools → Lighthouse → mobile
# URLs: http://localhost:4173/ e http://localhost:4173/en
```

Verificar Performance/A11y/SEO/Best Practices ≥ 95.

- [ ] **Step 3: Bundle visualizer** (opcional)

```bash
npm install -D rollup-plugin-visualizer
```

Adicionar plugin em `vite.config.ts` (mode prod). Rodar build, abrir `dist/stats.html`.

Verificar bundle JS gz ≤ 80KB.

- [ ] **Step 4: Se algum target falhar, criar issue/task de follow-up.**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add bundle visualizer; document Lighthouse audit pass"
```

---

# PHASE 5 — Mobile + a11y polish

---

### Task 5.1: Touch target audit + manual mobile QA

**Verificações:**
- [ ] DevTools mobile (375px) — todos os botões/links com tamanho mínimo 44×44 (inspector mostra `min-height: 44px`).
- [ ] Toggle PT/EN clicável sem zoom.
- [ ] Trajetória: Wiley aberta, Ebix com chevron tocável; tap expande.
- [ ] Cards de cases não overflow horizontal.
- [ ] Status bar não cobre conteúdo no iPhone simulado (Safari iOS DevTools).

Se algo falhar: corrigir spacing/padding antes de commit.

- [ ] **Commit final do polish:**

```bash
git add -A
git commit -m "fix(mobile): touch target and overflow polish from QA"
```

---

### Task 5.2: prefers-reduced-motion sweep

**Verificações:**
- [ ] DevTools → Emulate → "prefers-reduced-motion: reduce".
- [ ] Hero: tagline aparece estática (sem typewriter), cursor não pisca.
- [ ] Trajetória mobile: chevron não anima rotação.
- [ ] Cards: sem fade-in.

Se algo escapar: ajustar CSS na `animations.css` ou guard JS no hook.

- [ ] **Commit:**

```bash
git add -A
git commit -m "fix(a11y): respect prefers-reduced-motion across animations"
```

---

### Task 5.3: A11y manual checklist

**Validações:**
- [ ] Tab navigation visita: skip link → toggle PT/EN → CTAs do hero → email/github/linkedin do contato → copy button.
- [ ] Skip link aparece no focus, esconde no blur.
- [ ] `aria-expanded` reflete estado real no acordeon de Ebix.
- [ ] `aria-live="polite"` no feedback do CopyButton anuncia em SR.
- [ ] Sem trap de foco.
- [ ] VoiceOver/NVDA lê na ordem visual (validar manualmente).

- [ ] **Commit final:**

```bash
git add -A
git commit -m "chore: a11y manual QA pass — keyboard nav, SR, focus order"
```

---

# Checkpoint final

Após todas as tasks:

- [ ] `npm run lint && npm run typecheck && npm run test:run` → tudo verde.
- [ ] `npm run build` → sem erros, dist gerado.
- [ ] `npm run preview` → site funcional em PT e EN, mobile e desktop.
- [ ] Commit final consolidado opcional: `chore: ready for deploy plan (P2)`.
- [ ] Push do branch para `origin/main`.

**Próximo passo:** Plano 2 — deploy infra (Dockerfile, nginx, Helm, GitHub Actions, Cloudflare). Será escrito após este plano executar e a build estar estável.

---

## Anexo — Mapeamento spec → tasks

| Spec | Task(s) |
|---|---|
| §2 — i18n no MVP | 2.1–2.6 |
| §3 — 7 seções | 3.1–3.9 |
| §4.1 — Hero (PT + EN com tagline ajustada) | 3.2 |
| §4.2 — Cases (5, incluindo SSE/Redis) | 3.3 |
| §4.3 — Trajetória (formato C, mobile collapsible Ebix) | 3.4–3.5 |
| §4.4 — Workflow (proof line) | 3.6 |
| §4.5 — Projetos | 3.7 |
| §4.6 — Stack (+ ChatGPT) | 3.8 |
| §4.7 — Contato (+education, languages, LinkedIn correto) | 3.9 |
| §5 — Arquitetura i18n (router, hreflang, sitemap, OG bilíngue) | 2.4, 4.1, 4.3, 4.4 |
| §6 — Mobile-first | 0.3 (breakpoints), 1.3 (status bar), 3.5 (Ebix), 5.1–5.2 |
| §8 — DoD adições | 4.5, 5.1, 5.2, 5.3 |

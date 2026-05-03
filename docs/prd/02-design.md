# 02 — Design

> Direção visual, tokens, tipografia, motion, chrome IDE/Terminal.
> **Carregar quando:** implementar componentes, ajustar visual, decidir animações.

---

## 1. Conceito

**Terminal/IDE vibe — refinado, não cliché.** Inspiração: Cursor, Zed, Warp, Ghostty, dashboards do Linear.

**Evitar:**
- Matrix-green-em-tudo.
- Fundo preto puro com fonte mono chapada.
- ASCII art exagerada.
- Cursor piscando em todos os lugares.

**Buscar:**
- Atmosfera de IDE moderna (chrome sutil, status bar discreta).
- Hierarquia tipográfica forte mesmo em mono.
- Detalhes que revelam intenção (kerning de prompts, alinhamento de cards como JSON).

---

## 2. Tokens de cor

```
bg-base       #0a0908   (near-black, leve warm)
bg-surface    #15110d
bg-elevated   #1f1813
border        #2a201a
border-hover  #3a2a1f
text-primary  #f4ede4   (warm off-white)
text-muted    #a89484
text-faint    #6b5d52
accent        #ff7a45   (warm orange)
accent-soft   #ff7a4520 (com alpha, p/ glows)
ok            #5fb56e   (badges "in production")
warn          #ffd166
err           #ff6b6b
```

**Regras de uso:**
- `bg-base` cobre o body. `bg-surface` em cards. `bg-elevated` em hover de cards e em chrome.
- `accent` é raro: hero CTA, links em foco, badges importantes. Não decorar com laranja.
- `ok` exclusivo para selo "in production" / "deployed".
- Validar contraste WCAG AA com Stark/Polypane antes de fechar.

---

## 3. Tipografia

### Família

- **Body/UI/Display:** `JetBrains Mono` (Google Fonts), self-hosted via `@fontsource/jetbrains-mono`.
- Mono em tudo (coerência IDE). Hierarquia por **peso e tamanho**, não por família.

### Pesos disponíveis

`200`, `400`, `500`, `700`, `800` — não importar pesos não usados.

### Escala

```
display-xl   72px / 80px / weight 800   (hero name)
display-lg   48px / 56px / weight 700
title        28px / 36px / weight 700
subtitle     18px / 28px / weight 500
body         15px / 24px / weight 400
small        13px / 20px / weight 400
caption      12px / 16px / weight 400 / letter-spacing 0.04em / uppercase
```

Mobile (≤480px): redimensionar `display-xl` para 44px.

### Microtipografia

- Tabular nums (`font-variant-numeric: tabular-nums`) em datas e métricas.
- Ligaduras de programação ativadas (`font-feature-settings: "calt", "liga"`) — JetBrains Mono usa por padrão.

---

## 4. Motion

### Princípios

- **CSS-only**. Sem framer-motion, sem GSAP.
- Animação tem propósito: revelar conteúdo, mostrar feedback, sinalizar estado.
- `prefers-reduced-motion: reduce` desliga typewriter e fades, mantém apenas feedback de interação (1 frame max).

### Catálogo

| Animação | Onde | Duração | Easing |
|---|---|---|---|
| Typewriter da tagline | Hero | ~30ms/char, 1 ciclo | linear |
| Cursor block piscando | Hero, prompts | 1s | step-end |
| Fade-in + translate-y(8px) | Seções (IntersectionObserver) | 600ms | cubic-bezier(.2,.7,.3,1) |
| Stagger entre filhos | Cards | delay 80ms entre eles | — |
| Hover glow no card | Cards de case/projeto | 200ms | ease-out |
| Underline animado | Links de texto | 250ms | ease-out |
| Copy email feedback | Botão de email | 2s revert | — |

**Não usar:** parallax, scroll-jacking, page-load spinners, tilt 3D.

---

## 5. Chrome IDE/Terminal

### Top bar (sticky, altura ~36px)

- Traffic lights estilizados (3 dots: `#ff5f57`, `#febc2e`, `#28c840`) — pequenos, ~10px, com `opacity 0.7`.
- Breadcrumb central: `~/leoferolive/portfolio` em `text-muted`.
- Lado direito: hint visual `⌘K` em pill `border` + `text-faint` (decorativo no MVP, sem ação).
- Border-bottom 1px `border`.
- Background: `bg-base` com `backdrop-blur-sm` se houver scroll.

### Status bar (fixa no fundo, altura ~28px)

- Fundo `bg-surface`, border-top `border`.
- Layout: `flex justify-between text-caption`.
- Esquerda: `git:(main)`, `✓ deployed`, `last commit: <relative time>`.
- Direita: `Curitiba/BR`, `UTC-3`, `LF`, `UTF-8`.
- Em mobile (<768px): esconder o lado direito, manter só git/status.
- Respeitar `safe-area-inset-bottom` em iOS.

### Prompts

Padrão para qualquer prompt simulado:
```
~ $ <comando>
```
- `~` em `text-faint`, `$` em `accent`, comando em `text-primary`.
- Espaçamento exato: `~`, espaço, `$`, espaço, comando.

---

## 6. Spatial composition

- Container max-width: `max-w-5xl` (1024px) centrado, `px-6` padrão, `px-8` em desktop.
- Espaçamento vertical entre seções: `py-24` desktop, `py-16` mobile.
- Cards de case/projeto: grid 2 colunas em desktop, 1 em mobile, `gap-6`.
- Hierarquia: cada seção começa com **caption** (ex.: `// production-ai-cases`), depois **title**, depois conteúdo.

---

## 7. Iconografia

- `lucide-react` apenas. Nunca emoji em UI.
- Tamanho padrão: `16px` em texto, `20px` em CTAs, `24px` em headers.
- Stroke width: `1.5` (consistência com vibe IDE).
- Ícones usados (importar individualmente):
  - `Github`, `Linkedin`, `Mail`, `Copy`, `Check`, `ExternalLink`, `Terminal`, `ArrowRight`, `Folder`, `FileCode`, `Box`.

---

## 8. Estados de foco

- `:focus-visible` com `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px`.
- Nunca remover outline sem substituir.
- Skip-link no topo: "Pular para conteúdo" (sr-only até foco).

# Performance Baseline — 2026-05-03

Captured at end of Plan 1 (site implementation), before Plan 2 (deploy infra).

## Bundle sizes (from `npm run build`)

```
dist/index.html                                                   0.43 kB │ gzip:  0.29 kB
dist/assets/jetbrains-mono-greek-400-normal-C190GLew.woff2        4.23 kB
dist/assets/jetbrains-mono-greek-800-normal-CHF5NZ22.woff2        4.27 kB
dist/assets/jetbrains-mono-greek-500-normal-JpySY46c.woff2        4.28 kB
dist/assets/jetbrains-mono-greek-700-normal-C6CZE3T8.woff2        4.30 kB
dist/assets/jetbrains-mono-cyrillic-800-normal-ByBGbHIv.woff2     5.22 kB
dist/assets/jetbrains-mono-vietnamese-800-normal-PNBZwIr4.woff    5.32 kB
dist/assets/jetbrains-mono-cyrillic-400-normal-BEIGL1Tu.woff2     5.33 kB
dist/assets/jetbrains-mono-cyrillic-700-normal-BWTpRfYl.woff2     5.34 kB
dist/assets/jetbrains-mono-cyrillic-500-normal-DmUKJPL_.woff2     5.36 kB
dist/assets/jetbrains-mono-vietnamese-400-normal-CqNFfHCs.woff    5.37 kB
dist/assets/jetbrains-mono-vietnamese-700-normal-BDLVIk2r.woff    5.45 kB
dist/assets/jetbrains-mono-vietnamese-500-normal-DNRqzVM1.woff    5.48 kB
dist/assets/jetbrains-mono-greek-800-normal-kI_3BVxX.woff         5.60 kB
dist/assets/jetbrains-mono-greek-400-normal-B9oWc5Lo.woff         5.66 kB
dist/assets/jetbrains-mono-greek-700-normal-DEigVDxa.woff         5.70 kB
dist/assets/jetbrains-mono-greek-500-normal-D7SFKleX.woff         5.72 kB
dist/assets/jetbrains-mono-cyrillic-800-normal-B6A7wovd.woff      6.83 kB
dist/assets/jetbrains-mono-cyrillic-400-normal-ugxPyKxw.woff      6.98 kB
dist/assets/jetbrains-mono-cyrillic-700-normal-CEoEElIJ.woff      7.02 kB
dist/assets/jetbrains-mono-cyrillic-500-normal-DJqRU3vO.woff      7.02 kB
dist/assets/jetbrains-mono-latin-ext-800-normal-M9NLV9AA.woff2    7.28 kB
dist/assets/jetbrains-mono-latin-ext-400-normal-Bc8Ftmh3.woff2    7.34 kB
dist/assets/jetbrains-mono-latin-ext-700-normal-CZipNAKV.woff2    7.47 kB
dist/assets/jetbrains-mono-latin-ext-500-normal-Cut-4mMH.woff2    7.53 kB
dist/assets/jetbrains-mono-latin-ext-800-normal-BTI8MNNQ.woff    10.06 kB
dist/assets/jetbrains-mono-latin-ext-400-normal-fXTG6kC5.woff    10.13 kB
dist/assets/jetbrains-mono-latin-ext-700-normal-CxPITLHs.woff    10.30 kB
dist/assets/jetbrains-mono-latin-ext-500-normal-ckzbgY84.woff    10.34 kB
dist/assets/jetbrains-mono-latin-400-normal-V6pRDFza.woff2       21.17 kB
dist/assets/jetbrains-mono-latin-800-normal-D2mQHRMK.woff2       21.24 kB
dist/assets/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2       21.83 kB
dist/assets/jetbrains-mono-latin-700-normal-BYuf6tUa.woff2       21.91 kB
dist/assets/jetbrains-mono-latin-800-normal-Dj9qwObk.woff        27.39 kB
dist/assets/jetbrains-mono-latin-400-normal-6-qcROiO.woff        27.50 kB
dist/assets/jetbrains-mono-latin-500-normal-CJOVTJB7.woff        28.21 kB
dist/assets/jetbrains-mono-latin-700-normal-D3wTyLJW.woff        28.21 kB
dist/assets/index-GhXsSJpu.css                                   63.59 kB │ gzip: 31.48 kB
dist/assets/index-CJFT3V7n.js                                   198.60 kB │ gzip: 64.15 kB
✓ built in 2.01s
```

## Targets vs actuals

| Target | Source | Actual | Status |
|---|---|---|---|
| JS bundle gz ≤ 80 KB | spec §2.1 / DoD §3.2 | 64.15 kB | ✓ within target (15.85 kB headroom) |
| CSS bundle gz ≤ 15 KB | spec §2.1 (Tailwind purgado) | 31.48 kB | above target — by 16.48 kB |
| Build time | (informational) | 2.01s | n/a |

## Lighthouse (local preview)

> Local Lighthouse run not part of this audit (would require headed browser env). To be done manually before go-live: `npm run build && npm run preview` then open `http://localhost:4173/` in Chrome → DevTools → Lighthouse → mobile + desktop, both `/` and `/en`. Confirm Performance/A11y/SEO/Best Practices ≥ 95.

## Follow-ups

- [ ] CSS bundle (31.48 kB gz) exceeds the 15 kB target by 16.48 kB. The overage is driven by Tailwind's base/reset styles plus the `@fontsource/jetbrains-mono` CSS being bundled in the single chunk. Investigate: (1) split font CSS from component CSS via Vite manualChunks, (2) subset JetBrains Mono to latin-only via `@fontsource-variable/jetbrains-mono`, (3) confirm that Tailwind's `content` glob is correctly excluding unused utilities — run `npx tailwindcss --minify` standalone to see purged size. The JS target (64.15 kB gz) is met comfortably.
- [ ] If JS gz ever exceeds 80 KB, audit with `rollup-plugin-visualizer` and consider code splitting.
- [ ] Run real Lighthouse audit before go-live.

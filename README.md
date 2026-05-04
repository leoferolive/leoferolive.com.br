# leoferolive.com.br

Personal portfolio and career timeline for Leonardo Fernandes Oliveira. Static React SPA, deployed on a self-managed k3s cluster behind Cloudflare Tunnel.

Live: <https://leoferolive.com.br/>

## Tech stack

- React 18 + TypeScript
- Vite 6, Tailwind CSS v4
- i18n: PT/EN toggle (no external library — custom hook)
- Fonts: JetBrains Mono via `@fontsource`
- Testing: Vitest + Testing Library
- CI/CD: GitHub Actions → Docker → k3s (via `kubectl rollout`)

## Quick start

```bash
git clone https://github.com/leoferolive/leoferolive.com.br.git
cd leoferolive.com.br
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run lint
npm run typecheck
npm run test:run
```

## Project structure

```
src/
  components/      # UI components (Hero, Career, Skills, Contact, …)
  data/            # Static content (career.ts, skills.ts, …)
  hooks/           # useLanguage, useTypewriter, …
  i18n/            # Translation strings
  seo/             # OG image meta, structured data
  styles/          # Global CSS / Tailwind config
  tests/           # Component and hook tests
docs/
  deploy-guide/    # Step-by-step cluster + CD setup
  superpowers/     # Implementation specs and plans
  prd/             # Product requirements
k8s/               # Kubernetes manifests (Deployment, Service, Ingress)
scripts/           # Utility scripts (OG image generation)
public/            # Static assets served as-is
```

## Deploy

See `docs/deploy-guide/01-overview.md` for the full infrastructure walkthrough (k3s cluster, Cloudflare Tunnel, GitHub Actions CD pipeline).

## Specs and plans

Implementation plans and design specs live in `docs/superpowers/`. Each plan is a Markdown file prefixed with the creation date.

## OG image generation

```bash
npx playwright install chromium   # required once before first run
npm run og:generate
```

Generates Open Graph preview images for social sharing. Requires a local build (`npm run build`) first.

## License

Personal project. No open-source license — all rights reserved.

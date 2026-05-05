# Lighthouse Baseline — 2026-05-04

Live URL: <https://leoferolive.com.br/>
Tag deployed: v0.0.6
Tested via: lighthouse CLI 12.8.2, headless Google Chrome, against Cloudflare-served prod

## Scores

| URL | Device | Performance | A11y | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` | Mobile | 100 | 96 | 93 | 92 |
| `/` | Desktop | 100 | 96 | 93 | 92 |
| `/en` | Mobile | 96 | 96 | 93 | 92 |
| `/en` | Desktop | 100 | 96 | 93 | 92 |

## Core Web Vitals (mobile, /)

| Metric | Value | Target | Status |
|---|---|---|---|
| LCP | 1.7s | < 2.5s | ✅ |
| CLS | 0.004 | < 0.1 | ✅ |
| TBT | 30ms | < 200ms | ✅ |
| FCP | 1.3s | < 1.8s | ✅ |

## Action items

### Best Practices — 93 (target: 95+)

- [ ] **errors-in-console**: Cloudflare Insights beacon script blocked by CSP (`Content-Security-Policy` rejects `static.cloudflareinsights.com` beacon). Fix: allow the Cloudflare beacon in CSP or suppress the report-only violation.
- [ ] **inspector-issues**: Chrome DevTools Issues panel has unresolved issues (likely related to the CSP console error above).

### SEO — 92 (target: 95+)

- [ ] **robots-txt** — 1 error found: `Content-Signal: search=yes,ai-train=no` on line 29 is flagged as an "Unknown directive" by Lighthouse. This is a non-standard (but intentional) directive for AI crawlers. Lighthouse treats it as malformed. Options:
  - Move AI-signal directives to a comment (prefixed with `#`) to pass validation while keeping intent visible.
  - Accept the lint warning since the directive is harmless to real crawlers.

### Accessibility — 96 (target: 95+) — PASSING but items to improve

- [ ] **color-contrast**: Some elements have insufficient contrast ratio — identified elements in header button span, a nav div, and a `<p>` in main section. Review and bump contrast ratios to meet WCAG AA (4.5:1 for text).
- [ ] **label-content-name-mismatch**: A `<button>` in the header has a visible text label that does not match its accessible name. Likely the mobile menu toggle — ensure `aria-label` matches visible text or remove the mismatch.

### Performance — `/en` mobile scored 96 vs 100 for others

- [ ] The `/en` mobile run scored 96 vs 100 for other combinations. Investigate whether this is a network jitter artifact or a real difference (e.g., extra resources loaded only on `/en`). Re-run a second time to confirm.

## Reproduce

```bash
export CHROME_PATH=/usr/bin/google-chrome

# PT mobile
npx lighthouse@12 https://leoferolive.com.br/ \
  --output=json --output-path=/tmp/lh-pt-mobile.json \
  --form-factor=mobile --screenEmulation.disabled \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --quiet --only-categories=performance,accessibility,best-practices,seo

# PT desktop
npx lighthouse@12 https://leoferolive.com.br/ \
  --output=json --output-path=/tmp/lh-pt-desktop.json \
  --preset=desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --quiet --only-categories=performance,accessibility,best-practices,seo

# EN mobile
npx lighthouse@12 https://leoferolive.com.br/en \
  --output=json --output-path=/tmp/lh-en-mobile.json \
  --form-factor=mobile --screenEmulation.disabled \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --quiet --only-categories=performance,accessibility,best-practices,seo

# EN desktop
npx lighthouse@12 https://leoferolive.com.br/en \
  --output=json --output-path=/tmp/lh-en-desktop.json \
  --preset=desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --quiet --only-categories=performance,accessibility,best-practices,seo
```

Or via CI: run `.github/workflows/lighthouse.yml` with `gh workflow run lighthouse.yml`.

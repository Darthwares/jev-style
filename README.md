# jev-style

The design system, shared components and page templates behind [dotmap.ai](https://dotmap.ai), [jeval.dev](https://jeval.dev) and [jextract.com](https://jextract.com). Charcoal surfaces, hairline grids, monospace uppercase labels, one electric-blue accent, and probability-first data display. Built for Next.js 16 (App Router, Turbopack), React 19, Tailwind 4 and shadcn's `base-nova` style on `@base-ui/react`.

If you are a coding agent: read `AGENTS.md` first. It is the contract for building a new site in this style.

## What is here

| Path | What it is |
|---|---|
| `tokens/globals.css` | The whole theme: colour tokens (light and dark), `--accent-blue`, `--grid`, `--surface`, the `mono-label`, `hairline` and `display` utilities, Tailwind 4 `@theme` mapping, shadcn base variables. Copy it as `src/app/globals.css`. |
| `components/ui/` | The shadcn `base-nova` primitives the sites use (button, input, textarea, select, sheet, tabs, tooltip, badge, separator, scroll-area, sonner). Copy into `src/components/ui/`. |
| `components/shared/` | `primitives.tsx` (MonoLabel, Cell, Meter, Histogram, Crosshair), `theme-toggle.tsx`, `site-links.tsx` (the sister-site pills with hover cards), `utils.ts` (`cn`), `format.ts` (usd, tokens, duration, multipliers, score colours). |
| `components/patterns/` | Larger patterns proven on the sites: `docs-shell.tsx` (docs page chrome, Section, Bullets, Faq, JsonLd), `explainer.tsx` (frame-by-frame "hyperframes" explainer with play/scrub), `jev-call-card.tsx` (a Jev request and response, options and probabilities), `dot-matrix.tsx` (one dot per unit of work), `stage-strip.tsx` (pipeline stage timings). |
| `template/` | A runnable Next.js skeleton: landing page, app shell with sidebar, docs shell, OG image, sitemap, robots. `template/README.md` explains how to start from it. |
| `docs/` | The written system: `design.md` (principles, layout grammar, typography, colour, motion), `copy.md` (voice and label conventions), `data-display.md` (how to show probabilities, scores, costs and timings), `components.md` (API of every shared component), `recipes.md` (landing, dashboard, docs page, shareable report, OG card). |

## Quick start

```bash
npx create-next-app@latest my-site --ts --tailwind --app --src-dir --import-alias "@/*" --no-eslint
cd my-site
pnpm add @base-ui/react class-variance-authority cn lucide-react next-themes sonner tw-animate-css
pnpm add -D tailwindcss@^4 @tailwindcss/postcss
# then copy from this repo:
cp -R ../jev-style/template/src/* src/
cp -R ../jev-style/components/ui src/components/ui
cp -R ../jev-style/components/shared src/components/shared
cp ../jev-style/tokens/globals.css src/app/globals.css
cp ../jev-style/template/components.json ../jev-style/template/postcss.config.mjs .
```

Or point a coding agent at this repository and say "build X in the jev-style". `AGENTS.md` tells it exactly what to copy and what the rules are.

## The five rules

1. **One accent.** Electric blue (`--accent-blue`) means "the thing Jev decided" or the primary action. Everything else is greyscale. Green, amber and red are reserved for pass, warning and fail.
2. **Hairlines, not cards.** Sections are separated by 1px `hairline` borders on a grid; nothing floats, nothing has a drop shadow except hover cards.
3. **Labels are mono, uppercase, small.** Every section starts with a `mono-label` such as `evaluators // 60 total`. Headings use `.display` (tight, medium weight). Body is Geist Sans.
4. **Show the distribution, not just the verdict.** A score is a number with a bar; a probability is a bar per option; a cost is shown live while work runs.
5. **Every page stands alone for SEO.** Title, description, canonical, Open Graph image and JSON-LD on every public page; a sitemap that lists them.

## Sites built with it

- dotmap.ai: site-wide SEO + AEO audit (crawler, dot matrix, shareable reports)
- jeval.dev: universal evaluator API (playground, console, benchmark, 60 evaluator pages)
- jextract.com: taxonomy-driven PDF extraction (page highlighter, Jev calls, architecture explainer)

MIT.

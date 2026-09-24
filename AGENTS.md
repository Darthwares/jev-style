# AGENTS.md — building a site in the jev-style

You are a coding agent asked to build or extend a web app "in the jev-style". This file is the contract. Follow it exactly; the design decisions have been made and tested on three production sites (dotmap.ai, jeval.dev, jextract.com).

## 0. What the style is, in one paragraph

A developer-console aesthetic: near-black charcoal (`#1E1E1E`) in dark mode, warm off-white in light mode, everything laid out on a 1px hairline grid, small monospace uppercase labels above every block, large tight sans headings, one electric-blue accent that marks decisions and primary actions, and green/amber/red reserved for pass/warn/fail. Data is shown as distributions (bars per option, meters per score) rather than single verdicts, and costs and timings are shown live while work runs. Illustrations are thin monoline line-art on the charcoal background, blended so they work in both themes.

## 1. Stack (do not substitute)

- Next.js 16 App Router with Turbopack, React 19, TypeScript strict. `params` and `searchParams` are Promises.
- Tailwind CSS 4 (`@import "tailwindcss"` and `@theme inline` in `globals.css`; no `tailwind.config`).
- shadcn `base-nova` style on `@base-ui/react` (not Radix). Add components with `pnpm dlx shadcn@latest add <name>` only if they are not already in `components/ui/`.
- `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`.
- `lucide-react` icons, `sonner` toasts, `cn` from `lib/utils.ts`.
- Fonts: Geist Sans as `--font-sans` and Geist Mono as `--font-geist-mono` via `next/font/google`. The variable **must** be named `--font-sans`, otherwise base-nova falls back to a serif.
- pnpm. Lint with `pnpm run lint` (eslint 9, `eslint-config-next`). Never open a PR with lint errors.

## 2. Files to copy from this repo into a new project

```
tokens/globals.css                 → src/app/globals.css
components/ui/*                    → src/components/ui/
components/shared/*                → src/components/shared/   (primitives, theme-toggle, site-links)
lib/utils.ts, lib/format.ts        → src/lib/
components/patterns/*              → src/components/patterns/ (only the ones you need)
template/src/app/*                 → src/app/                 (layout, landing, app shell, og image, sitemap, robots)
template/components.json, postcss.config.mjs, eslint.config.mjs, tsconfig.json → project root
```

Import aliases assume `@/components/...` and `@/lib/...`. Keep them.

## 3. Layout grammar

- **Page frame.** Full-bleed sections stacked vertically, each separated by `border-b hairline`. No max-width container on app pages; docs pages use `mx-auto max-w-6xl px-4 sm:px-6`.
- **Two-column hero.** `grid lg:grid-cols-[minmax(0,52%)_minmax(0,1fr)] lg:divide-x` with copy on the left (`p-6 sm:p-10 lg:p-14`) and an illustration or live panel on the right (`bg-surface/60`).
- **Stat strip.** `grid divide-y hairline sm:grid-cols-2 sm:divide-x lg:grid-cols-4`, each cell `Cell` with a `MonoLabel`, a big `font-mono text-4xl tabular-nums` number, and a normal-case mono sub-line.
- **Grids of items.** `grid gap-px border hairline bg-grid sm:grid-cols-2 lg:grid-cols-3` with each item `bg-background p-4`. The `gap-px` over `bg-grid` draws the hairlines between items.
- **App shell.** Sticky left sidebar `w-60` (`bg-sidebar`, nav items with 16px lucide icons, counts right-aligned in mono, a bottom block with model/price/status/theme), a top header with a mono status line, a `<main>` that stacks sections, and a footer with two mono labels. Hide the sidebar under `lg` and show a mono nav in the header.
- **Docs shell.** Sticky translucent header (`bg-background/85 backdrop-blur`) with logo, breadcrumb in mono, right-side mono nav and a primary "Open app" button.
- **Detail sheets.** Right-side `Sheet` with `w-full ... data-[side=right]:sm:max-w-2xl` (the `data-[side=right]:` prefix is required to override base-nova's width).
- **Tables.** `min-w-[720px]` inside `overflow-x-auto`, header cells are `MonoLabel`, rows `border-b hairline hover:bg-surface/70`, first cell `pl-5 sm:pl-6`.
- **Mobile.** Every grid collapses to one column; `min-w-0` on grid children that contain `<pre>` or long mono text; check `document.documentElement.scrollWidth <= innerWidth` at 390px.

## 4. Typography and labels

- `MonoLabel` / `.mono-label`: `font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground`. Every section opens with one, written like a path: `evaluators // 60 total`, `state + questions // structured output`, `how it works // frame by frame`. Add `className="text-foreground"` for the emphasised variant and `normal-case tracking-normal` for sub-lines with real sentences.
- Headings: `.display` (`tracking-tight leading-[0.98] font-medium`). Hero `text-5xl sm:text-6xl lg:text-7xl`, section `text-3xl sm:text-4xl`, card `text-2xl`. Headings are short declaratives: "Audit a whole site.", "Every evaluator. One call.", "Documents to data. Two calls."
- Body: `text-sm text-muted-foreground` (`sm:text-base` in heroes). Sentences, not fragments; no exclamation marks; numbers in the prose only when they are the point.
- Code and ids: `font-mono text-xs` (or `text-[13px]` for ids in tables).
- Never use `**bold**` for emphasis in body copy; use `text-foreground` on a span.

## 5. Colour

- Backgrounds: `bg-background`, panels `bg-surface/60`, sidebar `bg-sidebar`. Dark background is `#1E1E1E`; light is `oklch(0.985 0 0)`.
- Borders: always `hairline` (`border-color: var(--grid)`, 8% white in dark, 8% black in light). Never `border-gray-*`.
- Accent: `text-accent-blue`, `bg-accent-blue`, `border-accent-blue/50`, tints `bg-accent-blue/[0.06]`. Use it for: the chosen option, the primary CTA, active filters, the "Jev" tag, progress fills. Do not use it decoratively.
- Semantic: `emerald-500` pass/found, `amber-500` warning/low confidence, `red-500` fail/absent. Family or category tags may use one hue each (violet, sky, orange, rose) at `/40` border and `600/300` text.
- Score colouring (`scoreColor` in `lib/format.ts`): ≥85 emerald, ≥70 lime, ≥55 amber, ≥40 orange, else red.

## 6. Data display (this is the heart of the style)

- **A probability is a bar.** `relative h-1 rounded-full bg-grid` with an absolute `bg-accent-blue` fill at `width: p%`, and the percentage in `font-mono text-xs tabular-nums` to the right. Lists of options show one bar each; the winner is blue, the rest `bg-muted-foreground/40`.
- **A score is a Meter.** `Meter` from primitives: label left, thin bar, value right. `tone="score"` colours by grade, `tone="blue"` for neutral progress.
- **A distribution over ordered levels is a Histogram.** `Histogram values={[…]} highlight={i}`.
- **Work in progress is a dot matrix.** One dot per unit (page, chunk, item): outline = queued, dim = fetched, blue = judged. Cap at ~300 dots and shrink them as the count grows.
- **Stages are a strip.** Equal cells, each with `n · name`, a big `font-mono text-2xl` time, a status dot (blue pulsing = running, emerald = done) and a mono sub-line.
- **Cost is live.** Show `$0.00040`-style values with `formatUsd` (5 decimals under a cent), tokens with `formatTokens`, durations with `formatDuration`. Show them updating while streaming.
- **The exact model call is inspectable.** Use `JevCallCard`: request state (collapsible), questions with their options, answers with a probability per option.
- **Frame-by-frame explainers** for anything procedural: `Explainer` with a small spec, auto-playing, scrubbable, with the frame label in the header.

## 7. Copy voice

Plain, technical, confident, no marketing adjectives. Say what it does and what it costs. "About 300 ms and $0.0004 for a one-page invoice." Caveats are stated where the claim is made ("estimate, at list price", "calibrated probabilities, not measurements"). Link the sister sites with `SiteLinks` as a visually separate group, never inside the primary nav.

## 8. SEO and sharing (every public page)

- `export const metadata` with `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.
- JSON-LD via `<script type="application/ld+json">` (`SoftwareApplication` + `FAQPage` on landings, `TechArticle` + `FAQPage` + `BreadcrumbList` on docs pages, `ItemList` on indexes).
- `opengraph-image.tsx` with `ImageResponse`. Satori rules: every multi-child `div` needs `display: flex`; build text with template strings; no CSS grid.
- `sitemap.ts` and `robots.ts` listing every static page; shared or user-generated pages are `robots: { index: false }`.

## 9. Behaviour rules that have bitten us

- `react-hooks/set-state-in-effect`: never call setState inside `useEffect` to derive state; use callbacks, `useSyncExternalStore` for localStorage, or compute during render.
- `react-hooks/purity`: `useState(() => Date.now())`, never `useState(Date.now())`.
- Use `next/link` for internal links (lint rule `no-html-link-for-pages`); plain `<a>` only for external.
- Don't put `crossorigin` on media; don't use `Math.random()` for anything rendered on the server.
- When testing in a browser, use a fresh `browser.newContext()`; never emulate viewport on the user's own tab.
- Streaming APIs use `text/event-stream` with `event:` + `data:` frames and are consumed with `fetch` + `ReadableStream` (not `EventSource`, which cannot POST).

## 10. Definition of done

`pnpm exec tsc --noEmit` clean, `pnpm run lint` clean, no console errors in a fresh browser context, no horizontal overflow at 390px and 1440px, dark and light both checked, every public page has metadata + JSON-LD, and the page reads like the sister sites: a mono label, a display heading, a sentence of body copy, then data.

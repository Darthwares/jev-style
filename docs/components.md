# Components

All components are TypeScript + Tailwind 4 and import `cn` from `@/lib/utils`. Client components are marked `"use client"`.

## shared/primitives.tsx

| Component | Props | Use |
|---|---|---|
| `MonoLabel` | `span` props | Small uppercase mono caption. Opens every section. Add `text-foreground` to emphasise, `normal-case tracking-normal` for sentence sub-lines. |
| `Cell` | `div` props | Hairline-bordered grid cell, `p-5 sm:p-6`, column flex with `gap-3`. Use inside stat strips. |
| `Meter` | `label, value, max=100, display?, tone: "score" \| "neutral" \| "blue", fillClassName?, valueClassName?` | Thin slider-style meter: label left, bar, value right. `tone="score"` colours by grade. |
| `Histogram` | `values: number[], highlight?: number` | Tiny bar histogram for a distribution over ordered levels; `highlight` is the argmax. |
| `Crosshair` | `className?` | Decorative reticle used in the top-right of live panels. |

## shared/theme-toggle.tsx

`ThemeToggle` — sun/moon button wired to `next-themes`. Place it at the far right of headers and in the sidebar footer.

## shared/site-links.tsx

`SiteLinks({ current, side = "bottom", align = "end", compact?, className? })` — the sister-site pills (dashed border, mono uppercase, 2×2 dot mark) with a hover card (hero image, tagline, three facts, host). Always visually separated from the primary nav by a hairline divider. Edit the `SITES` table when a site changes; keep copies in sync across repos.

## patterns/docs-shell.tsx

- `DocsShell({ crumbs: {href?, label}[], children })` — sticky translucent header with logo, mono breadcrumb, mono nav, "Open app" button and theme toggle; `main` is `mx-auto max-w-6xl`; footer with back link.
- `Section({ label, title?, children, className? })` — `border-b hairline py-8 sm:py-10`, mono label then `.display` h2.
- `Bullets({ items, tone: "good" \| "bad" \| "neutral" })` — dot bullets (emerald/red/grey).
- `Faq({ items: {q, a}[] })` — two-column definition list over `bg-grid`.
- `JsonLd({ data })` — inline `application/ld+json`.

## patterns/explainer.tsx

`Explainer({ spec, autoplay = true })` — the frame-by-frame "hyperframes" explainer: header with `frame n/N · label`, restart and play/pause, a body that renders the spec kind, and a scrubbable progress strip. Spec kinds:

- `rubric` — state box, question, ordered levels with probability bars, expected score and pass/fail.
- `boolean` — state, question, p(yes) gauge with the 0.5 threshold line.
- `choice` — state, question, options with probability bars, chosen option → score.
- `chunks` — one question per chunk, per-chunk verdicts, aggregate.
- `sequence` — expected vs actual steps with per-step probability.
- `toolcalls` — expected vs actual calls with per-call probability.
- `deterministic` — two inputs, numbered steps, result, "runs in code · $0".

Write a spec per concept you want to explain; the component handles the frames.

## patterns/jev-call-card.tsx

`JevCallCard({ call, title?, labels?, compact? })` — one model request and its answers. Collapsible `request.state`, then one row per question: field label + type/option count, the winning option (key in blue, description clamped to two lines), a probability bar, and an expander with the full question text, the options offered and the ranked probabilities. `labels` maps question keys to display names.

## patterns/dot-matrix.tsx

`DotMatrix({ total, states: ("queued"|"fetched"|"done")[], title?, status, tone?(i) })` — one dot per unit of work with a legend. Give it `h-full` inside a `bg-surface/60` panel next to the form.

## patterns/stage-strip.tsx

`StageStrip({ stages: {id,label,sub,ms?,skipped?}[], activeId?, elapsedMs? })` — pipeline stage cells with live timing for the running stage.

## lib/format.ts

`formatUsd` (5 decimals under a cent), `formatTokens` (1.2k, 3.4M), `formatDuration` (ms, s, m s), `formatX` (multipliers), `scoreColor(0–100)`, `scoreBg(0–100)`.

## ui/

shadcn `base-nova` primitives: `badge`, `button`, `input`, `textarea`, `select`, `sheet`, `tabs`, `tooltip`, `separator`, `scroll-area`, `sonner`. Add others with the shadcn CLI; do not restyle them.

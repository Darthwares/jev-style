# Recipes

Each recipe is the section order used on the live sites. Copy the order; adjust the words.

## Landing page (`/`)

1. **Header** (sticky, translucent): logo + wordmark left; primary nav as plain `text-sm text-muted-foreground` links; right side: `SiteLinks` (hidden below `md`), a mono pill secondary action, a primary button ("Open app →"), `ThemeToggle`.
2. **Hero**: two columns, `lg:grid-cols-[minmax(0,52%)_minmax(0,1fr)] lg:divide-x`. Left: mono label (`what it is // powered by …`), display h1 in two or three short lines, one paragraph with the measured numbers, a primary button and a mono-uppercase outline button. Right: `Illustration` (line-art PNG, blended) or a live panel.
3. **Numbers strip**: five `Cell`s: label, big blue mono number, sub-line. Real, measured numbers only.
4. **How it works**: two columns; text left, a `gap-px bg-grid` 3–4 step grid or an illustration right.
5. **Feature sections**: alternate illustration/text columns (`lg:[&>*:first-child]:order-2` on even rows).
6. **Catalogue or presets grid**: `gap-px bg-grid` cards linking into the app.
7. **FAQ**: `lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:divide-x`, heading left, `dl` right. The same FAQ array feeds the `FAQPage` JSON-LD.
8. **Closing CTA** and a **footer** with mono links; sister sites via `SiteLinks side="top" compact`.

Metadata: title in the form `name — what it does`, canonical `/`, OG image from `opengraph-image.tsx`, `SoftwareApplication` + `FAQPage` JSON-LD.

## App shell (`/app` or `/audit` or `/extract`)

- `force-dynamic` page that reads server config (API key presence, model, price) and renders a client `Shell`/`Dashboard`.
- Sidebar (`w-60`, hidden below `lg`): logo, nav items (icon, label, optional count), external links with `ArrowUpRightIcon`, a bottom block with `model`, `price`, `status` (green/amber dot) and `theme`.
- Header: mono status line left, connection status right, theme toggle on small screens.
- **Top section**: form left (`p-5 sm:p-8`: mono label, display h1, one sentence, inputs, primary action), live panel right (`bg-surface/60`: `DotMatrix` or `StageStrip`).
- **Stats strip** after a run: fields found / time / cost / comparison to the alternative.
- **Tabs** row (`fields · json · calls`) with export buttons on the right.
- **Results**: table left, detail or page viewer right (`lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:divide-x`).
- **The exact model calls** under a `calls` tab using `JevCallCard`.
- Footer with two mono labels and `SiteLinks`.

Streaming: the API returns `text/event-stream`; the client `fetch`es, reads the body stream, splits on `\n\n`, parses `data:` lines, and reduces events into state via a `useX` hook. Never derive state inside `useEffect`.

## Docs page (`/evaluators/[id]`, `/architecture`)

`DocsShell` → header block (tags row, display h1, summary paragraph, primary action + mono fact) → `Section`s: explainer (`Explainer`), verbatim question/request, when to use (three columns: reach for it / not the right tool / watch out for, with `Bullets`), inputs and example (request JSON in a hairline box with an "open in console" link), aggregate/related grids (`gap-px bg-grid`), `Faq`. Static params from the content module; `TechArticle` + `FAQPage` + `BreadcrumbList` JSON-LD; canonical per page.

## Shareable report (`/r/[id]`)

Store the finished result in Vercel Blob (`access: "private"`, 12-char id from a no-ambiguity alphabet). Page is `force-dynamic`, `robots: { index: false }`, has its own `opengraph-image.tsx` reading the stored data, a sticky header with "copy link" and "try your own", then the same stats + tabs + results as the app. Never store the user's source document, only the derived result.

## OG card (`opengraph-image.tsx`)

1200×630, `#1e1e1e`, `padding: 56`. Left column: small wordmark with a dot, a mono uppercase kicker in `#9a9a9a`, a two-line display title at 92px (`letterSpacing: -3`, sans), a 26px grey sub-line. Right: a 420–440px bordered panel listing a few rows (mono label, value, thin blue bar). Satori: every multi-child `div` needs `display: flex` (use a `D` wrapper), text with template strings, no grid.

## Explainer spec (for `Explainer`)

Pick the kind that matches the mechanism (rubric, boolean, choice, chunks, sequence, toolcalls, deterministic). Use real values from a real run where possible. Keep state fields to two or three short strings. The last frame always shows the result and its confidence or cost.

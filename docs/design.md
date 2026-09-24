# Design

## Principles

1. **Console, not brochure.** The reference is a developer console: dense, legible, honest about numbers. No hero gradients, no rounded cards floating on shadows, no stock imagery.
2. **One decision colour.** Electric blue marks what the model decided and what the user should do next. If two things are blue on one screen, one of them is wrong.
3. **Distributions over verdicts.** Wherever the system chose among options, show the probability of every option. A single number hides the model's uncertainty; a bar per option shows it.
4. **Cost and time are content.** Show tokens, dollars and milliseconds as first-class numbers, live while work runs, and compare them to the alternative in one line.
5. **Everything is a section.** Pages are vertical stacks of hairline-separated sections; each opens with a mono label, then a display heading, then a sentence, then data.

## Grid and spacing

- Hairline: 1px, `var(--grid)` (8% white on dark, 8% black on light). Use `border hairline`, `divide-y hairline`, or `gap-px bg-grid` for item grids.
- Section padding: `p-5 sm:p-6` for app sections, `p-6 sm:p-10 lg:p-14` for landing heroes, `py-8 sm:py-10` for docs sections.
- Gaps: `gap-3` inside cells, `gap-4`/`gap-6` between blocks, `gap-px` between grid items.
- Radius: none on sections and tables. Small (`rounded-md`) only on sidebar nav items; pills are square with 1px borders. Bars are `rounded-full`.

## Typography

- Sans: Geist. Mono: Geist Mono. Register the sans variable as `--font-sans`.
- Display headings: `.display` = tight tracking, `leading-[0.98]`, `font-medium`. Sizes: hero 5xl–7xl, section 3xl–4xl, card 2xl.
- Mono labels: 10px, uppercase, 0.12em tracking, muted. Normal-case variant for sub-lines.
- Body: 14px muted; 16–18px in heroes. Line length ≤ 70ch (`max-w-xl`/`max-w-3xl`).
- Numbers: `font-mono tabular-nums`. Big numbers 4xl in stat strips, 2xl in stage cells, xs in tables.

## Colour tokens (see tokens/globals.css)

| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | #1E1E1E | near white | page |
| `--surface` | slightly lighter | slightly darker | panels (`bg-surface/60`) |
| `--grid` | white 8% | black 8% | hairlines |
| `--accent-blue` | oklch(0.62 0.19 262) | oklch(0.56 0.21 262) | decisions, primary actions |
| emerald/lime/amber/orange/red 500 | — | — | pass → fail gradient |
| violet/sky/orange/rose | — | — | category tags at `/40` border |

Dark is the default theme; light must always work (illustrations are inverted with `invert mix-blend-multiply`).

## Illustrations

Thin monoline line-art, off-white strokes, one blue accent, on `#1E1E1E`, 1280×720. Blend with `mix-blend-screen` in dark and `invert mix-blend-multiply` in light so the background disappears. Generated with an image model from a prompt in this style; keep them abstract (documents, dots, grids, reticles), no text.

## Motion

- Transitions are 200–500 ms `transition-colors`/`transition-all`, never bouncy except the value-box reveal (`back.out`) in videos.
- Live panels update in place: dots change colour, counters tick, bars grow with `transition-[width]`.
- Frame-by-frame explainers advance every ~2.5 s and are scrubbable; users can pause.

## Accessibility

- Every icon-only button has `aria-label`. Hover cards use `aria-describedby` and also open on focus.
- Contrast: blue text on charcoal fails AA at small sizes; use blue for bars and pills, and `text-accent-blue` only at ≥ 11px mono uppercase or on emphasised elements. Body copy stays greyscale.
- Tables have real `<th>` headers; sheets have titles and descriptions.

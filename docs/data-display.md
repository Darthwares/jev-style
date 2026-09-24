# Data display

The style exists to show what a decision model returns: probabilities, scores, confidences, costs, timings. These are the patterns, with the exact classes used on the sites.

## Probability bar

```tsx
<div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2">
  <div className="flex flex-col gap-1">
    <span className="truncate font-mono text-[11px] text-foreground">{label}</span>
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-grid">
      <div className={cn("absolute inset-y-0 left-0 rounded-full", top ? "bg-accent-blue" : "bg-muted-foreground/40")} style={{ width: `${Math.round(p * 100)}%` }} />
    </div>
  </div>
  <span className="text-right font-mono text-xs tabular-nums">{Math.round(p * 100)}%</span>
</div>
```

Rank options by probability; only the top option is blue.

## Score with confidence

Big number `font-mono text-2xl tabular-nums` coloured by `scoreColor`, next to a pass/fail mono label (`● pass` emerald, `● fail` red), then a `Meter`. Show the distribution (`Histogram`) when the score came from ordered levels.

## Boolean

A single bar for p(yes) with a threshold tick at 50%, and two mono labels `no` / `yes` underneath. Say which side is "good" in the label (`refusal` vs `attempt`).

## Stat strip

Four or five `Cell`s: mono label, `font-mono text-4xl tabular-nums leading-none` value (blue when it is the headline metric), mono normal-case sub-line with the breakdown (`parse 3ms · locate 198ms · pick 132ms`).

## Live cost

While streaming, show `formatUsd(cost)` in blue at 4xl with `tokens · requests` beneath, and, when a projection exists, `· est $0.00x`. Update on every event.

## Comparison to the alternative

`11× cheaper` as the big value, with `est $0.0048 · 10.5s (25× slower) · gpt-4.1-class, list price` in the sub-line. Always label estimates as estimates.

## Tables

Header cells are `MonoLabel`s. First column: name in `text-sm` with `id · type` in mono beneath. Value column: `font-mono text-[13px]` with a normal-case mono `→ normalised` line under it when the normalised value differs. Confidence column: bar + percentage in a fixed `w-[160px]`. Status column: coloured dot + word.

## Detail panels

Below or beside a table: `selected field` label, the name, then "jev's choice over candidates" as ranked probability bars, then the source excerpt in a `pre` with `bg-surface/60 font-mono text-[11px]`.

## Page or document viewers

Render the page as an image inside a white bordered box; overlay absolutely positioned boxes computed as percentages of page size: dashed `border-accent-blue/40` for located regions, solid `border-accent-blue/70 bg-accent-blue/10` for values, a small blue label above the active one.

## Explainers

Use `Explainer` for anything with steps. Frames: inputs → the question → the distribution → the result. The header shows `frame n/N · label`; the strip is scrubbable.

## Model calls

`JevCallCard` for the exact request/response. Users trust the number more when they can see the question and the options.

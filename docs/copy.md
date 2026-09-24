# Copy

## Voice

Plain, technical, confident. Say what it does, how fast, what it costs, and what it does not do. No exclamation marks, no "powerful", "seamless", "unlock". Prefer a measured number to an adjective: "about 300 ms and $0.0004" beats "blazing fast and cheap".

## Mono labels

Lower-case, path-like, two or three segments separated by ` // ` or ` · `:

- `evaluators // 60 total`
- `document → taxonomy → data // two jev calls`
- `how it works // frame by frame`
- `jev calls // exactly what was sent and what came back`
- Sub-lines carry facts: `12 questions · 6 chunks in state · 5.2k tok · $0.00022 · 167ms`

## Headings

Short declaratives, often two lines, sometimes a fragment pair: "Audit a whole site.", "Every evaluator. One call.", "Documents to data. Two Jev calls.", "Spans, not generations.", "One field, end to end."

## Paragraphs

Two to four sentences. First sentence says what the thing is; last sentence gives the measured number or the caveat. Caveats live next to the claim: "an estimate, at list price", "calibrated probabilities from Jev, not measurements of actual citations".

## Buttons

Primary: sentence case with an arrow, "Open app →", "Extract a document →", "Run evaluation →". Secondary: mono uppercase outline, "HOW IT WORKS", "GET A FREE API KEY". Tertiary: mono label link, "or open the console →".

## Status words

`found`, `low confidence`, `absent`; `pass`, `fail`; `queued`, `crawled`, `scored`; `streaming`, `complete`, `failed`. Lower-case in mono labels.

## Numbers

`formatUsd` shows five decimals under a cent ($0.00042) so costs read as real numbers, not zero. Durations as `392 ms` or `1.6 s`. Tokens as `5.2k`. Multipliers as `11×`. Always say what the comparison is against.

## FAQ answers

Two to four sentences, answer first, then the nuance. They double as JSON-LD `FAQPage` entries and as the text an answer engine may quote, so each should stand alone.

## Sister sites

Refer to the family as "the Jev sites" in prose. Link them with `SiteLinks`, never as bare nav items, and describe each in one clause: dotmap "site-wide SEO + AEO audit", jeval "universal evaluator API", jextract "documents to data in two Jev calls".

@AGENTS.md

# Claude-specific notes

- Read `AGENTS.md` in full before writing any UI. It is short and every rule is load-bearing.
- Then read `docs/components.md` for the props of `MonoLabel`, `Cell`, `Meter`, `Histogram`, `Crosshair`, `SiteLinks`, `ThemeToggle`, `DocsShell`, `Explainer`, `JevCallCard`, `DotMatrix`, `StageStrip`, and `docs/recipes.md` for the page recipes (landing, app shell, docs page, shareable report, OG card).
- Start a new site from `template/` (see `template/README.md`). Do not rebuild the token file or the primitives from memory; copy them.
- Before finishing: `pnpm exec tsc --noEmit`, `pnpm run lint`, and a browser check at 1440px and 390px in a fresh context. Report what you verified.
- When the user has dev servers running, do not start new ones; if none is running, start one and say so.
- Keep the accent to one colour. If you find yourself reaching for a second accent, use greyscale hierarchy instead.

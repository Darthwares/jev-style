# template

A runnable Next.js 16 app in the jev-style: landing page (`/`), app shell with sidebar and a fake streaming run (`/app`), OG image, sitemap and robots. `src/components/{ui,shared,patterns}` and `src/lib` mirror the canonical copies at the repo root; `src/app/globals.css` mirrors `tokens/globals.css`.

```bash
cp -R template my-site && cd my-site
pnpm install
echo "TYPESAFE_API_KEY=..." > .env.local     # optional; the shell shows "no api key" without it
pnpm dev
```

Then: rename `SITE`, replace the copy in `src/components/site/landing.tsx`, add line-art PNGs under `public/img/`, replace the fake `run()` in `shell.tsx` with your streaming hook, and set `NEXT_PUBLIC_SITE_URL`. Remove `SiteLinks` if the site is not part of the Jev family, or add it to the `SITES` table in `site-links.tsx`.

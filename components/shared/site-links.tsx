"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Jev family: three sites that share one idea (decisions, not generation).
 * Shown as a visually separate group from a site's own navigation, with a
 * hover card explaining what each sister site does.
 */
export type SiteId = "dotmap" | "jeval" | "jextract" | "jtriage";

export const SITES: Record<SiteId, { name: string; host: string; url: string; tagline: string; body: string; facts: [string, string][]; image: string; imageAlt: string }> = {
  dotmap: {
    name: "dotmap",
    host: "dotmap.ai",
    url: "https://dotmap.ai",
    tagline: "Site-wide SEO + AEO audit",
    body: "Crawls every page of a site and has Jev judge each one on twelve SEO and answer-engine dimensions in a single call. Shareable report per site.",
    facts: [
      ["50 pages", "~3 s · ~$0.005"],
      ["per page", "7 scores + 5 probabilities, 1 call"],
      ["output", "score, grade, issues, citability"],
    ],
    image: "https://dotmap.ai/img/dotmap-hero.png",
    imageAlt: "Radar sweep over a constellation of dots",
  },
  jeval: {
    name: "jeval",
    host: "jeval.dev",
    url: "https://jeval.dev",
    tagline: "Universal evaluator API",
    body: "autoevals, RAGAS and UiPath evaluators as calibrated Jev judgments. A whole suite runs in one request, with a page explaining every evaluator.",
    facts: [
      ["evaluators", "43 · 33 answered by Jev"],
      ["9-evaluator suite", "~400 ms · $0.00005"],
      ["extras", "benchmark vs LLM judges, free API keys"],
    ],
    image: "https://jeval.dev/img/jeval-hero.png",
    imageAlt: "Probability bars over rubric levels",
  },
  jextract: {
    name: "jextract",
    host: "jextract.com",
    url: "https://jextract.com",
    tagline: "Documents to data, two Jev calls",
    body: "Point a taxonomy at a PDF. LiteParse parses locally, Jev locates each field's chunk and picks the exact span. Values come back with confidence and bounding boxes.",
    facts: [
      ["one-page invoice", "~400 ms · $0.0004"],
      ["jev calls", "2 per document (+1 to trim free text)"],
      ["output", "value, confidence, page, bbox"],
    ],
    image: "https://jextract.com/img/jextract-hero.png",
    imageAlt: "A document flowing into a grid of dots",
  },
  jtriage: {
    name: "jtriage",
    host: "jtriage.vercel.app",
    url: "https://jtriage.vercel.app",
    tagline: "Channel triage for Slack, Discord, Teams",
    body: "Reads 30 days of threads in a channel, has Jev judge each one as resolved or not and sort it into a bucket, then writes the open action items into a folder on your machine for a coding agent.",
    facts: [
      ["25 threads", "1.4 s · $0.0011 · 2 calls"],
      ["per thread", "status, bucket, severity, follow-up"],
      ["storage", "none: files go to your folder"],
    ],
    image: "https://jtriage.vercel.app/img/jtriage-hero.png",
    imageAlt: "Threads as tiles, one still blue",
  },
};

const ORDER: SiteId[] = ["dotmap", "jeval", "jextract", "jtriage"];

function Dots({ id }: { id: SiteId }) {
  // Each site's mark: round dots for dotmap and jeval, square tiles for jextract; one tile is always blue.
  const shape = id === "jextract" || id === "jtriage" ? "rounded-[1.5px]" : "rounded-full";
  return (
    <span className="grid size-3 shrink-0 grid-cols-2 gap-[2px]" aria-hidden>
      <span className={cn(shape, "bg-current")} />
      <span className={cn(shape, "bg-current opacity-40")} />
      <span className={cn(shape, "bg-current opacity-40")} />
      <span className={cn(shape, "bg-accent-blue")} />
    </span>
  );
}

export function SiteLinks({ current, side = "bottom", align = "end", className, compact }: { current: SiteId; side?: "bottom" | "top"; align?: "start" | "end"; className?: string; compact?: boolean }) {
  const others = ORDER.filter((s) => s !== current);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {!compact && <span className="mono-label hidden text-muted-foreground/70 lg:inline">also on jev</span>}
      <div className="flex flex-wrap items-center gap-1 border-l hairline pl-3">
        {others.map((id) => {
          const s = SITES[id];
          return (
            <div key={id} className="group relative">
              <a
                href={s.url}
                className="flex h-7 items-center gap-1.5 border border-dashed hairline px-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent-blue/60 hover:text-foreground focus-visible:border-accent-blue/60 focus-visible:text-foreground focus-visible:outline-none"
                aria-describedby={`site-card-${current}-${id}`}
              >
                <Dots id={id} />
                {s.name}
                <ArrowUpRightIcon className="size-3 opacity-60" />
              </a>
              <div
                id={`site-card-${current}-${id}`}
                role="tooltip"
                className={cn(
                  "invisible pointer-events-none absolute z-50 w-[min(340px,calc(100vw-32px))] border hairline bg-background shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] opacity-0 transition-all duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100",
                  side === "bottom" ? "top-[calc(100%+8px)] translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0" : "bottom-[calc(100%+8px)] -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0",
                  align === "end" ? "right-0" : "left-0",
                )}
              >
                <div className="relative flex h-[120px] items-center justify-center overflow-hidden border-b hairline bg-surface/60">
                  <img src={s.image} alt={s.imageAlt} width={1280} height={720} loading="lazy" className="h-full w-full object-cover mix-blend-multiply invert dark:mix-blend-screen dark:invert-0" />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                      <Dots id={id} /> {s.name.toUpperCase()}
                    </span>
                    <span className="mono-label">{s.host}</span>
                  </div>
                  <span className="text-sm text-foreground">{s.tagline}</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                  <dl className="mt-1 grid gap-px border hairline bg-grid">
                    {s.facts.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 bg-background px-2.5 py-1.5">
                        <dt className="mono-label">{k}</dt>
                        <dd className="font-mono text-[11px] text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="mono-label mt-1 flex items-center gap-1 text-accent-blue">
                    open {s.host} <ArrowUpRightIcon className="size-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

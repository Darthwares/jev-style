"use client";

import { ArrowUpRightIcon, BookOpenIcon, LayoutListIcon, PlayIcon, ScanSearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DotMatrix, type DotState } from "@/components/patterns/dot-matrix";
import { StageStrip } from "@/components/patterns/stage-strip";
import { Cell, MonoLabel } from "@/components/shared/primitives";
import { SiteLinks } from "@/components/shared/site-links";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { formatDuration, formatUsd } from "@/lib/format";
import { Logo } from "./landing";

/*
 * App shell recipe (see docs/recipes.md): sidebar · header · form + live panel ·
 * stats strip · results. This skeleton fakes a run so the layout can be seen;
 * replace `run()` with your streaming hook.
 */

type View = "run" | "results";

export function Shell({ hasApiKey, model, pricePerMtok }: { hasApiKey: boolean; model: string; pricePerMtok: number }) {
  const [view, setView] = useState<View>("run");
  const [states, setStates] = useState<DotState[]>([]);
  const [done, setDone] = useState(false);
  const total = 48;

  const run = () => {
    setDone(false);
    setStates([]);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStates(Array.from({ length: total }, (_, k) => (k < i - 6 ? "done" : k < i ? "fetched" : "queued")));
      if (i >= total + 6) {
        clearInterval(t);
        setDone(true);
        setView("results");
      }
    }, 40);
  };

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r hairline bg-sidebar text-sidebar-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5" title="home">
          <Logo />
          <span className="text-sm font-semibold tracking-tight">SITE</span>
        </Link>
        <nav className="flex flex-col gap-0.5 px-3">
          <NavItem icon={<ScanSearchIcon />} label="Run" active={view === "run"} onClick={() => setView("run")} />
          <NavItem icon={<LayoutListIcon />} label="Results" active={view === "results"} disabled={!done} onClick={() => setView("results")} count={done ? total : undefined} />
          <NavItem icon={<BookOpenIcon />} label="TypeSafe docs" href="https://docs.typesafe.ai" />
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t hairline px-5 py-4">
          <Row k="model" v={model} />
          <Row k="price" v={`$${pricePerMtok}/mtok in`} />
          <div className="flex items-center justify-between">
            <MonoLabel>status</MonoLabel>
            <span className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", hasApiKey ? "bg-emerald-400" : "bg-amber-400")} />
              <MonoLabel className="text-foreground">{hasApiKey ? "jev connected" : "no api key"}</MonoLabel>
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <MonoLabel>theme</MonoLabel>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b hairline px-5 py-3 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo />
            <span className="text-sm font-semibold tracking-tight">SITE</span>
          </div>
          <MonoLabel className="hidden lg:block">site · what it does · how · one jev call</MonoLabel>
          <div className="flex items-center gap-4">
            <MonoLabel className={cn("hidden sm:block", hasApiKey ? "text-emerald-500" : "text-amber-500")}>{hasApiKey ? "● jev connected" : "● no api key"}</MonoLabel>
            <span className="lg:hidden"><ThemeToggle /></span>
          </div>
        </header>

        <section className="grid border-b hairline lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)] lg:divide-x">
          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <div className="flex flex-col gap-2">
              <MonoLabel>input → judgment → result // one jev call</MonoLabel>
              <h1 className="display text-4xl sm:text-5xl">Point it at something.</h1>
              <p className="max-w-xl text-sm text-muted-foreground">One sentence about what happens when the button is pressed, and what comes back.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <MonoLabel>input</MonoLabel>
              <input className="h-10 w-full border hairline bg-transparent px-3 font-mono text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground/40" placeholder="https://example.com" />
            </div>
            <button type="button" onClick={run} className="flex h-10 w-fit items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              <PlayIcon className="size-3.5" /> Run
            </button>
          </div>
          <div className="hairline min-h-[360px] bg-surface/60 lg:min-h-0">
            <DotMatrix total={total} states={states} status={states.length ? (done ? "complete" : "streaming") : "awaiting input"} />
          </div>
        </section>

        {done && (
          <>
            <div className="grid divide-y hairline sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
              <Cell><MonoLabel>items</MonoLabel><div className="font-mono text-4xl tabular-nums leading-none">{total}</div><MonoLabel className="normal-case tracking-normal">all judged</MonoLabel></Cell>
              <Cell><MonoLabel>total time</MonoLabel><div className="font-mono text-4xl tabular-nums leading-none text-accent-blue">{formatDuration(2160)}</div><MonoLabel className="normal-case tracking-normal">parse 4ms · judge 2.1s</MonoLabel></Cell>
              <Cell><MonoLabel>jev cost</MonoLabel><div className="font-mono text-4xl tabular-nums leading-none text-accent-blue">{formatUsd(0.0042)}</div><MonoLabel className="normal-case tracking-normal">100k tok · 48 requests · output free</MonoLabel></Cell>
              <Cell><MonoLabel>vs one llm call</MonoLabel><div className="font-mono text-4xl tabular-nums leading-none">12×<span className="text-lg text-muted-foreground"> cheaper</span></div><MonoLabel className="normal-case tracking-normal">estimate, list price</MonoLabel></Cell>
            </div>
            <div className="p-5 sm:p-6">
              <StageStrip stages={[{ id: "parse", label: "parse", sub: "code", ms: 4 }, { id: "judge", label: "judge", sub: "jev · 1 question per item", ms: 2100 }, { id: "decide", label: "decide", sub: "code", ms: 1 }]} />
            </div>
          </>
        )}

        <footer className="mt-auto flex items-center justify-between gap-4 border-t hairline px-5 py-3 sm:px-6">
          <MonoLabel>site · beta · nothing is stored</MonoLabel>
          <div className="flex flex-wrap items-center justify-end gap-4"><MonoLabel>powered by typesafe jev</MonoLabel><SiteLinks current="jeval" side="top" compact /></div>
        </footer>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <MonoLabel>{k}</MonoLabel>
      <MonoLabel className="text-foreground">{v}</MonoLabel>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, href, count, disabled }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; href?: string; count?: number; disabled?: boolean }) {
  const cls = cn(
    "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    disabled && "pointer-events-none opacity-40",
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {icon}
        <span className="flex-1">{label}</span>
        <ArrowUpRightIcon className="text-muted-foreground" />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && <span className="font-mono text-xs tabular-nums text-muted-foreground">{count}</span>}
    </button>
  );
}

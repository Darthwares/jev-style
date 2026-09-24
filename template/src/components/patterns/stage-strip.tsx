"use client";

import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { MonoLabel } from "../shared/primitives";

export interface Stage {
  id: string;
  label: string;
  /** mono sub-line, e.g. "jev · 1 question per field" */
  sub: string;
  /** milliseconds when finished; undefined while pending */
  ms?: number;
  /** replaces the time when the stage was skipped, e.g. "not needed" */
  skipped?: string;
}

/**
 * Pipeline stage timings as an equal-cell strip: `n · name`, a big mono time,
 * a status dot (blue pulsing while running, emerald when done) and a sub-line.
 * `activeId` is the stage running now; `elapsedMs` feeds its live counter.
 */
export function StageStrip({ stages, activeId, elapsedMs = 0, className }: { stages: Stage[]; activeId?: string | null; elapsedMs?: number; className?: string }) {
  const doneMs = stages.reduce((s, st) => s + (st.ms ?? 0), 0);
  return (
    <div className={cn("grid gap-px border hairline bg-grid", stages.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3", className)}>
      {stages.map((s, i) => {
        const active = s.id === activeId;
        const done = s.ms !== undefined;
        return (
          <div key={s.id} className={cn("flex flex-col gap-1 bg-background p-3", active && "bg-accent-blue/[0.06]", s.skipped && "opacity-60")}>
            <div className="flex items-center justify-between">
              <MonoLabel className={cn((done || active) && "text-foreground")}>{i + 1} · {s.label}</MonoLabel>
              <span className={cn("size-1.5 rounded-full", done ? "bg-emerald-400" : active ? "animate-pulse bg-accent-blue" : "bg-foreground/20")} />
            </div>
            <span className="font-mono text-2xl tabular-nums leading-none">{done ? formatDuration(s.ms!) : active ? formatDuration(Math.max(0, elapsedMs - doneMs)) : "—"}</span>
            <MonoLabel className="normal-case tracking-normal">{s.skipped ?? s.sub}</MonoLabel>
          </div>
        );
      })}
    </div>
  );
}

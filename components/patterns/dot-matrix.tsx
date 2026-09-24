"use client";

import { cn } from "@/lib/utils";
import { Crosshair, MonoLabel } from "../shared/primitives";

export type DotState = "queued" | "fetched" | "done";

/**
 * One dot per unit of work (page, chunk, item). Outline = queued, dim = fetched,
 * blue = judged/done; `tone(i)` can override the colour per dot (e.g. by grade).
 * Mirrors the TypeSafe console's dot grids. Caps at 300 dots and shrinks them as
 * the count grows.
 */
export function DotMatrix({ total, states, title = "state + questions // structured output", status, tone, className }: { total: number; states: DotState[]; title?: string; status: string; tone?: (i: number) => string | undefined; className?: string }) {
  const count = Math.min(300, Math.max(total, states.length, 1));
  return (
    <div className={cn("relative flex h-full flex-col justify-between gap-6 overflow-hidden p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <MonoLabel>{title}</MonoLabel>
          <MonoLabel className="text-foreground/80">{status}</MonoLabel>
        </div>
        <Crosshair />
      </div>
      <div className="flex w-full flex-wrap content-center gap-[9px]" role="img" aria-label={`${states.filter((s) => s === "done").length} of ${count} done`}>
        {Array.from({ length: count }, (_, i) => {
          const s = states[i] ?? "queued";
          return (
            <span
              key={i}
              className={cn(
                "rounded-full transition-colors duration-500",
                count <= 60 ? "size-4" : count <= 150 ? "size-3" : "size-2.5",
                tone?.(i) ?? (s === "done" ? "bg-accent-blue" : s === "fetched" ? "bg-foreground/25" : "border border-foreground/15"),
              )}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        <MonoLabel><span className="mr-1 inline-block size-2 rounded-full border border-foreground/30 align-middle" /> queued</MonoLabel>
        <MonoLabel><span className="mr-1 inline-block size-2 rounded-full bg-foreground/25 align-middle" /> fetched</MonoLabel>
        <MonoLabel><span className="mr-1 inline-block size-2 rounded-full bg-accent-blue align-middle" /> done</MonoLabel>
      </div>
    </div>
  );
}

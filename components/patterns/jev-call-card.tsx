"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDuration, formatTokens, formatUsd } from "@/lib/format";
/** One model request as it was sent, with the answers that came back. Shape shared by dotmap, jeval and jextract. */
export interface JevCall {
  id: string;
  model: string;
  state: Record<string, unknown>;
  questions: { key: string; type: "choice" | "noul" | "score"; instructions: string; options?: Record<string, string> }[];
  answers: Record<string, { type: "choice"; choice: string; confidence: number; probabilities: Record<string, number> } | { type: "score"; score: number; confidence: number; probabilities: Record<string, number> } | { type: "noul"; noul: number }>;
  inputTokens: number;
  costUsd: number;
  ms: number;
}
import { MonoLabel } from "../shared/primitives";

function topOf(a: JevCall["answers"][string] | undefined): [string, number][] {
  if (!a) return [];
  if (a.type === "noul") return [["yes", a.noul], ["no", 1 - a.noul]].sort((x, y) => (y[1] as number) - (x[1] as number)) as [string, number][];
  return Object.entries(a.probabilities).sort((x, y) => y[1] - x[1]);
}

/**
 * One Jev `systemOne` request as it was sent and answered: state, questions,
 * options and the probability on each. Shared shape across dotmap, jeval and jextract.
 */
export function JevCallCard({ call, title, labels, compact }: { call: JevCall; title?: string; labels?: Record<string, string>; compact?: boolean }) {
  const [openState, setOpenState] = useState(false);
  const [openQ, setOpenQ] = useState<string | null>(null);
  const stateText = JSON.stringify(call.state, null, 2);
  return (
    <section className="flex flex-col">
      <header className={cn("flex flex-wrap items-center justify-between gap-2 bg-surface/60 py-3", compact ? "px-6" : "px-5 sm:px-6")}>
        <MonoLabel className="text-foreground">{title ?? "jev call"} · POST /v1/system-one · {call.model}</MonoLabel>
        <MonoLabel>
          {call.questions.length} questions · {formatTokens(call.inputTokens)} tok · {formatUsd(call.costUsd)} · {formatDuration(call.ms)}
        </MonoLabel>
      </header>
      <div className="flex flex-col divide-y hairline border-t hairline">
        <div>
          <button type="button" onClick={() => setOpenState((v) => !v)} className={cn("flex w-full items-center justify-between py-2.5 text-left", compact ? "px-6" : "px-5 sm:px-6")}>
            <MonoLabel className="text-foreground">request.state · {stateText.length.toLocaleString()} chars</MonoLabel>
            <ChevronDownIcon className={cn("size-3.5 text-muted-foreground transition-transform", openState && "rotate-180")} />
          </button>
          <pre className={cn("whitespace-pre-wrap pb-3 font-mono text-[11px] leading-relaxed text-muted-foreground", compact ? "px-6" : "px-5 sm:px-6", !openState && "max-h-32 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]")}>{stateText}</pre>
        </div>
        <div className={cn("py-2", compact ? "px-6" : "px-5 sm:px-6")}>
          <MonoLabel className="text-foreground">request.questions → response.answers</MonoLabel>
        </div>
        {call.questions.map((q) => {
          const ranked = topOf(call.answers[q.key]);
          const top = ranked[0];
          const open = openQ === q.key;
          const label = labels?.[q.key] ?? q.key;
          return (
            <div key={q.key}>
              <button type="button" onClick={() => setOpenQ(open ? null : q.key)} className={cn("grid w-full grid-cols-[minmax(0,1fr)_16px] items-start gap-3 py-2.5 text-left hover:bg-surface/70 sm:grid-cols-[minmax(140px,0.9fr)_minmax(0,1.6fr)_104px_16px] sm:items-center", compact ? "px-6" : "px-5 sm:px-6")}>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm">{label}</span>
                  <MonoLabel className="truncate">{q.type}{q.options ? ` · ${Object.keys(q.options).length} ${q.type === "score" ? "levels" : "options"}` : ""}</MonoLabel>
                </span>
                <span className="order-3 flex min-w-0 flex-col gap-0.5 sm:order-none">
                  {top && <span className="truncate font-mono text-[11px] text-accent-blue">{top[0]}</span>}
                  <span className="line-clamp-2 text-xs leading-snug text-foreground">{q.options?.[top?.[0] ?? ""] ?? (top ? "" : "—")}</span>
                </span>
                <span className="order-2 flex items-center gap-2 sm:order-none">
                  <span className="relative h-1 w-9 overflow-hidden rounded-full bg-grid">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-accent-blue" style={{ width: `${Math.round((top?.[1] ?? 0) * 100)}%` }} />
                  </span>
                  <span className="w-9 text-right font-mono text-xs tabular-nums">{Math.round((top?.[1] ?? 0) * 100)}%</span>
                </span>
                <ChevronDownIcon className={cn("order-4 size-3.5 self-center text-muted-foreground transition-transform sm:order-none", open && "rotate-180")} />
              </button>
              {open && (
                <div className={cn("grid gap-4 border-t hairline bg-surface/40 py-4 sm:grid-cols-2", compact ? "px-6" : "px-5 sm:px-6")}>
                  <div className="flex flex-col gap-2">
                    <MonoLabel>question · key {q.key}</MonoLabel>
                    <p className="text-xs leading-relaxed">{q.instructions}</p>
                    {q.options && (
                      <>
                        <MonoLabel className="pt-1">{q.type === "score" ? "criteria · ordered levels" : "criteria · options"}</MonoLabel>
                        <ol className="flex flex-col divide-y hairline border hairline">
                          {Object.entries(q.options).map(([k, v]) => (
                            <li key={k} className="grid grid-cols-[minmax(40px,auto)_minmax(0,1fr)] gap-3 px-2.5 py-1.5 text-[11px] leading-snug">
                              <span className="font-mono text-accent-blue">{k}</span>
                              <span className="text-foreground/90">{v}</span>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <MonoLabel>answer · probabilities</MonoLabel>
                    {ranked.slice(0, 8).map(([k, p], i) => (
                      <div key={k} className="grid grid-cols-[minmax(0,1fr)_44px] items-start gap-2">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="flex min-w-0 items-baseline gap-2">
                            <span className={cn("shrink-0 font-mono text-[11px]", i === 0 ? "text-accent-blue" : "text-muted-foreground")}>{k}</span>
                            {q.options?.[k] && <span className={cn("truncate text-[11px]", i === 0 ? "text-foreground" : "text-muted-foreground")}>{q.options[k]}</span>}
                          </span>
                          <div className="relative h-1 w-full overflow-hidden rounded-full bg-grid">
                            <div className={cn("absolute inset-y-0 left-0 rounded-full", i === 0 ? "bg-accent-blue" : "bg-muted-foreground/40")} style={{ width: `${Math.round(p * 100)}%` }} />
                          </div>
                        </div>
                        <span className="text-right font-mono text-xs tabular-nums">{Math.round(p * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

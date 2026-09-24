"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MonoLabel } from "../shared/primitives";

/* -------------------------------------------------------------------------- */
/* Frame specs — a declarative "video": each kind is a small seekable timeline */
/* -------------------------------------------------------------------------- */

export type ExplainerSpec =
  | { kind: "rubric"; state: Record<string, string>; question: string; levels: string[]; probabilities: number[]; passAt?: number }
  | { kind: "boolean"; state: Record<string, string>; question: string; pYes: number; yesLabel: string; noLabel: string; yesIsGood: boolean }
  | { kind: "choice"; state: Record<string, string>; question: string; options: { key: string; label: string; p: number; score: number }[] }
  | { kind: "chunks"; question: string; chunks: { text: string; verdict: string; p: number; good: boolean }[]; summary: string }
  | { kind: "sequence"; expected: string[]; actual: string[]; matches: { expected: number; actual: number | null; p: number }[]; summary: string }
  | { kind: "toolcalls"; expected: { name: string; args: Record<string, string> }[]; actual: { name: string; args: Record<string, string> }[]; matches: { p: number; note: string }[]; summary: string }
  | { kind: "deterministic"; left: { label: string; text: string }; right: { label: string; text: string }; steps: string[]; result: string; score: number };

const FRAME_LABELS: Record<ExplainerSpec["kind"], string[]> = {
  rubric: ["the state", "the question + ordered levels", "jev returns a distribution", "expected score + confidence → pass/fail"],
  boolean: ["the state", "the yes/no question", "jev returns p(yes)", "threshold in code → verdict"],
  choice: ["the state", "the options, each with a meaning", "jev returns a probability per option", "chosen option → mapped score"],
  chunks: ["the question", "every chunk, judged on its own", "one probability per chunk", "aggregate in code"],
  sequence: ["expected steps", "what the agent actually did", "one probability per expected step", "score = share performed × order"],
  toolcalls: ["expected calls", "actual calls (renamed keys, reformatted values)", "semantic match per call", "score"],
  deterministic: ["the two inputs", "the computation", "the number", "no model, no cost"],
};

export function Explainer({ spec, autoplay = true }: { spec: ExplainerSpec; autoplay?: boolean }) {
  const labels = FRAME_LABELS[spec.kind];
  const total = labels.length;
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(autoplay);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % total), 2200);
    return () => clearInterval(t);
  }, [playing, total]);

  return (
    <div className="flex flex-col border hairline bg-surface/60">
      <div className="flex items-center justify-between gap-3 border-b hairline px-4 py-2">
        <MonoLabel className="text-foreground">
          frame {frame + 1}/{total} · {labels[frame]}
        </MonoLabel>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => { setFrame(0); setPlaying(true); }} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Restart">
            <RotateCcwIcon className="size-3.5" />
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} className="p-1 text-muted-foreground hover:text-foreground" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
          </button>
        </div>
      </div>
      <div className="min-h-[260px] p-4 sm:p-6">
        {spec.kind === "rubric" && <RubricFrames spec={spec} frame={frame} />}
        {spec.kind === "boolean" && <BooleanFrames spec={spec} frame={frame} />}
        {spec.kind === "choice" && <ChoiceFrames spec={spec} frame={frame} />}
        {spec.kind === "chunks" && <ChunkFrames spec={spec} frame={frame} />}
        {spec.kind === "sequence" && <SequenceFrames spec={spec} frame={frame} />}
        {spec.kind === "toolcalls" && <ToolCallFrames spec={spec} frame={frame} />}
        {spec.kind === "deterministic" && <DeterministicFrames spec={spec} frame={frame} />}
      </div>
      <div className="flex gap-1 border-t hairline px-4 py-2">
        {labels.map((l, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setFrame(i); setPlaying(false); }}
            className={cn("h-1 flex-1 rounded-full transition-colors", i <= frame ? "bg-accent-blue" : "bg-grid")}
            title={l}
            aria-label={`Frame ${i + 1}: ${l}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- atoms ---------------------------------- */

function Reveal({ show, children, className, delay = 0 }: { show: boolean; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div className={cn("transition-all duration-500", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function StateBox({ state, dim }: { state: Record<string, string>; dim?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1.5 border hairline p-3 transition-opacity", dim && "opacity-50")}>
      <MonoLabel>state</MonoLabel>
      {Object.entries(state).map(([k, v]) => (
        <div key={k} className="grid grid-cols-[84px_minmax(0,1fr)] gap-2 text-xs">
          <span className="font-mono text-muted-foreground">{k}</span>
          <span className="text-foreground/90">{v}</span>
        </div>
      ))}
    </div>
  );
}

function Question({ text, show }: { text: string; show: boolean }) {
  return (
    <Reveal show={show}>
      <div className="border border-accent-blue/50 bg-accent-blue/[0.06] p-3">
        <MonoLabel className="text-accent-blue">question → jev</MonoLabel>
        <p className="mt-1 text-xs">{text}</p>
      </div>
    </Reveal>
  );
}

function Bar({ p, show, tone = "bg-accent-blue", delay = 0 }: { p: number; show: boolean; tone?: string; delay?: number }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-grid">
      <div className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-700", tone)} style={{ width: show ? `${Math.round(p * 100)}%` : "0%", transitionDelay: `${delay}ms` }} />
    </div>
  );
}

/* --------------------------------- rubric ---------------------------------- */

function RubricFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "rubric" }>; frame: number }) {
  const max = spec.levels.length - 1;
  const expected = spec.probabilities.reduce((s, p, i) => s + p * i, 0);
  const conf = Math.max(...spec.probabilities);
  const passAt = spec.passAt ?? 0.75;
  const norm = expected / max;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <StateBox state={spec.state} dim={frame >= 2} />
        <Question text={spec.question} show={frame >= 1} />
      </div>
      <div className="flex flex-col gap-2">
        <Reveal show={frame >= 1}>
          <MonoLabel>ordered levels</MonoLabel>
        </Reveal>
        {spec.levels.map((l, i) => (
          <Reveal key={i} show={frame >= 1} delay={i * 80}>
            <div className="grid grid-cols-[20px_minmax(0,1fr)_44px] items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{i}</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs leading-snug">{l}</span>
                <Bar p={spec.probabilities[i]} show={frame >= 2} delay={i * 60} tone={i === Math.round(expected) ? "bg-accent-blue" : "bg-muted-foreground/50"} />
              </div>
              <span className={cn("text-right font-mono text-xs tabular-nums transition-opacity", frame >= 2 ? "opacity-100" : "opacity-0")}>{Math.round(spec.probabilities[i] * 100)}%</span>
            </div>
          </Reveal>
        ))}
        <Reveal show={frame >= 3} className="mt-2 flex flex-wrap items-center gap-3 border-t hairline pt-3">
          <span className="font-mono text-2xl tabular-nums">{expected.toFixed(1)}<span className="text-sm text-muted-foreground"> / {max}</span></span>
          <MonoLabel>conf {Math.round(conf * 100)}%</MonoLabel>
          <span className={cn("mono-label border px-1.5 py-px", norm >= passAt ? "border-emerald-500/50 text-emerald-500" : "border-red-500/50 text-red-500")}>{norm >= passAt ? "pass" : "fail"} · threshold {Math.round(passAt * 100)}%</span>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------- boolean --------------------------------- */

function BooleanFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "boolean" }>; frame: number }) {
  const yes = spec.pYes >= 0.5;
  const good = spec.yesIsGood ? yes : !yes;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <StateBox state={spec.state} dim={frame >= 2} />
        <Question text={spec.question} show={frame >= 1} />
      </div>
      <div className="flex flex-col justify-center gap-4">
        <Reveal show={frame >= 2}>
          <MonoLabel>p(yes)</MonoLabel>
          <div className="mt-2 flex items-center gap-3">
            <span className="w-16 text-right font-mono text-3xl tabular-nums">{Math.round(spec.pYes * 100)}%</span>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-grid">
              <div className="absolute inset-y-0 left-0 rounded-full bg-accent-blue transition-[width] duration-700" style={{ width: frame >= 2 ? `${spec.pYes * 100}%` : "0%" }} />
              <div className={cn("absolute inset-y-0 w-px bg-foreground transition-opacity", frame >= 3 ? "opacity-100" : "opacity-0")} style={{ left: "50%" }} title="threshold 0.5" />
            </div>
          </div>
          <div className="mt-1 flex justify-between">
            <MonoLabel>no</MonoLabel>
            <MonoLabel>yes</MonoLabel>
          </div>
        </Reveal>
        <Reveal show={frame >= 3} className="flex flex-wrap items-center gap-3 border-t hairline pt-3">
          <span className={cn("mono-label border px-1.5 py-px", good ? "border-emerald-500/50 text-emerald-500" : "border-red-500/50 text-red-500")}>{yes ? spec.yesLabel : spec.noLabel}</span>
          <MonoLabel>confidence |p − 0.5| × 2 = {Math.round(Math.abs(spec.pYes - 0.5) * 200)}%</MonoLabel>
          <MonoLabel>the 0.5 line is yours to move</MonoLabel>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------- choice ---------------------------------- */

function ChoiceFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "choice" }>; frame: number }) {
  const top = spec.options.reduce((m, o, i, arr) => (o.p > arr[m].p ? i : m), 0);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <StateBox state={spec.state} dim={frame >= 2} />
        <Question text={spec.question} show={frame >= 1} />
      </div>
      <div className="flex flex-col gap-2">
        <Reveal show={frame >= 1}><MonoLabel>options</MonoLabel></Reveal>
        {spec.options.map((o, i) => (
          <Reveal key={o.key} show={frame >= 1} delay={i * 70}>
            <div className={cn("grid grid-cols-[28px_minmax(0,1fr)_44px] items-center gap-2 border p-2 transition-colors", frame >= 3 && i === top ? "border-accent-blue/60 bg-accent-blue/[0.06]" : "hairline")}>
              <span className="font-mono text-sm">{o.key}</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs leading-snug">{o.label}</span>
                <Bar p={o.p} show={frame >= 2} delay={i * 60} tone={i === top ? "bg-accent-blue" : "bg-muted-foreground/50"} />
              </div>
              <span className={cn("text-right font-mono text-xs tabular-nums transition-opacity", frame >= 2 ? "opacity-100" : "opacity-0")}>{Math.round(o.p * 100)}%</span>
            </div>
          </Reveal>
        ))}
        <Reveal show={frame >= 3} className="mt-1 flex flex-wrap items-center gap-3 border-t hairline pt-3">
          <span className="font-mono text-2xl">{spec.options[top].key}</span>
          <MonoLabel>→ score {spec.options[top].score}</MonoLabel>
          <MonoLabel>conf {Math.round(spec.options[top].p * 100)}%</MonoLabel>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------- chunks ---------------------------------- */

function ChunkFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "chunks" }>; frame: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-accent-blue/50 bg-accent-blue/[0.06] p-3">
        <MonoLabel className="text-accent-blue">question · asked once per chunk</MonoLabel>
        <p className="mt-1 text-xs">{spec.question}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {spec.chunks.map((c, i) => (
          <Reveal key={i} show={frame >= 1} delay={i * 90}>
            <div className={cn("flex h-full flex-col gap-2 border p-3 transition-colors", frame >= 2 ? (c.good ? "border-emerald-500/40" : "border-red-500/40") : "hairline")}>
              <div className="flex items-center justify-between">
                <MonoLabel>chunk {i + 1}</MonoLabel>
                <span className={cn("mono-label transition-opacity", frame >= 2 ? "opacity-100" : "opacity-0", c.good ? "text-emerald-500" : "text-red-500")}>
                  {c.verdict} · {Math.round(c.p * 100)}%
                </span>
              </div>
              <p className="text-xs leading-snug text-muted-foreground">{c.text}</p>
              <Bar p={c.p} show={frame >= 2} delay={i * 80} tone={c.good ? "bg-emerald-500" : "bg-red-500"} />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal show={frame >= 3} className="flex flex-wrap items-center gap-3 border-t hairline pt-3">
        <MonoLabel className="text-foreground">{spec.summary}</MonoLabel>
        <MonoLabel>{spec.chunks.length} questions · 1 request</MonoLabel>
      </Reveal>
    </div>
  );
}

/* -------------------------------- sequence --------------------------------- */

function SequenceFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "sequence" }>; frame: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <MonoLabel>expected trajectory</MonoLabel>
          {spec.expected.map((s, i) => {
            const m = spec.matches[i];
            return (
              <div key={i} className={cn("flex items-center justify-between gap-2 border p-2 text-xs transition-colors", frame >= 2 ? (m.p >= 0.5 ? "border-emerald-500/40" : "border-red-500/40") : "hairline")}>
                <span>
                  <span className="mr-2 font-mono text-muted-foreground">{i + 1}</span>
                  {s}
                </span>
                <span className={cn("mono-label transition-opacity", frame >= 2 ? "opacity-100" : "opacity-0", m.p >= 0.5 ? "text-emerald-500" : "text-red-500")}>{Math.round(m.p * 100)}%</span>
              </div>
            );
          })}
        </div>
        <Reveal show={frame >= 1} className="flex flex-col gap-1.5">
          <MonoLabel>actual trajectory</MonoLabel>
          {spec.actual.map((s, i) => (
            <div key={i} className="border hairline p-2 text-xs">
              <span className="mr-2 font-mono text-muted-foreground">{i + 1}</span>
              {s}
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal show={frame >= 2}>
        <MonoLabel>“does the trajectory accomplish expected step i?” → one p(yes) per step, plus one order question</MonoLabel>
      </Reveal>
      <Reveal show={frame >= 3} className="flex flex-wrap items-center gap-3 border-t hairline pt-3">
        <MonoLabel className="text-foreground">{spec.summary}</MonoLabel>
      </Reveal>
    </div>
  );
}

/* -------------------------------- toolcalls -------------------------------- */

function ToolCallFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "toolcalls" }>; frame: number }) {
  const fmt = (c: { name: string; args: Record<string, string> }) => `${c.name}(${Object.entries(c.args).map(([k, v]) => `${k}: ${v}`).join(", ")})`;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <MonoLabel>expected calls</MonoLabel>
          {spec.expected.map((c, i) => (
            <div key={i} className={cn("border p-2 font-mono text-[11px] transition-colors", frame >= 2 ? (spec.matches[i].p >= 0.5 ? "border-emerald-500/40" : "border-red-500/40") : "hairline")}>
              {fmt(c)}
            </div>
          ))}
        </div>
        <Reveal show={frame >= 1} className="flex flex-col gap-1.5">
          <MonoLabel>actual calls</MonoLabel>
          {spec.actual.map((c, i) => (
            <div key={i} className="border hairline p-2 font-mono text-[11px]">
              {fmt(c)}
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal show={frame >= 2} className="flex flex-col gap-1">
        {spec.matches.map((m, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <span className={cn("mono-label w-14", m.p >= 0.5 ? "text-emerald-500" : "text-red-500")}>{Math.round(m.p * 100)}%</span>
            <span className="text-muted-foreground">{m.note}</span>
          </div>
        ))}
      </Reveal>
      <Reveal show={frame >= 3} className="flex flex-wrap items-center gap-3 border-t hairline pt-3">
        <MonoLabel className="text-foreground">{spec.summary}</MonoLabel>
      </Reveal>
    </div>
  );
}

/* ------------------------------ deterministic ------------------------------ */

function DeterministicFrames({ spec, frame }: { spec: Extract<ExplainerSpec, { kind: "deterministic" }>; frame: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border hairline p-3">
          <MonoLabel>{spec.left.label}</MonoLabel>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">{spec.left.text}</pre>
        </div>
        <div className="border hairline p-3">
          <MonoLabel>{spec.right.label}</MonoLabel>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">{spec.right.text}</pre>
        </div>
      </div>
      <Reveal show={frame >= 1} className="flex flex-col gap-1">
        {spec.steps.map((s, i) => (
          <Reveal key={i} show={frame >= 1} delay={i * 120}>
            <div className="flex gap-2 text-xs">
              <span className="font-mono text-muted-foreground">{i + 1}.</span>
              <span>{s}</span>
            </div>
          </Reveal>
        ))}
      </Reveal>
      <Reveal show={frame >= 2} className="flex items-baseline gap-3">
        <span className="font-mono text-3xl tabular-nums">{spec.result}</span>
        <MonoLabel>score {spec.score}</MonoLabel>
      </Reveal>
      <Reveal show={frame >= 3}>
        <MonoLabel className="text-emerald-500">runs in code · $0 · ~0 ms · deterministic</MonoLabel>
      </Reveal>
    </div>
  );
}

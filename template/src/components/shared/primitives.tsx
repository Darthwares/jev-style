import { cn } from "@/lib/utils";
import { scoreColor } from "@/lib/format";

/** Small uppercase monospace caption, TypeSafe-console style. */
export function MonoLabel({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("mono-label", className)} {...props}>
      {children}
    </span>
  );
}

/** A hairline-bordered grid cell. */
export function Cell({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("hairline flex min-w-0 flex-col gap-3 p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

/** Thin slider-style meter: `label ——▬▬▬ value`. */
export function Meter({
  label,
  value,
  max = 100,
  display,
  tone = "score",
  fillClassName,
  valueClassName,
  className,
}: {
  label: React.ReactNode;
  value: number;
  max?: number;
  display?: React.ReactNode;
  tone?: "score" | "neutral" | "blue";
  /** Override the bar colour (e.g. by grade) */
  fillClassName?: string;
  valueClassName?: string;
  className?: string;
}) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const fill =
    fillClassName ??
    (tone === "blue"
      ? "bg-accent-blue"
      : tone === "neutral"
        ? "bg-foreground/70"
        : pct >= 85
          ? "bg-emerald-500"
          : pct >= 70
            ? "bg-lime-500"
            : pct >= 55
              ? "bg-amber-500"
              : pct >= 40
                ? "bg-orange-500"
                : "bg-red-500");
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1", className)}>
      <span className="truncate text-sm">{label}</span>
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          valueClassName ?? (tone === "score" ? scoreColor(pct) : tone === "blue" ? "text-accent-blue" : "text-foreground"),
        )}
      >
        {display ?? Math.round(value)}
      </span>
      <div className="col-span-2 relative h-3 w-full">
        <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-grid" />
        <div
          className={cn("absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-[width] duration-700 ease-out", fill)}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  );
}

/** Tiny histogram of probabilities across rubric levels. */
export function Histogram({
  values,
  highlight,
  className,
}: {
  values: number[];
  highlight?: number;
  className?: string;
}) {
  const max = Math.max(...values, 0.0001);
  return (
    <div className={cn("flex h-7 items-end gap-[3px]", className)} aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-[1px] transition-[height] duration-500",
            highlight === i ? "bg-accent-blue" : "bg-muted-foreground/40",
          )}
          style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
          title={`Level ${i}: ${Math.round(v * 100)}%`}
        />
      ))}
    </div>
  );
}

/** Decorative crosshair glyph. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-3.5 text-muted-foreground/70", className)} fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="8" cy="8" r="5" />
      <path d="M8 0v16M0 8h16" />
    </svg>
  );
}

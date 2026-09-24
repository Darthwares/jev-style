export function formatUsd(usd: number): string {
  if (usd === 0) return "$0.00000";
  if (usd < 0.01) return `$${usd.toFixed(5)}`;
  if (usd < 1) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

export function formatX(x: number): string {
  if (!Number.isFinite(x) || x <= 0) return "—";
  if (x >= 100) return `${Math.round(x)}×`;
  if (x >= 10) return `${x.toFixed(0)}×`;
  return `${x.toFixed(1)}×`;
}

/** Colour for a 0–100 score. */
export function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-lime-600 dark:text-lime-400";
  if (score >= 55) return "text-amber-600 dark:text-amber-400";
  if (score >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function scoreBg(score: number): string {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-lime-500";
  if (score >= 55) return "bg-amber-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

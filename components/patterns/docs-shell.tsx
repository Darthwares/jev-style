import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { MonoLabel } from "../shared/primitives";
import { SiteLinks, type SiteId } from "../shared/site-links";

export function DocsShell({ children, crumbs, site, nav = [], appHref = "/app", homeLabel = "SITE" }: { children: React.ReactNode; crumbs: { href?: string; label: string }[]; /** this site's id for the sister-site links; omit to hide them */ site?: SiteId; nav?: { href: string; label: string }[]; appHref?: string; homeLabel?: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b hairline bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5" title="home">
              <Logo />
              <span className="text-sm font-semibold tracking-tight">{homeLabel}</span>
            </Link>
            <span className="hidden text-muted-foreground/40 sm:inline">/</span>
            <nav className="hidden min-w-0 items-center gap-1.5 truncate sm:flex" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 truncate">
                  {i > 0 && <span className="text-muted-foreground/40">/</span>}
                  {c.href ? (
                    <Link href={c.href} className="mono-label hover:text-foreground">{c.label}</Link>
                  ) : (
                    <MonoLabel className="truncate text-foreground">{c.label}</MonoLabel>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 md:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="mono-label hover:text-foreground">{n.label}</Link>
              ))}
            </nav>
            <Link href={appHref} className="hidden h-8 items-center bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/85 sm:flex">
              Open playground
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">{children}</main>
      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="mono-label flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeftIcon className="size-3" /> home
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://typesafe.ai" className="mono-label hover:text-foreground">powered by typesafe jev</a>
            {site && <SiteLinks current={site} side="top" compact />}
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Logo() {
  return (
    <span className="grid size-5 grid-cols-2 gap-[3px]" aria-hidden>
      <span className="rounded-full bg-foreground" />
      <span className="rounded-full bg-foreground/40" />
      <span className="rounded-full bg-foreground/40" />
      <span className="rounded-full bg-accent-blue" />
    </span>
  );
}

export function Section({ label, title, children, className }: { label: string; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 border-b hairline py-8 sm:py-10", className)}>
      <MonoLabel>{label}</MonoLabel>
      {title && <h2 className="display text-2xl sm:text-3xl">{title}</h2>}
      {children}
    </section>
  );
}

export function Bullets({ items, tone = "neutral" }: { items: string[]; tone?: "good" | "bad" | "neutral" }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed">
          <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", tone === "good" ? "bg-emerald-500" : tone === "bad" ? "bg-red-500" : "bg-foreground/40")} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="grid gap-px border hairline bg-grid sm:grid-cols-2">
      {items.map((f, i) => (
        <div key={i} className="flex flex-col gap-2 bg-background p-4">
          <dt className="text-sm font-medium">{f.q}</dt>
          <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
        </div>
      ))}
    </dl>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

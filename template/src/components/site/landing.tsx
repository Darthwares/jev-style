import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MonoLabel } from "@/components/shared/primitives";
import { SiteLinks } from "@/components/shared/site-links";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/*
 * Landing recipe (see docs/recipes.md): header → two-column hero → numbers strip →
 * how it works → feature rows → grid → FAQ → closing CTA → footer.
 * Replace the copy; keep the section order and classes.
 */

export const FAQ: { q: string; a: string }[] = [
  { q: "What is SITE?", a: "Two to four sentences. Answer first, then the nuance. This array also feeds the FAQPage JSON-LD on the page." },
  { q: "How much does it cost?", a: "State the measured number and what it was measured on. Say when a number is an estimate." },
];

const NUMBERS: { k: string; v: string; sub: string }[] = [
  { k: "per run", v: "~0.3 s", sub: "measured on the sample" },
  { k: "jev calls", v: "2", sub: "any input size" },
  { k: "cost", v: "$0.0004", sub: "per item · output tokens free" },
  { k: "output", v: "value + p", sub: "a probability for every option" },
];

const STEPS: [string, string, string][] = [
  ["1 · parse", "code", "what the deterministic part does"],
  ["2 · judge", "jev · choice", "the question asked, one per unit"],
  ["3 · decide", "code", "how probabilities become a result"],
];

export function Landing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b hairline bg-background/85 px-5 py-3 backdrop-blur sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold tracking-tight">SITE</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <NavLink href="/app">App</NavLink>
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {/* Sister sites are a separate group, never part of the primary nav. Remove if this site is not in the family. */}
          <SiteLinks current="jeval" className="hidden md:flex" />
          <Link href="/app" className="flex h-8 items-center gap-1.5 bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/85">
            Open app <ArrowRightIcon className="size-3.5" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="grid border-b hairline lg:grid-cols-[minmax(0,52%)_minmax(0,1fr)] lg:divide-x">
          <div className="flex flex-col justify-center gap-6 p-6 sm:p-10 lg:p-14">
            <MonoLabel>what it is // powered by typesafe jev</MonoLabel>
            <h1 className="display text-5xl sm:text-6xl lg:text-7xl">
              Short line.
              <br />
              Shorter line.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              One paragraph. What it does, how, and the measured number. About 300 ms and $0.0004 per item.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/app" className="flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/85">
                Primary action <ArrowRightIcon className="size-4" />
              </Link>
              <a href="#how" className="flex h-11 items-center gap-2 border hairline px-5 font-mono text-xs uppercase tracking-wider hover:border-foreground/40">
                how it works
              </a>
            </div>
          </div>
          <Illustration src="/img/hero.png" alt="Describe the line-art" priority />
        </section>

        <section className="grid divide-y hairline border-b sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {NUMBERS.map((n) => (
            <div key={n.k} className="hairline flex flex-col gap-1.5 px-6 py-6 sm:px-8">
              <MonoLabel>{n.k}</MonoLabel>
              <span className="font-mono text-3xl tabular-nums leading-none text-accent-blue">{n.v}</span>
              <MonoLabel className="normal-case tracking-normal">{n.sub}</MonoLabel>
            </div>
          ))}
        </section>

        <section id="how" className="grid border-b hairline lg:grid-cols-2 lg:divide-x">
          <div className="hairline flex flex-col gap-4 p-6 sm:p-10">
            <MonoLabel>what it does</MonoLabel>
            <h2 className="display text-3xl sm:text-4xl">A declarative heading.</h2>
            <p className="text-sm text-muted-foreground sm:text-base">Explain the mechanism in plain words. Then the caveat, next to the claim.</p>
            <div className="grid gap-px border hairline bg-grid sm:grid-cols-3">
              {STEPS.map(([a, b, c]) => (
                <div key={a} className="flex flex-col gap-1 bg-background p-4">
                  <MonoLabel className="text-foreground">{a}</MonoLabel>
                  <MonoLabel className="text-accent-blue">{b}</MonoLabel>
                  <span className="text-xs text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <Illustration src="/img/how.png" alt="Describe the line-art" />
        </section>

        <section id="faq" className="grid border-b hairline lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:divide-x">
          <div className="hairline flex flex-col gap-3 p-6 sm:p-10">
            <MonoLabel>faq</MonoLabel>
            <h2 className="display text-3xl sm:text-4xl">Questions.</h2>
          </div>
          <dl className="hairline divide-y">
            {FAQ.map((f) => (
              <div key={f.q} className="hairline flex flex-col gap-2 p-6 sm:p-8">
                <dt className="text-base font-medium">{f.q}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col items-start gap-5 p-6 sm:p-10 lg:p-14">
          <MonoLabel>ready</MonoLabel>
          <h2 className="display text-4xl sm:text-5xl">Try it on a sample, then your own.</h2>
          <Link href="/app" className="flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/85">
            Open the app <ArrowRightIcon className="size-4" />
          </Link>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t hairline px-5 py-4 sm:px-8">
        <MonoLabel>site · one-line description · beta</MonoLabel>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/app" className="mono-label hover:text-foreground">app</Link>
          <a href="https://typesafe.ai" className="mono-label hover:text-foreground">powered by typesafe jev</a>
          <SiteLinks current="jeval" side="top" compact />
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

function Illustration({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="hairline relative flex min-h-[260px] items-center justify-center overflow-hidden bg-surface/60 sm:min-h-[320px]">
      <Image src={src} alt={alt} width={1280} height={720} priority={priority} className="h-full w-full max-w-[720px] object-contain mix-blend-multiply invert dark:mix-blend-screen dark:invert-0" />
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}

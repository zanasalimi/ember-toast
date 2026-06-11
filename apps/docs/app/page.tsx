import Link from "next/link";
import { Playground } from "@/components/playground";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import { HeroMock } from "@/components/hero-mock";

/**
 * Home — clean light product page. Everything floats in one white rounded panel on
 * a soft grey field: a plain nav, a descriptive hero with a real toast mockup, a
 * live "configure it" section (the playground), install, footer. Calm and roomy.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-base px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[26px] border border-rule bg-paper shadow-[0_1px_2px_rgba(20,20,30,0.05),0_36px_64px_-44px_rgba(20,20,30,0.28)]">
        {/* ───────────── NAV ───────────── */}
        <header className="flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-ink">embertoast</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a className="no-underline transition hover:text-ink" href="https://github.com/zanasalimi/embertoast">GitHub</a>
            <a className="no-underline transition hover:text-ink" href="https://www.npmjs.com/package/@embertoast/react">npm</a>
            <a className="no-underline transition hover:text-ink" href="#configure">Configure</a>
            <a className="no-underline transition hover:text-ink" href="/llms.txt">llms.txt</a>
          </nav>
          <a
            href="https://github.com/zanasalimi/embertoast"
            className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-sm font-medium text-white no-underline shadow-[0_6px_16px_-8px_rgba(232,89,12,0.7)] transition hover:bg-ember-deep"
          >
            <span aria-hidden>★</span> Give a Star
          </a>
        </header>

        {/* ───────────── HERO ───────────── */}
        <section className="grid grid-cols-1 items-center gap-14 px-6 pb-16 pt-4 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-10">
          <div className="min-w-0">
            <span className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" /> 0 deps · &lt;5KB gzip · zero-config
            </span>

            <h1
              className="animate-rise-in mt-6 text-mega font-bold text-ink"
              style={{ animationDelay: "0.05s" }}
            >
              Toast notifications your React app will love.
            </h1>

            <p
              className="animate-rise-in mt-6 max-w-prose text-lede text-muted"
              style={{ animationDelay: "0.12s" }}
            >
              Call <code className="font-mono text-ink">toast()</code> from anywhere —
              one mounted <code className="font-mono text-ink">&lt;Toaster/&gt;</code>{" "}
              renders it. Promise-aware, swipe-dismissable, accessible, themeable. Under
              5KB, zero runtime dependencies.
            </p>

            <div
              className="animate-rise-in mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.19s" }}
            >
              <a
                href="#configure"
                className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white no-underline shadow-[0_8px_20px_-10px_rgba(232,89,12,0.8)] transition hover:bg-ember-deep"
              >
                Configure it live
              </a>
              <a
                href="https://github.com/zanasalimi/embertoast"
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-5 py-2.5 text-sm font-medium text-ink no-underline transition hover:border-ink/25"
              >
                View source <span aria-hidden>↗</span>
              </a>
            </div>

            <div
              className="animate-rise-in mt-6 inline-flex items-center gap-2 rounded-lg border border-rule bg-surface py-1.5 pl-3.5 pr-1.5 font-mono text-[13px] text-ink"
              style={{ animationDelay: "0.26s" }}
            >
              <span className="text-faint">$</span> npm i @embertoast/react
              <CopyButton text="npm i @embertoast/react" />
            </div>
          </div>

          <div className="animate-rise-in min-w-0" style={{ animationDelay: "0.22s" }}>
            <HeroMock />
          </div>
        </section>

        {/* ───────────── CONFIGURE ───────────── */}
        <section
          id="configure"
          className="border-t border-rule bg-surface/50 px-6 py-16 sm:px-10 lg:py-20"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">live · dogfooded</p>
          <h2 className="mt-3 max-w-xl text-h1 text-ink">
            Configure it live. The buttons fire the real thing.
          </h2>
          <p className="mt-4 max-w-prose text-muted">
            Every control mutates the same store this page renders from — change the
            position, drop the CTAs, watch an upload morph into a result. Swipe one away.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <Playground />
            <CodeBlock
              lang="tsx"
              filename="app.tsx"
              code={`import { toast, Toaster } from "@embertoast/react";
import "@embertoast/react/styles.css";

function Save() {
  return (
    <button onClick={() => toast.success("Saved")}>
      Save
    </button>
  );
}

// mount once, near the root
export function App() {
  return <Toaster position="bottom-right" closeButton />;
}`}
            />
          </div>
        </section>

        {/* ───────────── WHY ───────────── */}
        <section className="grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-16 sm:px-10 md:grid-cols-3 lg:py-20">
          <Feature title="One function, anywhere">
            <code className="font-mono text-ink">toast()</code> is a store, not a hook —
            call it in a handler, a util, or any non-React module. One{" "}
            <code className="font-mono text-ink">&lt;Toaster/&gt;</code> renders it.
          </Feature>
          <Feature title="The polish, built in">
            Promise toasts that morph in place, swipe-to-dismiss, FLIP reflow,
            pause-on-hover, a depleting timer bar — all on by default.
          </Feature>
          <Feature title="Accessible &amp; tiny">
            <code className="font-mono text-ink">aria-live</code> done right, never
            steals focus, honors reduced-motion. Zero deps, under 5KB min+gzip.
          </Feature>
        </section>

        {/* ───────────── INSTALL ───────────── */}
        <section className="grid grid-cols-1 gap-10 border-t border-rule px-6 py-16 sm:px-10 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:py-20">
          <div className="min-w-0">
            <h2 className="text-h1 text-ink">Install in seconds.</h2>
            <p className="mt-4 max-w-prose text-muted">
              React 18+ as a peer. You only install the binding —{" "}
              <code className="font-mono text-ink">@embertoast/react</code>.
            </p>
          </div>
          <CodeBlock
            lang="bash"
            filename="terminal"
            code={`npm i @embertoast/react
# or
pnpm add @embertoast/react`}
          />
        </section>

        {/* ───────────── FOOTER ───────────── */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-rule px-6 py-8 font-mono text-xs text-muted sm:px-10">
          <span>embertoast · MIT · Zana Salimi</span>
          <nav className="flex gap-6">
            <a className="no-underline hover:text-ink" href="https://github.com/zanasalimi/embertoast">GitHub</a>
            <a className="no-underline hover:text-ink" href="https://www.npmjs.com/package/@embertoast/react">npm</a>
            <a className="no-underline hover:text-ink" href="/llms.txt">llms.txt</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span className="flex size-7 items-center justify-center rounded-lg bg-ember text-white shadow-[0_4px_10px_-4px_rgba(232,89,12,0.7)]">
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden>
        <rect x="3" y="6" width="14" height="9" rx="2.5" fill="#fff" />
        <path d="M6.5 10.2l2 2 5-5.2" stroke="#E8590C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

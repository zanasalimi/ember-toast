import { Playground } from "@/components/playground";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import { BackgroundFX } from "@/components/background-fx";
import DisplayCards from "@/components/ui/display-cards";

/**
 * Home = the showcase, midnight pro-tool. The product performs itself: a glowing
 * static toast stack anchors the hero, the live playground fires the real thing,
 * and the page is the dark theatre it all plays in. Editorial serif display,
 * one ember accent, orchestrated staggered reveal on load.
 */

const STATS: { n: string; label: string }[] = [
  { n: "4.8KB", label: "min + gzip" },
  { n: "0", label: "runtime deps" },
  { n: "1", label: "import to wire" },
  { n: "100%", label: "headless-capable" },
];

const MARQUEE = [
  "promise toasts",
  "swipe-to-dismiss",
  "FLIP reflow",
  "pause-on-hover",
  "aria-live",
  "determinate progress",
  "headless core",
  "portal-safe",
  "reduced-motion",
  "fire from anywhere",
];

export default function HomePage() {
  return (
    <>
      <BackgroundFX />

      <main className="relative z-10">
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="mx-auto grid min-h-[94svh] max-w-editorial grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:py-0">
          <div className="min-w-0">
            <p
              className="animate-rise-in flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.32em] text-muted"
              style={{ animationDelay: "0.02s" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_var(--tw-shadow-color)] shadow-ember" />
              React · zero-dependency · &lt;5KB
            </p>

            <h1
              className="animate-rise-in mt-6 text-mega font-black leading-[0.9] tracking-[-0.045em] text-ink"
              style={{ animationDelay: "0.08s" }}
            >
              Toasts that{" "}
              <span className="text-glow text-ember">behave</span>.
            </h1>

            <p
              className="animate-rise-in mt-7 max-w-prose text-lede text-muted"
              style={{ animationDelay: "0.16s" }}
            >
              Call <code className="font-mono text-ink">toast()</code> from
              anywhere — a handler, a utility, a non-React module. One mounted{" "}
              <code className="font-mono text-ink">&lt;Toaster/&gt;</code> renders
              them. Promise-aware, swipe-dismissable, FLIP reflow, accessible.
            </p>

            <div
              className="animate-rise-in mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.24s" }}
            >
              <div className="flex items-center gap-2 rounded-full border border-rule bg-paper/70 py-1.5 pl-4 pr-1.5 font-mono text-sm text-ink backdrop-blur">
                <span className="text-muted">$</span> npm i @embertoast/react
                <CopyButton text="npm i @embertoast/react" />
              </div>
              <a
                href="https://github.com/zanasalimi/embertoast"
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-ink no-underline transition hover:border-ember hover:text-ember"
              >
                View source <span aria-hidden>↗</span>
              </a>
            </div>

            <dl
              className="animate-rise-in mt-12 grid max-w-md grid-cols-4 gap-4 border-t border-rule pt-7"
              style={{ animationDelay: "0.32s" }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-serif text-2xl text-ink sm:text-[1.75rem]">
                    {s.n}
                  </dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-faint">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The product, on screen before you touch anything — a skewed,
              hover-reactive stack of toasts. */}
          <div
            className="animate-rise-in relative min-w-0"
            style={{ animationDelay: "0.3s" }}
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[100px]"
            />
            <div className="flex items-center justify-center overflow-hidden py-8 lg:justify-end lg:overflow-visible">
              <div className="scale-[0.64] sm:scale-90 lg:scale-100">
                <DisplayCards />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────── MARQUEE ──────────────────────── */}
        <div className="relative flex overflow-hidden border-y border-rule bg-paper/30 py-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max shrink-0 animate-marquee items-center gap-0">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={i}
                className="flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-muted"
              >
                <span className="mx-7 h-1 w-1 rounded-full bg-ember/70" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─────────────────────── FIRE ONE ─────────────────────── */}
        <section className="mx-auto max-w-editorial px-6 py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">
                live · dogfooded
              </p>
              <h2 className="mt-4 text-h1 text-ink">Fire one.</h2>
              <p className="mt-5 max-w-prose text-muted">
                Every button below calls the real library and renders through one{" "}
                <code className="font-mono text-ink">&lt;Toaster/&gt;</code> — the
                same store this page subscribes to. Change the position, drop the
                CTAs, watch an upload morph into a result. Swipe one away.
              </p>
            </div>
            <div className="min-w-0">
              <Playground />
            </div>
          </div>
        </section>

        {/* ─────────────────────── THE API ──────────────────────── */}
        <section className="mx-auto max-w-editorial px-6">
          <div className="grid grid-cols-1 gap-10 border-t border-rule py-20 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div className="min-w-0">
              <h2 className="text-h1 text-ink">The whole API is a function.</h2>
              <p className="mt-5 max-w-prose text-muted">
                It is a store, not a hook. That is why it works outside React render
                — and why a Vue or vanilla adapter is possible without rewriting the
                core. The producer is decoupled from the renderer through one small
                framework-agnostic store.
              </p>
            </div>
            <CodeBlock
              lang="tsx"
              filename="app.tsx"
              code={`import { toast, Toaster } from "@embertoast/react";
import "@embertoast/react/styles.css";

export default function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved")}>Save</button>
      {/* mount once, near the root */}
      <Toaster position="bottom-right" closeButton />
    </>
  );
}`}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-10 border-t border-rule py-20 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div className="min-w-0">
              <h2 className="text-h1 text-ink">One toast, three states.</h2>
              <p className="mt-5 max-w-prose text-muted">
                <code className="font-mono text-ink">toast.promise</code> pins a
                loading toast, then morphs the <em>same</em> toast in place to
                success or error — no flit, no replace. Success and error messages
                can be functions of the resolved value.
              </p>
            </div>
            <CodeBlock
              lang="tsx"
              filename="upload.ts"
              code={`toast.promise(uploadFile(file), {
  loading: "Uploading…",
  success: (res) => \`Uploaded \${res.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
});`}
            />
          </div>
        </section>

        {/* ───────────────────── CAPABILITIES ───────────────────── */}
        <section className="mx-auto max-w-editorial px-6">
          <div className="grid grid-cols-1 gap-y-12 gap-x-10 border-t border-rule py-20 md:grid-cols-3">
            <Capability n="01" title="FLIP reflow">
              Remove a toast from the middle of a stack and the survivors{" "}
              <em>slide</em> into the freed space — measured First/Last rects, an
              inverting transform, transition to identity. Only transform and
              opacity animate, so it stays on the compositor.
            </Capability>
            <Capability n="02" title="Accessible by default">
              One <code className="font-mono text-ink">aria-live</code> region per
              corner. Errors announce assertively, the rest politely. A toast never
              steals focus, and{" "}
              <code className="font-mono text-ink">prefers-reduced-motion</code>{" "}
              collapses every animation to instant.
            </Capability>
            <Capability n="03" title="Yours to theme">
              The styled default is entirely CSS custom properties —{" "}
              <code className="font-mono text-ink">--et-*</code> tokens for surface,
              accents, and motion. Or skip the stylesheet and bring your own markup;
              the behavior is the same.
            </Capability>
          </div>
        </section>

        {/* ─────────────────────── INSTALL ──────────────────────── */}
        <section className="mx-auto max-w-editorial px-6">
          <div className="grid grid-cols-1 gap-10 border-t border-rule py-20 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div className="min-w-0">
              <h2 className="text-h1 text-ink">Install.</h2>
              <p className="mt-5 max-w-prose text-muted">
                React 18+ as a peer. Two packages ship —{" "}
                <code className="font-mono text-ink">@embertoast/core</code> (the
                framework-free store) and{" "}
                <code className="font-mono text-ink">@embertoast/react</code> (the
                renderer) — but you only install the binding.
              </p>
            </div>
            <CodeBlock
              lang="bash"
              filename="terminal"
              code={`npm i @embertoast/react
# or
pnpm add @embertoast/react`}
            />
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-rule py-10 font-mono text-xs text-muted">
            <span>embertoast · MIT · Zana Salimi</span>
            <nav className="flex gap-6">
              <a className="no-underline hover:text-ember" href="https://github.com/zanasalimi/embertoast">
                GitHub
              </a>
              <a className="no-underline hover:text-ember" href="https://www.npmjs.com/package/@embertoast/react">
                npm
              </a>
              <a className="no-underline hover:text-ember" href="/llms.txt">
                llms.txt
              </a>
            </nav>
          </footer>
        </section>
      </main>
    </>
  );
}

function Capability({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <span className="font-mono text-[11px] tracking-[0.2em] text-ember">{n}</span>
      <h3 className="mt-3 font-serif text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

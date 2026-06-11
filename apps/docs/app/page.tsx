import { Playground } from "@/components/playground";
import { CodeBlock } from "@/components/code-block";

/**
 * Home = the showcase. The hero IS the product: a live playground front and
 * center. Editorial layout — asymmetric, serif display + sans body, one ember
 * accent, a left-aligned masthead rather than a centered card stack. No gradient,
 * no emoji feature grid.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-editorial px-6 py-14 md:py-20">
      {/* Masthead — editorial, asymmetric. The playground is the right column. */}
      <header className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            React · headless · zero-dep
          </p>
          <h1 className="mt-4 font-serif text-display text-ink">
            Toasts that
            <span className="text-ember"> behave</span>.
          </h1>
          <p className="mt-6 max-w-prose text-lede text-muted">
            Call <code className="font-mono text-ink">toast()</code> from anywhere
            — an event handler, a utility, a non-React module. One mounted{" "}
            <code className="font-mono text-ink">&lt;Toaster/&gt;</code> renders it.
            Promise-aware, swipe-dismissable, FLIP reflow, accessible.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-sm">
            <code className="rounded-md border border-rule bg-white/60 px-3 py-1.5 text-ink">
              npm i @embertoast/react
            </code>
            <span className="text-muted">·</span>
            <span className="text-muted">
              &lt;5kB min+gzip · zero runtime deps
            </span>
          </div>
        </div>

        {/* The hero is interactive: real toasts fire from these controls. */}
        <Playground />
      </header>

      <hr className="my-16 border-rule" />

      {/* The API, shown not told — the README leads with capability, so does this. */}
      <section className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <h2 className="text-h1 text-ink">The whole API is a function.</h2>
          <p className="mt-4 max-w-prose text-muted">
            It is a store, not a hook. That is why it works outside React render —
            and why a Vue or vanilla adapter is possible without rewriting the
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
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}`}
        />
      </section>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <h2 className="text-h1 text-ink">One toast, three states.</h2>
          <p className="mt-4 max-w-prose text-muted">
            <code className="font-mono text-ink">toast.promise</code> pins a
            loading toast, then morphs the <em>same</em> toast in place to success
            or error when the promise settles — no flit, no replace. The success
            and error messages can be functions of the resolved value.
          </p>
        </div>
        <CodeBlock
          lang="tsx"
          filename="upload.ts"
          code={`toast.promise(uploadFile(file), {
  loading: "Uploading…",
  success: (res) => \`Uploaded \${res.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
});

// returns the original promise, so you can still await it
await toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Nope" });`}
        />
      </div>

      <hr className="my-16 border-rule" />

      {/* Three intentional capability notes — prose, not an emoji grid. */}
      <section className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <Capability title="FLIP reflow">
          Remove a toast from the middle of a stack and the survivors{" "}
          <em>slide</em> into the freed space instead of jumping — measured First
          and Last rects, an inverting transform, transition to identity. Only
          transform and opacity animate, so it stays on the compositor.
        </Capability>
        <Capability title="Accessible by default">
          One <code className="font-mono text-ink">aria-live</code> region per
          corner. Errors and warnings announce assertively; everything else is
          polite. A toast never steals focus, and{" "}
          <code className="font-mono text-ink">prefers-reduced-motion</code>{" "}
          collapses every animation to instant.
        </Capability>
        <Capability title="Yours to theme">
          The styled default is entirely CSS custom properties —{" "}
          <code className="font-mono text-ink">--et-*</code> tokens for width,
          radius, surface, severity accents, and motion. Or skip the stylesheet
          and bring your own markup; the behavior is the same.
        </Capability>
      </section>

      <hr className="my-16 border-rule" />

      {/* Install + footer. */}
      <section className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <h2 className="text-h1 text-ink">Install</h2>
          <p className="mt-4 max-w-prose text-muted">
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
      </section>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-8 font-mono text-xs text-muted">
        <span>embertoast · MIT · Zana Salimi</span>
        <nav className="flex gap-5">
          <a className="hover:text-ember" href="https://github.com/zanasalimi/embertoast">
            GitHub
          </a>
          <a className="hover:text-ember" href="https://www.npmjs.com/package/@embertoast/react">
            npm
          </a>
        </nav>
      </footer>
    </main>
  );
}

function Capability({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

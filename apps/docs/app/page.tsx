import { Playground } from "@/components/playground";
import { CodeBlock } from "@/components/code-block";

/**
 * Home = the showcase. The hero IS the product: a live playground front and center.
 * Editorial layout — asymmetric, serif display + sans body, one ember accent, a
 * left-aligned masthead rather than a centered card stack. No gradient, no emoji grid.
 *
 * TODO(M6): flesh out sections (API tour, a11y note, install). This is the
 * structural skeleton; the playground is the focal point.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-editorial px-6 py-16 md:py-24">
      {/* Masthead — editorial, asymmetric */}
      <header className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            React · headless · zero-dep
          </p>
          <h1 className="mt-4 font-serif text-display text-ink">
            Toasts that
            <span className="text-ember"> behave</span>.
          </h1>
          <p className="mt-6 max-w-prose text-lede text-muted">
            Call <code className="font-mono text-ink">toast()</code> from anywhere —
            an event handler, a utility, a non-React module. One mounted{" "}
            <code className="font-mono text-ink">&lt;Toaster/&gt;</code> renders it.
            Promise-aware, swipe-dismissable, FLIP reflow, accessible.
          </p>
        </div>

        {/* The hero is interactive: real toasts fire from these controls. */}
        <Playground />
      </header>

      <hr className="my-16 border-rule" />

      {/* The API, shown not told — the README leads with capability, so does this. */}
      <section className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <h2 className="text-h1">The whole API is a function.</h2>
          <p className="mt-4 max-w-prose text-muted">
            It is a store, not a hook. That is why it works outside React render —
            and why a Vue or vanilla adapter is possible without rewriting the core.
          </p>
        </div>
        <CodeBlock
          lang="tsx"
          code={`import { toast, Toaster } from "@embertoast/react";

toast.success("Saved");
toast.promise(upload(file), {
  loading: "Uploading…",
  success: (r) => \`Uploaded \${r.name}\`,
  error: (e) => \`Failed: \${e.message}\`,
});

// once, near the root
<Toaster position="bottom-right" closeButton />`}
        />
      </section>
    </main>
  );
}

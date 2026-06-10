# Decision log (ADRs)

Each record states the context, the decision, its consequences (good and bad), and the alternatives weighed and rejected. They exist so the *why* survives the code.

---

## ADR-001: Headless core + styled adapter, not styled-only

Status: accepted · 2026-01

**Context.** The reference point (sonner) is opinionated-styled: beautiful out of the box, but you adopt its look. Plenty of consumers want the *behavior* — queueing, timers, swipe, FLIP, the a11y model — under their own markup and design system.

**Decision.** Ship both. A headless render path (`renderToast` on `<Toaster/>`, plus the raw store) gives full markup control; a batteries-included styled `<Toaster/>` themed via CSS variables covers the common case.

**Consequences.** + Serves both audiences from one core; demonstrates API-layer thinking, which is the point of the project. + The styled default is just a consumer of the headless path, so it can't drift from it. − Two supported surfaces to document and test. − The styled layer must be genuinely optional (no forced CSS import), which constrains how styles are delivered.

**Alternatives rejected.** *Styled-only* (simpler, but indistinguishable from the incumbent and less of a primitive). *Headless-only* (cleaner story, but most users want a good default and bounce off "bring everything yourself").

---

## ADR-002: Framework-agnostic external store + `useSyncExternalStore`, not React context

Status: accepted · 2026-01

**Context.** The defining requirement is that `toast()` works *outside* React render — from a utility, an interceptor, a non-React module. State also has to survive across an arbitrary tree without prop/context threading.

**Decision.** Keep toast state in a module-level, framework-free pub/sub store. React subscribes with `useSyncExternalStore`; `<Toaster/>` is purely a subscriber.

**Consequences.** + `toast()` is a plain function callable anywhere. + Concurrent-safe, tearing-free subscription with no extra dependency. + The store carries no React, so non-React adapters become possible. − A module singleton is global state; tests reset it with `store.dismiss()` and use the exported `createStore()` factory for fully isolated instances. − SSR needs a `getServerSnapshot` that returns a stable empty array so server and first client paint agree.

**Alternatives rejected.** *React context + reducer* (couples the producer to render; can't fire from outside React; provider threading). *A custom `useState` + event emitter* (reinvents `useSyncExternalStore` and risks tearing under concurrent React).

---

## ADR-003: CSS transitions + FLIP for reflow, not an animation library

Status: accepted · 2026-01

**Context.** The signature detail is stack reflow: remove a toast and the ones above must *slide*, not jump. This is the thing most clones get wrong. An animation library (framer-motion) would make it easy but adds tens of kilobytes to a library whose entire pitch is "tiny."

**Decision.** Animate enter/exit with CSS transitions. Handle reflow with **FLIP** (measure First and Last positions, apply an inverting transform, transition to identity) implemented by hand. Only `transform`/`opacity` animate.

**Consequences.** + Zero added bytes, 60fps on the compositor. + Full control over the reflow, which is the satisfying part. − FLIP is fiddly to implement correctly (measurement timing, interruption, reduced-motion). − We own the animation code rather than leaning on a maintained library. The render path is intentionally structured so framer-motion *could* slot in later for a consumer who wants it, without it being a dependency.

**Alternatives rejected.** *framer-motion* (great DX, wrong size budget for this library). *CSS-only with no FLIP* (enter/exit looks fine, but the reflow jumps — fails the core demo). *Web Animations API throughout* (more code than CSS transitions for the enter/exit case with no payoff here).

---

## ADR-004: Zero runtime dependencies

Status: accepted · 2026-01

**Context.** "Tiny" is a headline claim and a real value proposition for a primitive that lands in everyone's bundle. Dependencies undermine that and pull in transitive risk.

**Decision.** `@embertoast/core` has zero dependencies. `@embertoast/react` has zero runtime dependencies beyond `react`/`react-dom` as *peers*. Styling is plain CSS, not a CSS-in-JS runtime. The size budget is enforced by `size-limit` in CI with a public badge.

**Consequences.** + Predictable, minimal install footprint; nothing to audit transitively; a real number on the badge. + Forces simple, legible implementations. − We reimplement small utilities (id generation, FLIP) instead of pulling them in. − Contributors must justify any new `dependencies` entry (stated in CONTRIBUTING).

**Alternatives rejected.** *A small utility dep or two* ("it's only 2kB" compounds across a dependency tree and weakens the entire pitch). *CSS-in-JS for theming ergonomics* (runtime cost and an extra dependency for something CSS custom properties already do).

---

## ADR-005: Dual ESM + CJS via tsup

Status: accepted · 2026-01

**Context.** The package must drop cleanly into modern ESM toolchains *and* older CJS setups, with types, without a hand-rolled build.

**Decision.** Build with tsup (esbuild). Emit ESM + CJS + `.d.ts` per package, with a correct `exports` map and `sideEffects` configured for tree-shaking.

**Consequences.** + One fast build, both module systems, types included. + esbuild speed keeps the loop tight. − Dual-format means an `exports` map that must stay correct (import/require/types ordering); a mistake here breaks consumers silently. − Two output shapes to keep tree-shakeable.

**Alternatives rejected.** *ESM-only* (cleaner, but strands CJS consumers still in the ecosystem). *Rollup hand-config* (more control, more maintenance than this library needs). *tsc alone* (no bundling/treeshake control, slower to a dual format).

---

## ADR-006: changesets for versioning and release

Status: accepted · 2026-01

**Context.** Two packages versioned together, a changelog that reflects real changes, and an automated, provenance-backed publish — the "maintainer" signal. This should not be a manual `npm version` ritual.

**Decision.** Use changesets. Every change adds a changeset; merging the generated "Version Packages" PR bumps versions, writes each `CHANGELOG.md`, and publishes to npm with provenance via GitHub Actions. The two packages are a `fixed` group.

**Consequences.** + Semver + changelog + provenance, automated and auditable. + Contributors declare intent (the bump) at PR time. − A `fixed` group means both packages bump even if only one changed (accepted: they release in lockstep). − Requires an `NPM_TOKEN` secret and OIDC permissions in CI.

**Alternatives rejected.** *Manual `npm version` + hand-written changelog* (drifts, error-prone, no provenance story). *semantic-release* (powerful but commit-message-driven and heavier than a two-package monorepo needs; changesets' explicit per-PR notes read better).

---

## ADR-007: `aria-live` region with severity-based politeness, focus never stolen

Status: accepted · 2026-01

**Context.** Toasts are frequently inaccessible: silent to screen readers, or focus-stealing. Correct a11y is both the right thing and a concrete differentiator.

**Decision.** One `aria-live` region per `<Toaster/>`. Politeness follows severity — `error`/`warning` are assertive (`role="alert"`), everything else polite (`role="status"`) — overridable per toast. Mounting a toast never moves focus; toasts never trap it; `prefers-reduced-motion` collapses all animation to instant.

**Consequences.** + Genuinely accessible, and documented as a model rather than an accident. + Reduced-motion users get a fully functional, still-instant experience. − Announcement order and visual stack order must be managed separately. − Action buttons inside toasts need deliberate keyboard handling without focus theft, which is more work than auto-focusing.

**Alternatives rejected.** *Auto-focus the newest toast* (convenient for actions, but yanks focus from the user's task — disqualifying). *No live region* (visually fine, invisible to assistive tech). *Always-assertive* (over-interrupts for routine successes).

---

## ADR-008: pnpm + turbo monorepo with a split core/react

Status: accepted · 2026-01

**Context.** The headless-core decision (ADR-001/002) only pays off if the core is physically separable from React. The structure should also demonstrate scalable component architecture, not just assert it.

**Decision.** A pnpm-workspaces + turbo monorepo: `@embertoast/core`, `@embertoast/react`, and a `docs` app, with tests beside each package and turbo orchestrating build/test/typecheck/size across the graph.

**Consequences.** + The core/react boundary is enforced by package boundaries, not discipline. + turbo caches and parallelizes the task graph; the docs app builds against local packages. − More moving parts than a single package (workspace protocol, build ordering, `transpilePackages` in docs). − Publishing must build packages in dependency order before `changeset publish`.

**Alternatives rejected.** *Single package with subpath exports* (simpler to publish, but the core/react split becomes a convention instead of a boundary, and adapters get harder). *npm/yarn workspaces* (fine, but pnpm's strictness and disk model suit a zero-dep, size-conscious library better).

---

## ADR-009: Leave animation via a React presence layer, store removes synchronously

Status: accepted · 2026-01

**Context.** A dismissed toast should animate out, not vanish. The obvious implementation is to give the store an `exiting` flag and a deferred `remove(id)`: `dismiss` flips the flag, the renderer plays the exit, then calls `remove`. But that pushes animation timing — `animationend`, `prefers-reduced-motion`, a fallback timer — into the framework-free core, and it makes the store's snapshot lie (a dismissed toast lingers in state for the animation's duration).

**Decision.** Keep the store a clean, synchronous source of truth: `dismiss(id)` removes the toast immediately and the snapshot reflects exactly what is live. Implement the leave animation as a thin React **presence layer** (`use-presence.ts`) layered over the live snapshot in `<Toaster/>`. `usePresence` diffs the live list against the previous render, holds any id that just left in an `exiting` map, re-appends it to the rendered set (so FLIP survivors keep their slots), and retires it when `<ToastItem/>` reports `animationend` — backed by a timeout fallback so a `display:none`/backgrounded-tab case can never strand a ghost. A re-added id cancels its in-flight exit. Under `prefers-reduced-motion` there is no exit phase at all.

**Consequences.** + The core stays animation-agnostic and the snapshot never lies — `exiting` is a render state, not store state, which is where it belongs. + The fallback timer makes the exit robust against missing animation events. + The same presence set FLIP observes keeps reflow and exit from fighting. − The renderer holds a small amount of transient state (the `exiting` map) on top of the store, so "the renderer is purely a subscriber" carries an asterisk: it subscribes, plus it owns the exit-in-progress set. − Two clocks to reason about (the store timer and the presence fallback), which the fallback duration must be tuned against (`> --et-exit-duration`).

**Alternatives rejected.** *Store-owned `exiting` + `store.remove`* (leaks animation/DOM/motion-preference concerns into the framework-free core and makes the snapshot stale; rejected as a layering violation). *Hard-cut removal, no exit animation* (simplest, but the dismiss feels broken and the swipe-out has nothing to animate to). *A third-party presence library (e.g. framer-motion's `AnimatePresence`)* (solves it, but reintroduces the dependency ADR-004 exists to avoid).

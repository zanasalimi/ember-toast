# Roadmap

Honest status. Cut lines are explicit — what's deliberately *not* built, and why, is as much a part of this as what is.

## Shipped

Nothing is released yet. The first npm publish lands at the end of the MVP milestone below.

## In progress — MVP (the published v1.0 surface)

Building completely and polishing hard before the first release.

- [ ] **Core store** — pub/sub, id allocation, queue with max-visible overflow, per-toast timers with elapsed-based pause/resume. Unit-tested headless, no UI.
- [ ] **Imperative API** — `toast()`, `success`/`error`/`warning`/`info`/`loading`, `custom`, returns a stable id; `dismiss(id)` / `dismiss()`; update-in-place.
- [ ] **Promise API** — `toast.promise` morphs one toast through loading → success → error in place.
- [ ] **React render** — `<Toaster/>`, `<ToastItem/>`, six positions, stacking, configurable order, enter/exit animation.
- [ ] **FLIP reflow** — survivors slide when a toast is removed (the signature detail).
- [ ] **Dismissal** — auto-dismiss, pause-on-hover, pause-on-window-blur, swipe-to-dismiss, click, close button.
- [ ] **Accessibility** — single `aria-live` region, role by severity, never steals focus, `prefers-reduced-motion` honored.
- [ ] **Headless + styled** — `renderToast` escape hatch alongside the CSS-variable-themed default.
- [ ] **Custom JSX toasts** — `toast(<MyComponent/>)`.
- [ ] **TypeScript** — full, strict, exported types.
- [ ] **Packaging** — tsup dual ESM/CJS + `.d.ts`, `sideEffects` configured, `size-limit` gate, changesets release with provenance.
- [ ] **Docs site** — Next.js + shadcn editorial docs with the live playground as the hero; dogfoods the library.

## Planned — v1.x

- Action + cancel buttons (`{ action: { label, onClick }, cancel }`), keyboard-reachable without focus theft.
- Rich colors / themes, dark mode, documented theme tokens.
- Infinite/persistent toasts and programmatic progress.
- Hover-to-expand a collapsed stack (collapsed → fanned), like sonner.

## Deferred — v2 / stretch (named, not built)

These are intentionally out of scope for now. The architecture leaves room for them; shipping them is not on the near path.

- **Vanilla JS + Vue/Svelte adapters** from the shared core. The core is already framework-free to make this *possible*; building and maintaining additional renderers is a separate commitment, deferred until the React surface is proven.
- **Toast history / notification center.** A persistent log of past toasts is a different product surface (storage, read state, a panel UI) and out of scope for a notification primitive.

## Non-goals

- A general animation framework. FLIP + CSS transitions cover the reflow; we won't grow an animation API.
- Built-in i18n, sound, or analytics. These belong in the consumer's `custom` toast or callbacks, not the core.
- Runtime dependencies. The zero-dep constraint is permanent, not a phase.

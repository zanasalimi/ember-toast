# Features

The complete behavioral spec. Every method, option, state, gesture, edge case, and acceptance criterion. Grouped by area; each item tiered **MVP** / **v1** / **v2**.

Tier legend: **MVP** = in the first published release · **v1** = a later 1.x minor · **v2** = deferred, named, not built.

States vocabulary used throughout: `idle` (no toasts), `entering`, `visible`, `paused`, `exiting`, `queued`, `removed`.

---

## 1. Imperative API

### 1.1 `toast(message, options?)` — **MVP**
- Creates a `default` toast. Returns a stable string `id` synchronously.
- `message` is `ReactNode`: a string, or arbitrary JSX (see Custom toasts).
- Callable from anywhere — event handler, utility, interceptor, non-React module. Does not require being inside React render.
- **Edge cases:** called before any `<Toaster/>` is mounted → the toast is held in the store and appears when a `<Toaster/>` mounts (no crash, no drop). Called during SSR → no-op visually; the server snapshot is empty.
- **Acceptance:** id is unique per call; calling 1,000 times does not leak timers; return value usable immediately in `dismiss(id)`.

### 1.2 Severity variants — **MVP**
`toast.success`, `toast.error`, `toast.warning`, `toast.info`, `toast.loading`. Same signature as `toast()`.
- Each sets `type`, which drives default duration, default `aria-live` politeness, default icon (styled layer), and default color (styled layer).
- `loading` defaults to `duration: Infinity` (pinned open until updated or dismissed).
- **Acceptance:** each variant tags the toast type; `error`/`warning` announce assertively; `loading` does not auto-dismiss.

### 1.3 `toast.custom(content, options?)` — **MVP**
- Renders arbitrary JSX as the whole toast body, bypassing the styled chrome.
- Still participates in stacking, positioning, timers, swipe, and the live region.
- **Edge cases:** content that throws on render is contained to its item, not the whole stack (error boundary around each item — v1 hardening). Interactive content inside is keyboard-reachable but must not steal focus.
- **Acceptance:** a custom toast stacks and dismisses like any other; its content receives no forced styling.

### 1.4 Return value / id — **MVP**
- Every creator returns the `id`. Passing `{ id }` in options to a creator updates the existing toast instead of creating one (upsert).
- **Acceptance:** `toast("a", { id: "x" })` then `toast.success("b", { id: "x" })` results in one toast that is now a success reading "b".

---

## 2. Promise API

### 2.1 `toast.promise(promise, messages, options?)` — **MVP**
- Shows a single `loading` toast, then morphs the *same* toast (same id, same DOM node) to `success` or `error` when the promise settles. No flit, no replace.
- `messages.loading`: `ReactNode`.
- `messages.success`: `ReactNode` or `(data) => ReactNode`.
- `messages.error`: `ReactNode` or `(error) => ReactNode`.
- Returns the original promise (resolved or rejected) so callers can chain/await.
- After settling, applies a normal auto-dismiss duration (success/error defaults, or `options.duration`).
- **States:** `loading` (pinned) → `success` | `error` (auto-dismiss).
- **Edge cases:** promise that never settles → toast stays in `loading` (by design; pin is intentional). Promise rejects with a non-Error → the `error` resolver still receives it. Component unmounts mid-flight → the store keeps the toast; the resolver still runs.
- **Acceptance:** exactly one toast id exists across the whole lifecycle; the success/error resolver receives the settled value; the returned promise mirrors the input.

### 2.2 Promise with manual id / update — **v1**
- Passing `{ id }` lets `toast.promise` adopt and morph an existing toast (e.g. a pre-existing loading toast).

---

## 3. Control & Update

### 3.1 `toast.dismiss(id)` — **MVP**
- Begins the exit animation for one toast, then removes it; fires `onDismiss`.
- **Edge cases:** unknown id → no-op (no throw). Called on an already-`exiting` toast → ignored.

### 3.2 `toast.dismiss()` (all) — **MVP**
- Dismisses every visible and queued toast.
- **Acceptance:** after the exit transitions, the store is `idle`.

### 3.3 `toast.update(id, patch)` — **MVP**
- Patches content, type, duration, action, className, etc. on an existing toast in place.
- Updating `duration` restarts the timer from the new value; updating to `Infinity` pins it.
- **Edge cases:** unknown id → no-op.

### 3.4 Callbacks — **MVP**
- `onDismiss(id)` — fires when removed by gesture, button, or `dismiss()`.
- `onAutoClose(id)` — fires when removed because the duration elapsed.
- **Acceptance:** exactly one of the two fires per removal, matching the cause.

---

## 4. Stacking & Queue

### 4.1 Stacking — **MVP**
- Multiple toasts stack with a configurable `gap`.
- `order`: `newest-on-top` (default) or `newest-on-bottom`.

### 4.2 Max-visible + overflow queue — **MVP**
- `maxVisible` (default 3) caps rendered toasts; the rest go to `queued`.
- When a visible toast is removed, the next queued toast promotes (entering animation).
- **States:** a queued toast is `queued` → `entering` on promotion.
- **Edge cases:** `maxVisible: 0` → everything queues (degenerate but defined). A burst of N toasts with N > maxVisible → only `maxVisible` render; FIFO promotion.
- **Acceptance:** rendered count never exceeds `maxVisible`; promotion order is deterministic.

### 4.3 Hover-to-expand collapsed stack — **v1**
- Collapsed stack (toasts overlapped) expands/fans on hover, like sonner. Reverts on leave. Respects reduced-motion.

---

## 5. Positioning

### 5.1 Six positions — **MVP**
- `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- Set globally on `<Toaster position>`; per-toast `options.position` overrides.
- Stack growth direction follows the anchor (top positions grow downward, bottom upward).

### 5.2 Per-toast position override — **MVP**
- A toast with its own `position` renders in that position's stack, independent of the global one.
- **Edge cases:** mixing positions → each position maintains its own ordered stack and live-region grouping.

### 5.3 Offset / safe-area — **v1**
- `offset` prop (px or CSS length) and `env(safe-area-inset-*)` awareness for mobile notches.

---

## 6. Dismissal & Gestures

### 6.1 Auto-dismiss with duration — **MVP**
- Per-type defaults: success/info/default 4000ms, warning 5000ms, error 6000ms, loading `Infinity`.
- `options.duration` overrides; `Infinity` pins open.
- **Acceptance:** a toast removes itself within ~1 frame of its duration elapsing (timers track elapsed, not naive `setTimeout` drift).

### 6.2 Pause on hover — **MVP**
- Pointer over the stack pauses *all* visible timers; leaving resumes from the captured remaining time.
- **States:** `visible` → `paused` → `visible`.
- **Acceptance:** hovering through the full duration never dismisses; remaining time is preserved precisely across pause/resume.

### 6.3 Pause on window blur — **MVP**
- When the tab/window loses focus (or visibility), timers pause; resume on focus/visible.
- **Edge cases:** returning to a backgrounded tab does not instantly flush every toast (paused time doesn't count).

### 6.4 Swipe-to-dismiss — **MVP**
- Pointer/touch drag along the dismiss axis. Past a distance **or** velocity threshold → fling out and remove. Under threshold → snap back to rest.
- Default threshold: ~45px distance or a velocity floor (tunable via `swipeThreshold`).
- Direction follows position (e.g. bottom-right swipes right).
- **States:** `visible` → (dragging) → `exiting` (past threshold) | `visible` (snap back).
- **Edge cases:** `dismissible: false` → drag is inert. `prefers-reduced-motion` → no transform animation; past-threshold release removes instantly, under-threshold does nothing. Multi-touch / interrupted pointer → cancel cleanly, snap back.
- **Acceptance:** Playwright-verified in chromium, webkit, and mobile-safari.

### 6.5 Click & close button — **MVP**
- `closeButton` renders an accessible dismiss control (`aria-label`).
- Click-to-dismiss is opt-in per the styled default; the close button is always keyboard-operable.

### 6.6 `dismissible: false` — **MVP**
- Disables swipe, click, and close button for a toast (e.g. a blocking loading state). Programmatic `dismiss(id)` still works.

---

## 7. Animation / FLIP

### 7.1 Enter / exit transitions — **MVP**
- Enter: translate + fade in from the anchor edge. Exit: collapse height + fade out.
- CSS transitions only; durations are theme tokens.

### 7.2 FLIP stack reflow — **MVP**
- When a toast is removed from the middle/top of a stack, survivors **slide** into the freed space instead of jumping.
- Implementation: measure First rects → let layout settle → measure Last → apply inverting `transform` → transition to identity. Only `transform`/`opacity` animate.
- **Edge cases:** rapid successive removals → FLIP must handle interruption (re-measure, don't stack transforms). New toast entering while another exits → both animations coexist without fighting.
- **Acceptance:** 60fps on the compositor; no layout thrash per frame; visually no jump. This is the signature demo.

### 7.3 Height transitions for variable content — **MVP**
- Toasts of differing heights reflow smoothly; height is measured, not assumed.

### 7.4 Reduced-motion path — **MVP**
- `prefers-reduced-motion: reduce` collapses all enter/exit/FLIP/swipe animation to instant. The library remains fully functional.
- **Acceptance:** with reduced motion, toasts appear/disappear instantly with no transform animation, and the stylesheet zeroes durations.

### 7.5 Optional animation-library slot — **v2**
- The render path is structured so a consumer could opt into framer-motion. Not a dependency; not built.

---

## 8. Accessibility

### 8.1 Single live region — **MVP**
- One `aria-live` region per `<Toaster/>`; toasts are announced through it.
- Visual stack order and announcement order are managed independently.

### 8.2 Role / politeness by severity — **MVP**
- `error`/`warning` → `role="alert"`, assertive (interrupts).
- `default`/`success`/`info`/`loading` → `role="status"`, polite.
- `options.ariaLive` overrides per toast; `"off"` suppresses announcement.

### 8.3 No focus theft — **MVP**
- Mounting a toast never moves focus. Toasts never trap focus.
- **Acceptance:** `document.activeElement` is unchanged across a toast mount.

### 8.4 Keyboard-operable controls — **MVP**
- Close button and action button are reachable and operable by keyboard without the toast stealing focus on mount.

### 8.5 Reduced-motion honored — **MVP**
- See 7.4. A11y and motion preferences are first-class, not bolted on.

### 8.6 Screen-reader correctness — **MVP**
- Announced text is the toast's message; decorative icons are `aria-hidden`; the close control has a label. Verified with a screen reader before release.

### 8.7 High-contrast / forced-colors — **v1**
- `forced-colors` media query support in the styled default.

---

## 9. Theming / Headless

### 9.1 Headless render path — **MVP**
- `renderToast(toast) => ReactNode` on `<Toaster/>` takes over body markup while keeping container, positioning, timers, gestures, and a11y.
- The raw store + `useToasts` allow a fully custom renderer.

### 9.2 Styled default via CSS variables — **MVP**
- Opt-in stylesheet (`@embertoast/react/styles.css`). Themed entirely through documented custom properties (`--et-*`): width, gap, radius, surface colors, severity accents, motion timings.
- No CSS-in-JS runtime. Not importing the CSS leaves the toasts unstyled (headless).

### 9.3 `theme` prop — **MVP**
- `light` | `dark` | `system`. `system` follows `prefers-color-scheme`.

### 9.4 `richColors` — **v1**
- Stronger per-severity background/foreground in the styled default.

### 9.5 `className` / per-toast styling — **MVP**
- `options.className` and `<Toaster className>` for targeted overrides.

### 9.6 Action / cancel buttons — **v1**
- `options.action = { label, onClick }` and `options.cancel`. Rendered accessibly in the styled default.

---

## 10. TypeScript

### 10.1 Full strict types — **MVP**
- Everything public is typed and exported: `toast` (callable + methods), `ToastOptions`, `Toast`, `ToastType`, `Position`, `AriaLive`, `ToastAction`, `PromiseMessages<T>`, `ToasterProps`, `ToastState`, `ToasterConfig`.
- `toast.promise<T>` infers the resolved type into the `success` resolver.
- No `any` in the public surface.

### 10.2 Generic promise inference — **MVP**
- `toast.promise(fetchUser())` types the `success(data)` resolver's `data` as the awaited return type.

### 10.3 Emitted declarations — **MVP**
- `.d.ts` shipped for both ESM and CJS via tsup; `exports` map orders `types` first.
- **Acceptance:** `tsc` against the built package resolves all public types with no `skipLibCheck` crutch needed by consumers.

---

## 11. Packaging & DX (cross-cutting)

### 11.1 Dual ESM/CJS — **MVP**
- Correct `exports` map; both formats tree-shakeable; `sideEffects: false` on core, CSS-scoped on react.

### 11.2 Size budget — **MVP**
- `size-limit` gate in CI: core ≤ ~2kB, react binding ≤ ~5kB (min+gzip), with a public badge.

### 11.3 SSR / RSC safety — **MVP**
- `getServerSnapshot` returns empty; no `window`/`document` access at module load; the React entry is client-safe to import from a server component (renderer is a client component).

### 11.4 Provenance publish — **MVP**
- changesets → npm publish with provenance and a generated per-package changelog.

---

## Acceptance summary (release gate)

A release is cut only when: the core is unit-tested headless; `<Toaster/>` works in a fresh React app from a docs copy-paste; FLIP reflow, swipe, promise morph, and pause-on-hover all work (Playwright green across chromium/webkit/mobile-safari); a11y verified with a screen reader (announcement, no focus theft, reduced-motion); `size-limit` passes under target; and the docs site is live with a working playground.

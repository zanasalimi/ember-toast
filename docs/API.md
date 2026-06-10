# API

The public surface shipped from `@embertoast/react` (with the framework-agnostic parts re-exported from `@embertoast/core`). Lines tagged **Planned** are not in the published surface yet — they are tracked in [`ROADMAP.md`](./ROADMAP.md) and called out where they appear.

```tsx
import { toast, Toaster } from "@embertoast/react";
import "@embertoast/react/styles.css"; // omit for headless
```

Everything documented below without a **Planned** tag is exported and verifiable against the built declarations (`packages/react/dist/index.d.ts`).

---

## `toast`

A callable function with methods attached. It is a store, not a hook — call it from anywhere.

```ts
const id = toast(message, options?): ToastId;

toast.success(message, options?): ToastId;
toast.error(message, options?): ToastId;
toast.warning(message, options?): ToastId;
toast.info(message, options?): ToastId;
toast.loading(message, options?): ToastId; // duration defaults to Infinity

toast.custom(content, options?): ToastId;  // arbitrary JSX body

toast.promise<T>(promise, messages, options?): Promise<T>;

toast.dismiss(id?): void;                  // one, or all when omitted
toast.update(id, patch): void;             // patch an existing toast in place
```

- `message` / `content`: `ReactNode` (string or JSX).
- Every creator returns a stable string `id`. Passing `{ id }` in `options` upserts (updates an existing toast instead of creating one).

### `toast.promise`

```ts
toast.promise(uploadFile(file), {
  loading: "Uploading…",
  success: (res) => `Uploaded ${res.name}`,
  error: (err) => `Failed: ${err.message}`,
});
```

```ts
interface PromiseMessages<T> {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
}
```

Shows one toast in `loading`, then morphs the same toast (same id, same DOM node) to `success`/`error` when the promise settles. Returns the original promise.

---

## `ToastOptions`

Accepted by every creator and (as a partial) by `update`.

```ts
interface ToastOptions {
  /** Provide to update an existing toast in place instead of creating one. */
  id?: string;
  /** ms before auto-dismiss. `Infinity` pins open. Defaults are per-type. */
  duration?: number;
  position?: Position;
  /** Whether user gestures (swipe/click/close) can dismiss it. Default true. */
  dismissible?: boolean;
  /** Action button (styled default / custom render). */
  action?: { label: string; onClick: () => void };
  className?: string;
  /** Override announcement politeness. Defaults follow severity. */
  ariaLive?: "polite" | "assertive";
  onDismiss?: (id: string) => void;   // removed by gesture/button/dismiss()
  onAutoClose?: (id: string) => void; // removed because duration elapsed
}
```

> **Planned (v1.x):** a `cancel?: { label: string; onClick: () => void }` button alongside `action`. Not in the shipped `ToastOptions` — see [`ROADMAP.md`](./ROADMAP.md).

### Per-type duration defaults

| Type | Default duration |
|---|---|
| `default`, `success`, `info` | 4000ms |
| `warning` | 5000ms |
| `error` | 6000ms |
| `loading` | `Infinity` (pinned) |

---

## `<Toaster/>`

Mount once near the app root. The single subscriber that renders the stack.

```tsx
<Toaster position="bottom-right" closeButton theme="system" />
```

```ts
interface ToasterProps {
  /** Default position for toasts that don't specify one. Default "bottom-right". */
  position?: Position;
  /** Render a per-toast dismiss button in the styled default. */
  closeButton?: boolean;
  /** Stronger severity-tinted styling in the default theme. */
  richColors?: boolean;
  /** Color scheme for the styled default. `'system'` defers to the OS. Default "system". */
  theme?: "light" | "dark" | "system";
  /** Max toasts shown per position; the rest queue. Default 3. */
  visibleToasts?: number;
  /** Pixel gap between stacked toasts. */
  gap?: number;
  /** Offset of the stack from the viewport edge, in px. */
  offset?: number;
  /** Expand a collapsed stack on hover. Drives a `data-expand` attribute. Default true. */
  expand?: boolean;
  /** Extra class on each region container. */
  className?: string;
}
```

> **Planned:** a `toastOptions` prop (per-`<Toaster/>` default options applied to every toast) is deferred — see [`ROADMAP.md`](./ROADMAP.md). Pause-on-hover and pause-on-window-blur are part of the default dismissal behavior rather than `<Toaster/>` props.

---

## `useToasts`

Subscribe to the live toast list from a custom renderer. Returns `Toast[]` directly.

```ts
function useToasts(): Toast[];
```

---

## Types

```ts
type ToastId = string;

type ToastType =
  | "default" | "success" | "error"
  | "warning" | "info" | "loading" | "custom";

type Position =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

type AriaLive = "polite" | "assertive";
```

`Toast` (the resolved shape — `ToastOptions` with `id`, `type`, `message`, `createdAt`, and resolved `duration`/`position`) is exported too, along with `ToastAction`, `ToastContent`, and `PromiseMessages<T>`. For the full definitions see [`packages/core/src/types.ts`](../packages/core/src/types.ts).

The react package additionally exports the lower-level pieces a custom renderer may want: `ToastItem` / `ToastItemProps`, `roleForToast`, `useSwipe` / `useFlip`, and the swipe types `SwipeGesture` / `SwipeThreshold` / `SwipeHandlers`.

---

## Headless usage

There is no `renderToast` prop. To take over the markup, build a custom renderer against the store using the real exports — `useToasts` plus `toast`:

```tsx
import { useToasts, toast, roleForToast } from "@embertoast/react";

function MyToaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} role={roleForToast(t)}>
          {t.message as React.ReactNode}
          {t.dismissible !== false && (
            <button onClick={() => toast.dismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

`toast.message` is the renderable body you passed in (`ReactNode` in the react package). `roleForToast` returns `"alert"` for `error`/`warning` and `"status"` otherwise, matching the styled default's a11y contract.

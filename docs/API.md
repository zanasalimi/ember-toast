# API

The complete public surface. Everything here is exported from `@embertoast/react` (and the relevant parts re-exported from `@embertoast/core`).

```tsx
import { toast, Toaster } from "@embertoast/react";
import "@embertoast/react/styles.css"; // omit for headless
```

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
  /** Cancel button (v1). */
  cancel?: { label: string; onClick: () => void };
  className?: string;
  /** Override announcement politeness. Defaults follow severity. */
  ariaLive?: "polite" | "assertive" | "off";
  onDismiss?: (id: string) => void;   // removed by gesture/button/dismiss()
  onAutoClose?: (id: string) => void; // removed because duration elapsed
}
```

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
  position?: Position;                       // default "bottom-right"
  maxVisible?: number;                       // default 3; rest queue
  duration?: number;                         // default auto-dismiss; per-toast overrides
  gap?: number;                              // px between stacked toasts
  pauseOnHover?: boolean;                    // default true
  pauseOnWindowBlur?: boolean;               // default true
  expand?: boolean;                          // hover-expand collapsed stack (v1)
  closeButton?: boolean;                     // per-toast close control (styled default)
  richColors?: boolean;                      // stronger severity colors (v1)
  theme?: "light" | "dark" | "system";
  ariaLive?: "polite" | "assertive" | "off"; // default politeness; per-toast overrides
  offset?: string | number;                  // distance from the viewport edge
  className?: string;
  /** Headless escape hatch: render the body yourself. */
  renderToast?: (toast: Toast) => ReactNode;
}
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

type AriaLive = "polite" | "assertive" | "off";
```

`Toast` (the resolved shape passed to `renderToast`), `ToastState`, and `ToasterConfig` are also exported for headless renderers — see [`packages/core/src/types.ts`](../packages/core/src/types.ts).

---

## Headless usage

Take over the markup while keeping behavior:

```tsx
<Toaster
  renderToast={(t) => (
    <div className="my-toast" data-type={t.type}>
      {t.content}
    </div>
  )}
/>
```

Or build a fully custom renderer against the store:

```tsx
import { useToasts, toast } from "@embertoast/react";

function MyToaster() {
  const { toasts } = useToasts();
  return (
    <div aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} role={t.type === "error" ? "alert" : "status"}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
```

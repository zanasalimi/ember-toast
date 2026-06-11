/**
 * Public type surface for the framework-agnostic core.
 *
 * The renderer (e.g. `@embertoast/react`) consumes these; consumers of the library
 * import the curated subset re-exported from the binding package.
 *
 * The core treats a toast body opaquely (`message: unknown`) so it never depends on
 * React or the DOM. The renderer narrows it (to `ReactNode`, etc.) at its boundary.
 */

export type ToastId = string;

export type ToastType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "custom";

export type Position = `${"top" | "bottom"}-${"left" | "center" | "right"}`;

export type AriaLive = "polite" | "assertive";

/** A renderable toast body. The core treats this opaquely; the renderer decides what it means. */
export type ToastContent = unknown;

/**
 * The static (non-resolver) form of a promise message.
 *
 * Spans the same value space as {@link ToastContent} (any renderable body — string,
 * number, JSX, object, null/undefined) but is deliberately *not* the bare `unknown`.
 * A union member of `unknown` swallows the whole union, so `ToastContent | ((data: T) => …)`
 * would collapse to `unknown` and strip the resolver arm — leaving `data` untyped (`any`).
 * Keeping this arm as `{} | null | undefined` preserves the callable arm so `success`/`error`
 * resolvers get their parameter contextually typed from the promise.
 */
export type StaticToastContent = {} | null | undefined;

export interface ToastAction {
  label: string;
  onClick: () => void;
  /** Underlined text link (the default) or a filled button (e.g. an "Undo"). */
  variant?: "link" | "button";
}

/** Per-toast options accepted by every facade method. */
export interface ToastOptions {
  /** Provide to update an existing toast in place instead of creating one. */
  id?: ToastId;
  /** Milliseconds before auto-dismiss. `Infinity` pins the toast open. */
  duration?: number;
  position?: Position;
  /** Whether the toast can be dismissed by user gesture (swipe/click/close). */
  dismissible?: boolean;
  action?: ToastAction;
  /** Bold heading rendered above the body. */
  title?: ToastContent;
  /** De-emphasized line under the body. A number is treated as epoch-ms and formatted by the renderer; a string is shown verbatim. */
  timestamp?: number | string;
  /** Action row. Renders middot-separated links, or a filled button per `variant`. Takes precedence over `action`. */
  actions?: ToastAction[];
  /** Small muted hint line beneath the actions (e.g. "This message will close in 4 seconds. Click to stop."). */
  footer?: ToastContent;
  /** Determinate progress in [0,1]. Renders a filled bar at the bottom edge (e.g. an upload). Patch it with `toast.update(id, { progress })`; set to `undefined` to clear the bar (e.g. on completion). */
  progress?: number | undefined;
  /** Render the auto-dismiss countdown as a depleting bar at the bottom edge. Ignored when `progress` is set or `duration` is Infinity. */
  timerBar?: boolean;
  className?: string;
  /** Override the announcement politeness. Defaults follow severity. */
  ariaLive?: AriaLive;
  onDismiss?: (id: ToastId) => void;
  onAutoClose?: (id: ToastId) => void;
}

/** A toast as the renderer sees it — options resolved, timing defaults applied. */
export interface Toast extends ToastOptions {
  id: ToastId;
  type: ToastType;
  /** The renderable body. `unknown` in core; `ReactNode` in the react package. */
  message: ToastContent;
  createdAt: number;
  /** Resolved auto-dismiss duration (default applied). `Infinity` = persistent. */
  duration: number;
  /** The toast's pinned corner, if it set one. Undefined inherits the mounted `<Toaster position>`. */
  position?: Position;
  /** True while this toast's auto-dismiss timer is paused (hover / window blur). */
  paused: boolean;
  /** Height measured by the renderer for stacking / FLIP. */
  height?: number;
}

/**
 * Resolvers for `toast.promise`. Each may be a static value or a function of the settled
 * result. The static arm is {@link StaticToastContent} (not bare `unknown`) so the resolver
 * arm survives the union and `data`/`error` infer from the promise — see that type's note.
 */
export interface PromiseMessages<T> {
  loading: ToastContent;
  success: StaticToastContent | ((data: T) => ToastContent);
  error: StaticToastContent | ((error: unknown) => ToastContent);
}

/** A snapshot subscriber callback. Receives no arguments — pull state via `getSnapshot`. */
export type Listener = () => void;
export type Unsubscribe = () => void;

/** The framework-agnostic store contract a renderer subscribes to. */
export interface ToastStoreApi {
  subscribe(listener: Listener): Unsubscribe;
  /** Current toast list. Referentially stable between mutations so `useSyncExternalStore` can diff by reference. */
  getSnapshot(): Toast[];
  /** Server snapshot for SSR — always the same empty array so markup matches first client paint. */
  getServerSnapshot(): Toast[];
  /** Create or, when `opts.id` matches an existing toast, update in place. Returns the id. */
  add(opts: Partial<Toast> & { message: ToastContent }): ToastId;
  /** Patch an existing toast in place. Re-arms the auto-dismiss timer if `duration` changes. */
  update(id: ToastId, patch: Partial<Toast>): void;
  /** Remove one toast, firing its `onDismiss`. `undefined` clears all. */
  dismiss(id?: ToastId): void;
  /** Pause a single toast's auto-dismiss timer, capturing remaining time. */
  pause(id: ToastId): void;
  /** Resume a paused timer from its captured remaining time. */
  resume(id: ToastId): void;
  /** Record a renderer-measured height for stacking / FLIP. */
  setHeight(id: ToastId, height: number): void;
}

/**
 * Public type surface for the framework-agnostic core.
 *
 * The renderer (e.g. `@embertoast/react`) consumes these; consumers of the library
 * import the curated subset re-exported from the binding package.
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

export type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AriaLive = "polite" | "assertive" | "off";

/** A renderable toast body. The core treats this opaquely; the renderer decides what it means. */
export type ToastContent = unknown;

export interface ToastAction {
  label: string;
  onClick: (event?: unknown) => void;
}

/** Per-toast options accepted by every facade method. */
export interface ToastOptions {
  /** Provide to update an existing toast in place instead of creating one. */
  id?: ToastId;
  /** Milliseconds before auto-dismiss. `Infinity` pins the toast open. Defaults are per-type. */
  duration?: number;
  position?: Position;
  /** Whether the toast can be dismissed by user gesture (swipe/click/close). Default `true`. */
  dismissible?: boolean;
  action?: ToastAction;
  cancel?: ToastAction;
  className?: string;
  /** Override the announcement politeness. Defaults follow severity (error → assertive). */
  ariaLive?: AriaLive;
  onDismiss?: (id: ToastId) => void;
  onAutoClose?: (id: ToastId) => void;
}

/** A toast as the renderer sees it — options resolved, timing state materialized. */
export interface Toast {
  id: ToastId;
  type: ToastType;
  content: ToastContent;
  createdAt: number;
  duration: number;
  position: Position;
  dismissible: boolean;
  ariaLive: AriaLive;
  action?: ToastAction;
  cancel?: ToastAction;
  className?: string;
  /** Lifecycle phase used by the renderer to drive enter/exit animation. */
  phase: "entering" | "visible" | "exiting";
  /** True while a timer is paused (hover / window blur). */
  paused: boolean;
  /** Remaining auto-dismiss time, in ms, captured at the last pause. */
  remaining: number;
  onDismiss?: (id: ToastId) => void;
  onAutoClose?: (id: ToastId) => void;
}

/** Resolvers for `toast.promise`. Each may be a static value or a function of the settled result. */
export interface PromiseMessages<T> {
  loading: ToastContent;
  success: ToastContent | ((data: T) => ToastContent);
  error: ToastContent | ((error: unknown) => ToastContent);
}

/** Snapshot the renderer subscribes to. Immutable per emit so `useSyncExternalStore` can diff by reference. */
export interface ToastState {
  /** Currently visible toasts, render order resolved (respects stack direction). */
  toasts: readonly Toast[];
  /** Toasts waiting behind the max-visible limit. */
  queued: readonly Toast[];
}

export type Listener = (state: ToastState) => void;
export type Unsubscribe = () => void;

/** Store-level configuration, set once by the mounted renderer. */
export interface ToasterConfig {
  position: Position;
  /** Maximum toasts rendered at once; the remainder queue. */
  maxVisible: number;
  /** `"newest-on-top"` reverses render order. */
  order: "newest-on-top" | "newest-on-bottom";
  duration: number;
  gap: number;
  pauseOnHover: boolean;
  pauseOnWindowBlur: boolean;
}

/**
 * The toast store: a tiny pub/sub holding all toast state.
 *
 * This is the single source of truth, deliberately framework-free. A renderer
 * subscribes via `subscribe`/`getSnapshot` (in React, through `useSyncExternalStore`).
 * Timers, queueing, and pause/resume all live here so that the imperative `toast()`
 * facade can mutate state from anywhere — inside or outside a component tree.
 */

import type {
  Listener,
  Toast,
  ToastId,
  ToastOptions,
  ToastState,
  ToasterConfig,
  Unsubscribe,
} from "./types";

export const DEFAULT_CONFIG: ToasterConfig = {
  position: "bottom-right",
  maxVisible: 3,
  order: "newest-on-top",
  duration: 4000,
  gap: 14,
  pauseOnHover: true,
  pauseOnWindowBlur: true,
};

/** Per-type default auto-dismiss durations (ms). `loading` pins open until resolved. */
export const DURATION_BY_TYPE: Record<string, number> = {
  default: 4000,
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
  loading: Infinity,
};

export interface ToastStore {
  subscribe(listener: Listener): Unsubscribe;
  getSnapshot(): ToastState;
  /** Server snapshot for SSR — always empty so markup matches first client paint. */
  getServerSnapshot(): ToastState;

  /** Create or, when `options.id` matches an existing toast, update in place. Returns the id. */
  add(content: unknown, type: Toast["type"], options?: ToastOptions): ToastId;
  update(id: ToastId, patch: Partial<Toast>): void;
  /** Begin exit animation, then remove after the transition. `undefined` dismisses all. */
  dismiss(id?: ToastId): void;
  /** Remove immediately, skipping exit animation (called once the renderer signals exit complete). */
  remove(id: ToastId): void;

  /** Pause a single toast's timer, or all timers when `id` is omitted (hover / blur). */
  pause(id?: ToastId): void;
  resume(id?: ToastId): void;

  configure(partial: Partial<ToasterConfig>): void;
  getConfig(): ToasterConfig;

  /** Test/teardown helper: clear all toasts and timers without animation. */
  reset(): void;
}

/**
 * Construct an isolated store. The package exports one shared singleton (below),
 * but tests instantiate their own to stay hermetic.
 *
 * TODO(M1): id allocation + insertion, max-visible split into toasts/queued.
 * TODO(M1): timer scheduling with elapsed tracking; pause stores `remaining`, resume restarts.
 * TODO(M1): pauseOnWindowBlur wiring (visibilitychange / blur listeners, guarded for SSR).
 * TODO(M2): two-phase dismiss (mark `exiting`, await renderer, then `remove`).
 */
export function createToastStore(initial?: Partial<ToasterConfig>): ToastStore {
  void initial;
  throw new Error("TODO(M1): createToastStore not implemented");
}

/** The shared store backing the singleton `toast()` facade. */
export const store: ToastStore = /* TODO(M1) */ createToastStore();

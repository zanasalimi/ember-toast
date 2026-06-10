/**
 * The toast store: a tiny pub/sub holding all toast state.
 *
 * This is the single source of truth, deliberately framework-free. A renderer
 * subscribes via `subscribe`/`getSnapshot` (in React, through `useSyncExternalStore`).
 * Timers and pause/resume all live here so the imperative `toast()` facade can mutate
 * state from anywhere — inside or outside a component tree.
 *
 * No React, no DOM. Timing uses `setTimeout`/`Date.now`, which are universally available.
 */

import type { Listener, Toast, ToastId, ToastStoreApi } from "./types";

/**
 * Minimal ambient timer signatures. `setTimeout`/`clearTimeout` are host primitives
 * present in every JS runtime (browser, Node, Deno, workers). Declaring them here keeps
 * the core free of both the DOM lib and `@types/node`, preserving its zero-dependency,
 * framework-free contract. The handle is opaque — we only pass it back to `clearTimeout`.
 */
declare function setTimeout(handler: () => void, timeout: number): TimerHandle;
declare function clearTimeout(handle: TimerHandle): void;
type TimerHandle = { readonly __timer: unique symbol };

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION = "bottom-right" as const;

/** A single shared empty array so the server snapshot is referentially stable across calls. */
const EMPTY: Toast[] = [];

let counter = 0;
const genId = (): string => `et_${Date.now().toString(36)}_${(counter++).toString(36)}`;

/** Per-toast timer bookkeeping for precise pause/resume (elapsed accounting). */
interface TimerRec {
  handle: TimerHandle | null;
  /** Remaining ms until auto-dismiss; decremented on each pause. */
  remaining: number;
  /** When the current run started (for computing elapsed on pause). */
  startedAt: number;
}

/**
 * Construct an isolated store. The package exports one shared singleton (below),
 * but tests instantiate their own to stay hermetic.
 */
export function createStore(): ToastStoreApi {
  let toasts: Toast[] = [];
  const listeners = new Set<Listener>();
  const timers = new Map<ToastId, TimerRec>();

  const emit = (): void => {
    toasts = [...toasts]; // new ref so useSyncExternalStore sees a change
    listeners.forEach((l) => l());
  };

  /** Auto-dismiss timeout: remove the toast, then fire its `onAutoClose`. */
  const fire = (id: ToastId): void => {
    const t = toasts.find((x) => x.id === id);
    timers.delete(id);
    toasts = toasts.filter((x) => x.id !== id);
    emit();
    t?.onAutoClose?.(id);
  };

  const arm = (id: ToastId, ms: number): void => {
    if (ms === Infinity) return;
    const rec: TimerRec = { handle: null, remaining: ms, startedAt: Date.now() };
    rec.handle = setTimeout(() => fire(id), ms);
    timers.set(id, rec);
  };

  const clear = (id: ToastId): void => {
    const rec = timers.get(id);
    if (rec?.handle != null) clearTimeout(rec.handle);
    timers.delete(id);
  };

  const api: ToastStoreApi = {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot() {
      return toasts;
    },

    getServerSnapshot() {
      return EMPTY;
    },

    add(opts) {
      const id = opts.id ?? genId();
      const existingIndex = toasts.findIndex((t) => t.id === id);
      const resolved: Toast = {
        type: "default",
        duration: DEFAULT_DURATION,
        position: DEFAULT_POSITION,
        paused: false,
        createdAt: Date.now(),
        ...opts,
        id,
        message: opts.message,
      };

      if (existingIndex >= 0) {
        const prev = toasts[existingIndex]!;
        toasts[existingIndex] = { ...prev, ...resolved };
      } else {
        toasts.push(resolved);
      }

      // (Re)arm the auto-dismiss timer for the resolved duration.
      clear(id);
      arm(id, resolved.duration);

      emit();
      return id;
    },

    update(id, patch) {
      const i = toasts.findIndex((t) => t.id === id);
      if (i < 0) return;
      const next = { ...toasts[i]!, ...patch };
      toasts[i] = next;

      // If the duration changed (e.g. Infinity → finite on promise settle), re-arm.
      if ("duration" in patch && patch.duration !== undefined) {
        clear(id);
        arm(id, patch.duration);
      }

      emit();
    },

    dismiss(id) {
      const removed = id ? toasts.filter((t) => t.id === id) : toasts.slice();
      if (id) {
        clear(id);
        toasts = toasts.filter((t) => t.id !== id);
      } else {
        toasts.forEach((t) => clear(t.id));
        toasts = [];
      }
      emit();
      removed.forEach((t) => t.onDismiss?.(t.id));
    },

    pause(id) {
      const rec = timers.get(id);
      if (!rec || rec.handle === null) return;
      clearTimeout(rec.handle);
      rec.remaining -= Date.now() - rec.startedAt;
      rec.handle = null;
      api.update(id, { paused: true });
    },

    resume(id) {
      const rec = timers.get(id);
      if (!rec || rec.handle !== null) return;
      rec.startedAt = Date.now();
      rec.handle = setTimeout(() => fire(id), Math.max(0, rec.remaining));
      api.update(id, { paused: false });
    },

    setHeight(id, height) {
      const i = toasts.findIndex((t) => t.id === id);
      if (i < 0) return;
      toasts[i] = { ...toasts[i]!, height };
      emit();
    },
  };

  return api;
}

/** The shared store backing the singleton `toast()` facade. */
export const store: ToastStoreApi = createStore();

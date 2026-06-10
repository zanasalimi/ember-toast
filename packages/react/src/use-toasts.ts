/**
 * React subscription to the framework-agnostic store.
 *
 * `useSyncExternalStore` is the correct primitive here: it's concurrent-safe,
 * tearing-free, and needs no provider. The store lives outside React, so
 * `toast()` works from anywhere; this hook is only how `<Toaster/>` reads it.
 */

import { useSyncExternalStore } from "react";
import { store } from "@embertoast/core";
import type { ToastState } from "@embertoast/core";

/**
 * Subscribe to the live toast snapshot. Re-renders only when the store emits a
 * new (referentially-distinct) state object.
 *
 * `getServerSnapshot` returns the empty server state so SSR markup matches the
 * first client paint (no hydration mismatch, no toasts rendered on the server).
 */
export function useToasts(): ToastState {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

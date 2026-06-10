/**
 * React subscription to the framework-agnostic store.
 *
 * `useSyncExternalStore` is the correct primitive here: it's concurrent-safe,
 * tearing-free, and needs no provider. The store lives outside React, so
 * `toast()` works from anywhere; this hook is only how `<Toaster/>` reads it.
 */

import { useSyncExternalStore } from "react";
import { store } from "@embertoast/core";
import type { Toast } from "@embertoast/core";

/**
 * Subscribe to the live toast list. Re-renders only when the store emits a new
 * (referentially-distinct) array — the store keeps the snapshot stable between
 * mutations so this hook never tears or loops.
 *
 * `getServerSnapshot` returns the empty server array so SSR markup matches the
 * first client paint (no hydration mismatch, no toasts rendered on the server).
 */
export function useToasts(): Toast[] {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

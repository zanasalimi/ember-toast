/**
 * @embertoast/core — framework-agnostic toast store + imperative facade.
 *
 * Most consumers import from `@embertoast/react` instead; this entry exists for
 * building alternative renderers (vanilla, Vue, Svelte) against the shared store.
 */

export { toast } from "./toast";
export { store, createStore } from "./store";

export type {
  Toast,
  ToastId,
  ToastType,
  ToastOptions,
  ToastAction,
  ToastContent,
  ToastStoreApi,
  PromiseMessages,
  Position,
  AriaLive,
  Listener,
  Unsubscribe,
} from "./types";

/**
 * @embertoast/core — framework-agnostic toast store + imperative facade.
 *
 * Most consumers import from `@embertoast/react` instead; this entry exists for
 * building alternative renderers (vanilla, Vue, Svelte) against the shared store.
 */

export { toast } from "./toast";
export {
  store,
  createToastStore,
  DEFAULT_CONFIG,
  DURATION_BY_TYPE,
} from "./store";
export type { ToastStore } from "./store";

export type {
  Toast,
  ToastId,
  ToastType,
  ToastOptions,
  ToastAction,
  ToastContent,
  ToastState,
  ToasterConfig,
  Position,
  AriaLive,
  PromiseMessages,
  Listener,
  Unsubscribe,
} from "./types";

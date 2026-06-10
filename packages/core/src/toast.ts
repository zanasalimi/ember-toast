/**
 * The `toast()` facade — a standalone callable, not a hook.
 *
 * `toast(...)` and its methods push into the shared store, which any mounted
 * renderer subscribes to. This is the central API insight: the producer is
 * decoupled from the renderer, so a toast can be fired from an event handler,
 * a utility module, or any non-React code.
 */

import { store } from "./store";
import type {
  PromiseMessages,
  Toast,
  ToastContent,
  ToastId,
  ToastOptions,
} from "./types";

/** The callable signature: `toast('msg')` and `toast(<Jsx/>)`. */
interface ToastFn {
  (message: ToastContent, options?: ToastOptions): ToastId;

  success(message: ToastContent, options?: ToastOptions): ToastId;
  error(message: ToastContent, options?: ToastOptions): ToastId;
  warning(message: ToastContent, options?: ToastOptions): ToastId;
  info(message: ToastContent, options?: ToastOptions): ToastId;
  loading(message: ToastContent, options?: ToastOptions): ToastId;

  /** Render arbitrary JSX as the toast body. */
  custom(content: ToastContent, options?: ToastOptions): ToastId;

  /**
   * Attach a single toast to a promise: shows `loading`, then morphs in place to
   * `success`/`error` when it settles. Resolves to the same promise for chaining.
   *
   * TODO(M3): track the id, await `promise`, map result through resolver fns,
   * update the existing toast (no new id, no flit), apply settle duration.
   */
  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: ToastOptions): Promise<T>;

  /** Dismiss one toast, or all when `id` is omitted. */
  dismiss(id?: ToastId): void;

  /** Patch an existing toast in place (content, type, duration, action…). */
  update(id: ToastId, patch: Partial<Toast>): void;
}

function base(message: ToastContent, options?: ToastOptions): ToastId {
  return store.add(message, "default", options);
}

export const toast = base as ToastFn;

// TODO(M1): wire each variant to `store.add(message, <type>, options)`.
toast.success = (message, options) => store.add(message, "success", options);
toast.error = (message, options) => store.add(message, "error", options);
toast.warning = (message, options) => store.add(message, "warning", options);
toast.info = (message, options) => store.add(message, "info", options);
toast.loading = (message, options) => store.add(message, "loading", options);
toast.custom = (content, options) => store.add(content, "custom", options);

toast.dismiss = (id) => store.dismiss(id);
toast.update = (id, patch) => store.update(id, patch);

toast.promise = <T>(
  promise: Promise<T>,
  _messages: PromiseMessages<T>,
  _options?: ToastOptions,
): Promise<T> => {
  // TODO(M3): implement loading→success/error morph against a single toast id.
  throw new Error("TODO(M3): toast.promise not implemented");
};

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
  ToastType,
} from "./types";

/** Default auto-dismiss applied to `success`/`error` when a promise settles. */
const SETTLE_DURATION = 4000;

/** The callable signature: `toast('msg')` and `toast(<Jsx/>)`. */
export interface ToastFn {
  (message: ToastContent, options?: ToastOptions): ToastId;

  success(message: ToastContent, options?: ToastOptions): ToastId;
  error(message: ToastContent, options?: ToastOptions): ToastId;
  warning(message: ToastContent, options?: ToastOptions): ToastId;
  info(message: ToastContent, options?: ToastOptions): ToastId;
  /** Pins open by default (`duration: Infinity`) until updated or dismissed. */
  loading(message: ToastContent, options?: ToastOptions): ToastId;

  /** Render arbitrary JSX as the toast body. */
  custom(content: ToastContent, options?: ToastOptions): ToastId;

  /**
   * Attach a single toast to a promise: shows `loading`, then morphs in place to
   * `success`/`error` when it settles. Returns the same promise for chaining and
   * never throws to the caller — rejections route to the `error` branch.
   */
  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: ToastOptions): Promise<T>;

  /** Dismiss one toast, or all when `id` is omitted. */
  dismiss(id?: ToastId): void;

  /** Patch an existing toast in place (content, type, duration, action…). */
  update(id: ToastId, patch: Partial<Toast>): void;
}

/** Build a variant that always tags toasts with `type` (plus optional baked-in options). */
const variant =
  (type: ToastType, extra?: Partial<ToastOptions>) =>
  (message: ToastContent, options?: ToastOptions): ToastId =>
    store.add({ message, type, ...extra, ...options });

function base(message: ToastContent, options?: ToastOptions): ToastId {
  return store.add({ message, type: "default", ...options });
}

const resolveMessage = <T>(
  message: ToastContent | ((value: T) => ToastContent),
  value: T,
): ToastContent => (typeof message === "function" ? (message as (v: T) => ToastContent)(value) : message);

export const toast: ToastFn = Object.assign(base, {
  success: variant("success"),
  error: variant("error"),
  warning: variant("warning"),
  info: variant("info"),
  loading: variant("loading", { duration: Infinity }),

  custom: (content: ToastContent, options?: ToastOptions): ToastId =>
    store.add({ message: content, type: "custom", ...options }),

  dismiss: (id?: ToastId): void => store.dismiss(id),

  update: (id: ToastId, patch: Partial<Toast>): void => store.update(id, patch),

  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: ToastOptions): Promise<T> {
    const id = store.add({
      message: messages.loading,
      type: "loading",
      duration: Infinity,
      ...options,
    });

    const settleDuration = options?.duration ?? SETTLE_DURATION;

    promise.then(
      (value) => {
        store.update(id, {
          type: "success",
          message: resolveMessage(messages.success, value),
          duration: settleDuration,
          paused: false,
        });
      },
      (error: unknown) => {
        store.update(id, {
          type: "error",
          message: resolveMessage(messages.error, error),
          duration: settleDuration,
          paused: false,
        });
      },
    );

    return promise;
  },
});

/**
 * @embertoast/react — the React binding.
 *
 * Re-exports `toast` and the key types from the core so consumers import the
 * producer and the renderer from one place. Import the stylesheet separately if
 * you use the styled default: `import "@embertoast/react/styles.css";`
 */

export { toast, createStore } from "@embertoast/core";
export type {
  Toast,
  ToastId,
  ToastType,
  ToastOptions,
  ToastAction,
  ToastContent,
  Position,
  AriaLive,
  PromiseMessages,
  ToastStoreApi,
} from "@embertoast/core";

export { Toaster } from "./Toaster";
export type { ToasterProps } from "./Toaster";

export { ToastItem, roleForToast } from "./ToastItem";
export type { ToastItemProps } from "./ToastItem";

export { useToasts } from "./use-toasts";

export { useSwipe, shouldDismiss } from "./use-swipe";
export type { SwipeGesture, SwipeThreshold, SwipeHandlers } from "./use-swipe";

export { useFlip } from "./use-flip";

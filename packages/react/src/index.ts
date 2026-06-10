/**
 * @embertoast/react — the React binding.
 *
 * Re-exports `toast` from the core so consumers import the producer and the
 * renderer from one place. Remember to also import the stylesheet if you use the
 * styled default: `import "@embertoast/react/styles.css";`
 */

export { toast } from "@embertoast/core";
export type {
  Toast,
  ToastId,
  ToastType,
  ToastOptions,
  ToastAction,
  Position,
  AriaLive,
  PromiseMessages,
} from "@embertoast/core";

export { Toaster } from "./Toaster";
export type { ToasterProps } from "./Toaster";

export { ToastItem, roleForToast } from "./ToastItem";
export type { ToastItemProps } from "./ToastItem";

export { useToasts } from "./use-toasts";

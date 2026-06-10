/**
 * <Toaster/> — the single subscriber that renders the stack.
 *
 * Mounted once near the app root. It reads the store via `useToasts`, owns the
 * positioned container and the live region, and orchestrates FLIP reflow when a
 * toast is removed so the survivors slide instead of jumping.
 *
 * Headless usage: pass `renderToast` to take over the body markup entirely while
 * keeping the container, positioning, timers, gestures, and a11y from this package.
 */

import type { ReactNode } from "react";
import type { AriaLive, Position, Toast } from "@embertoast/core";

export interface ToasterProps {
  position?: Position;
  /** Max toasts shown at once; the rest queue. Default 3. */
  maxVisible?: number;
  /** Default auto-dismiss in ms. Per-toast `duration` overrides this. */
  duration?: number;
  /** Pixel gap between stacked toasts. */
  gap?: number;
  /** Pause timers while the pointer is over the stack. Default true. */
  pauseOnHover?: boolean;
  /** Pause timers while the window is blurred. Default true. */
  pauseOnWindowBlur?: boolean;
  /** Expand a collapsed stack on hover (v1). */
  expand?: boolean;
  /** Show a per-toast close button in the styled default. */
  closeButton?: boolean;
  /** Stronger semantic colors per severity in the styled default. */
  richColors?: boolean;
  theme?: "light" | "dark" | "system";
  /** Default announcement politeness; per-toast `ariaLive` overrides. */
  ariaLive?: AriaLive;
  /** Offset of the stack from the viewport edge, e.g. "16px" or "1rem". */
  offset?: string | number;
  className?: string;
  /** Headless escape hatch: render the body yourself. Omit to use the styled default. */
  renderToast?: (toast: Toast) => ReactNode;
}

/**
 * TODO(M2): push props into `store.configure`, render the positioned container,
 *           map visible toasts to <ToastItem/>, and run FLIP on the list:
 *           measure First rects → after removal measure Last → invert via transform
 *           → play to identity. Honor prefers-reduced-motion (skip the invert).
 * TODO(M4): single aria-live region per Toaster; polite vs assertive split by severity;
 *           never move focus when a toast mounts.
 */
export function Toaster(_props: ToasterProps): ReactNode {
  // TODO(M2): implement.
  return null;
}

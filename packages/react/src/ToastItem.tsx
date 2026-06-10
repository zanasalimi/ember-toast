/**
 * <ToastItem/> — one toast: its timer, swipe gesture, enter/exit animation, and
 * accessible markup.
 *
 * Owns nothing global. It reads its toast, drives its own auto-dismiss countdown
 * (pausing on hover/blur via the store), handles pointer-drag dismissal, and exposes
 * the right roles. The styled body is the default; `renderToast` on <Toaster/> bypasses it.
 */

import type { ReactNode } from "react";
import type { Toast } from "@embertoast/core";

export interface ToastItemProps {
  toast: Toast;
  /** Show the close button (from <Toaster/> closeButton). */
  closeButton?: boolean;
  /** Distance in px a pointer drag must travel (or velocity it must reach) to fling-dismiss. */
  swipeThreshold?: number;
  /** Headless body override. */
  renderToast?: (toast: Toast) => ReactNode;
}

/**
 * Severity → ARIA role mapping. Errors/warnings interrupt (`alert`, assertive);
 * everything else is polite (`status`). This is the a11y contract — keep it intact.
 */
export function roleForToast(toast: Toast): "status" | "alert" {
  return toast.type === "error" || toast.type === "warning" ? "alert" : "status";
}

/**
 * TODO(M2): enter/exit phase transitions driven by `toast.phase`; height measured
 *           for collapse-on-exit so the stack reflows smoothly.
 * TODO(M3): pointer-event swipe — track dx/velocity, snap back under threshold,
 *           translate + fade out past it, then call store.dismiss(toast.id).
 *           Respect prefers-reduced-motion (no transform animation; instant remove).
 * TODO(M3): hover/focus pauses this toast's timer via store.pause(toast.id).
 */
export function ToastItem(_props: ToastItemProps): ReactNode {
  // TODO(M2): implement.
  return null;
}

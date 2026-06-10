/**
 * <ToastItem/> — one toast: its accessible markup, pause-on-hover wiring, swipe
 * gesture, and dismiss controls.
 *
 * Owns nothing global. It reads its toast, pauses/resumes its own auto-dismiss
 * timer through the store on hover/focus, handles pointer-drag dismissal, and
 * exposes the right role. The `<li>` ref is forwarded so <Toaster/> can measure
 * it for FLIP reflow.
 */

import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { Toast } from "@embertoast/core";
import { store } from "@embertoast/core";
import { useSwipe } from "./use-swipe";

export interface ToastItemProps {
  toast: Toast;
  /** Show the close button (from <Toaster/> closeButton). */
  closeButton?: boolean | undefined;
}

/**
 * Severity → ARIA role mapping. Errors/warnings interrupt (`alert`, assertive);
 * everything else is polite (`status`). This is the a11y contract — keep it intact.
 */
export function roleForToast(toast: Toast): "status" | "alert" {
  return toast.type === "error" || toast.type === "warning"
    ? "alert"
    : "status";
}

export const ToastItem = forwardRef<HTMLLIElement, ToastItemProps>(
  function ToastItem({ toast, closeButton }, ref) {
    const showClose = closeButton || toast.dismissible;
    const swipe = useSwipe(() => store.dismiss(toast.id));

    return (
      <li
        ref={ref}
        role={roleForToast(toast)}
        data-type={toast.type}
        data-embertoast=""
        className={`et-toast${toast.className ? ` ${toast.className}` : ""}`}
        // Pause-on-hover and pause-on-focus both freeze the auto-dismiss timer
        // with its remaining time captured in the store.
        onMouseEnter={() => store.pause(toast.id)}
        onMouseLeave={() => store.resume(toast.id)}
        onFocus={() => store.pause(toast.id)}
        onBlur={() => store.resume(toast.id)}
        {...swipe}
      >
        <span className="et-toast__message">{toast.message as ReactNode}</span>
        {toast.action ? (
          <button
            type="button"
            className="et-toast__action"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        ) : null}
        {showClose ? (
          <button
            type="button"
            aria-label="Close"
            className="et-toast__close"
            onClick={() => store.dismiss(toast.id)}
          >
            {/* Decorative glyph; the accessible name comes from aria-label. */}
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </li>
    );
  },
);

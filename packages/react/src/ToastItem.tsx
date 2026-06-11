/**
 * <ToastItem/> — one toast: status icon, content (title / body / timestamp /
 * actions / footer), a close affordance, and a bottom progress bar. Owns its
 * pause-on-hover wiring, swipe gesture, and the right ARIA role.
 *
 * Owns nothing global. It reads its toast, pauses/resumes its own auto-dismiss
 * timer through the store on hover/focus, handles pointer-drag dismissal, and
 * exposes the right role. The `<li>` ref is forwarded so <Toaster/> can measure
 * it for FLIP reflow.
 */

import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Toast, ToastAction, ToastType } from "@embertoast/core";
import { store } from "@embertoast/core";
import { useSwipe } from "./use-swipe";

export interface ToastItemProps {
  toast: Toast;
  /** Show the close button (from <Toaster/> closeButton). */
  closeButton?: boolean | undefined;
  /**
   * True while this toast is animating out after leaving the live store snapshot.
   * Adds the `et-exit` class (which plays `--et-exit-duration`) and freezes its
   * interactions; the element is dropped once `onExited` fires.
   */
  exiting?: boolean | undefined;
  /**
   * Called when the leave animation ends, so the presence layer can drop this
   * toast from the DOM. A timeout fallback covers the case where it never fires.
   */
  onExited?: (() => void) | undefined;
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

/** Format an epoch-ms timestamp as e.g. "1 Jan 2026, 9:23 pm". Strings pass through. */
function formatTimestamp(ts: number | string): string {
  if (typeof ts === "string") return ts;
  const d = new Date(ts);
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toLowerCase();
  return `${date}, ${time}`;
}

/** Status glyph on a filled circle. Circle = currentColor (the type color); glyph = white. */
function StatusIcon({ type }: { type: ToastType }): ReactNode {
  const G = "#fff";
  if (type === "loading") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="7.2"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        <path
          d="M10 2.8a7.2 7.2 0 0 1 7.2 7.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      {type === "success" ? (
        <path
          d="M5.9 10.4l2.6 2.6 5.6-5.9"
          stroke={G}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : type === "info" ? (
        <>
          <circle cx="10" cy="6.1" r="1.05" fill={G} />
          <path
            d="M10 9.2v5.1"
            stroke={G}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      ) : type === "error" || type === "warning" ? (
        <>
          <path
            d="M10 5.3v5.4"
            stroke={G}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="10" cy="14" r="1.05" fill={G} />
        </>
      ) : (
        /* default */
        <circle cx="10" cy="10" r="1.5" fill={G} />
      )}
    </svg>
  );
}

/** Close glyph — a crisp stroked ×. The accessible name comes from aria-label. */
function CloseIcon(): ReactNode {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const ToastItem = forwardRef<HTMLLIElement, ToastItemProps>(
  function ToastItem({ toast, closeButton, exiting, onExited }, ref) {
    const showClose = closeButton || toast.dismissible;
    const swipe = useSwipe(() => store.dismiss(toast.id));

    // With a title, the title is the prominent line and `message` is the body.
    // Without one, `message` itself is the prominent line (a plain toast).
    const hasTitle = toast.title != null && toast.title !== "";
    const primary = (hasTitle ? toast.title : toast.message) as ReactNode;
    const secondary = (hasTitle ? toast.message : undefined) as ReactNode;
    const hasSecondary = hasTitle && secondary != null && secondary !== "";

    const actions: ToastAction[] =
      toast.actions ?? (toast.action ? [toast.action] : []);

    // Progress bar: determinate (an upload) takes precedence; otherwise a
    // depleting countdown when asked for and the toast actually auto-dismisses.
    const determinate = typeof toast.progress === "number";
    const timerBar =
      !determinate && toast.timerBar === true && toast.duration !== Infinity;
    const progressFillStyle: CSSProperties = determinate
      ? { width: `${Math.max(0, Math.min(1, toast.progress as number)) * 100}%` }
      : ({
          "--et-duration": `${toast.duration}ms`,
          animationPlayState: toast.paused ? "paused" : "running",
        } as CSSProperties);

    // While exiting the toast is a ghost: it's already gone from the store, so
    // pause/resume/swipe would no-op or thrash. Drop those handlers and let the
    // leave animation play, reporting its end so the presence layer can unmount it.
    const interactions = exiting
      ? { onAnimationEnd: onExited }
      : {
          onMouseEnter: () => store.pause(toast.id),
          onMouseLeave: () => store.resume(toast.id),
          onFocus: () => store.pause(toast.id),
          onBlur: () => store.resume(toast.id),
          ...swipe,
        };

    return (
      <li
        ref={ref}
        role={roleForToast(toast)}
        data-type={toast.type}
        data-embertoast=""
        data-exiting={exiting ? "" : undefined}
        className={`et-toast${exiting ? " et-exit" : ""}${toast.className ? ` ${toast.className}` : ""}`}
        {...interactions}
      >
        <span
          className="et-toast__icon"
          data-spin={toast.type === "loading" ? "" : undefined}
        >
          <StatusIcon type={toast.type} />
        </span>

        {/* Keyed by type so a morph (e.g. upload → complete) remounts the content
            and replays the crossfade instead of snapping. Progress-only updates
            keep the same key, so the percentage text updates without flicker. */}
        <div className="et-toast__content" key={toast.type}>
          <div className="et-toast__title">{primary}</div>
          {hasSecondary ? (
            <div className="et-toast__desc">{secondary}</div>
          ) : null}
          {toast.timestamp != null ? (
            <div className="et-toast__time">
              {formatTimestamp(toast.timestamp)}
            </div>
          ) : null}
          {actions.length > 0 ? (
            <div className="et-toast__actions">
              {actions.map((a, i) =>
                a.variant === "button" ? (
                  <button
                    key={i}
                    type="button"
                    className="et-toast__btn"
                    onClick={a.onClick}
                  >
                    {a.label}
                  </button>
                ) : (
                  <button
                    key={i}
                    type="button"
                    className="et-toast__link"
                    onClick={a.onClick}
                  >
                    {a.label}
                  </button>
                ),
              )}
            </div>
          ) : null}
          {toast.footer != null && toast.footer !== "" ? (
            <div className="et-toast__footer">{toast.footer as ReactNode}</div>
          ) : null}
        </div>

        {showClose ? (
          <button
            type="button"
            aria-label="Close"
            className="et-toast__close"
            onClick={() => store.dismiss(toast.id)}
          >
            <CloseIcon />
          </button>
        ) : null}

        {determinate || timerBar ? (
          <div className="et-toast__progress" aria-hidden="true">
            <span
              className="et-toast__progress-fill"
              data-mode={determinate ? "determinate" : "timer"}
              style={progressFillStyle}
            />
          </div>
        ) : null}
      </li>
    );
  },
);

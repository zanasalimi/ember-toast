/**
 * Swipe-to-dismiss gesture.
 *
 * The decision of whether a finished gesture dismisses is split out as a pure
 * function (`shouldDismiss`) so the threshold math is unit-testable without a
 * real pointer — jsdom has no pointer capture. `useSwipe` wires that decision to
 * pointer events and drives the live drag transform, gated behind
 * `prefers-reduced-motion`.
 */

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { prefersReducedMotion } from "./prefers-reduced-motion";

export interface SwipeGesture {
  /** Horizontal travel in px (signed). */
  dx: number;
  /** Horizontal velocity in px/ms (signed). */
  vx: number;
}

export interface SwipeThreshold {
  /** Distance in px past which the gesture dismisses regardless of speed. */
  distance: number;
  /** Velocity in px/ms past which a short flick still dismisses. */
  velocity: number;
}

export const DEFAULT_THRESHOLD: SwipeThreshold = {
  distance: 80,
  velocity: 0.5,
};

/**
 * Drag distance (px) at which the toast fades fully to transparent during a live
 * drag. Derived from the dismiss `distance` threshold so the element is well past
 * dismissal before it vanishes (and the two can't silently desync): at the
 * threshold the toast is still ~60% opaque, giving a clear "keep dragging" cue.
 */
const FADE_DISTANCE = DEFAULT_THRESHOLD.distance * 2.5;

/**
 * Pure threshold decision: a gesture dismisses if it travels far enough OR is
 * flicked fast enough. Either condition alone is sufficient.
 */
export function shouldDismiss(
  gesture: SwipeGesture,
  threshold: SwipeThreshold = DEFAULT_THRESHOLD,
): boolean {
  return (
    Math.abs(gesture.dx) >= threshold.distance ||
    Math.abs(gesture.vx) >= threshold.velocity
  );
}

export interface SwipeHandlers {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
}

/**
 * Pointer handlers for swipe-to-dismiss. Tracks the drag, translates/fades the
 * element while reduced-motion is off, and calls `onDismiss` when the released
 * gesture clears the threshold; otherwise snaps the element back to rest.
 */
export function useSwipe(
  onDismiss: () => void,
  threshold: SwipeThreshold = DEFAULT_THRESHOLD,
): SwipeHandlers {
  const start = useRef<{ x: number; t: number } | null>(null);

  const reset = (el: HTMLElement) => {
    el.style.transition = "";
    el.style.transform = "";
    el.style.opacity = "";
  };

  return {
    onPointerDown(e) {
      // Ignore non-primary buttons and modified clicks.
      if (e.button !== 0) return;
      // Don't hijack presses that begin on an interactive control (close button,
      // action links/buttons). Capturing the pointer on the <li> would redirect
      // pointerup away from the control and suppress its click — so bail and let
      // the control's own onClick fire. Opt extra elements out with data-et-no-swipe.
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [data-et-no-swipe]")) return;
      start.current = { x: e.clientX, t: e.timeStamp };
      // setPointerCapture is absent in jsdom; guard so unit tests don't throw.
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    onPointerMove(e) {
      if (!start.current) return;
      // Reduced motion: suppress the live drag transform/fade only. The gesture is
      // still tracked (start point set on pointerdown), so release below still
      // honors it — the toast can be dismissed, just without the visual drag.
      if (prefersReducedMotion()) return;
      const dx = e.clientX - start.current.x;
      const el = e.currentTarget;
      el.style.transition = "none";
      el.style.transform = `translateX(${dx}px)`;
      el.style.opacity = String(Math.max(0, 1 - Math.abs(dx) / FADE_DISTANCE));
    },
    onPointerUp(e) {
      if (!start.current) return;
      const dx = e.clientX - start.current.x;
      const elapsed = Math.max(1, e.timeStamp - start.current.t);
      const vx = dx / elapsed;
      start.current = null;
      if (shouldDismiss({ dx, vx }, threshold)) {
        onDismiss();
      } else {
        reset(e.currentTarget);
      }
    },
    onPointerCancel(e) {
      if (!start.current) return;
      start.current = null;
      reset(e.currentTarget);
    },
  };
}

/**
 * Leave-animation presence layer.
 *
 * The store removes a toast the instant it's dismissed, so without this hook the
 * element would be hard-cut from the DOM. `usePresence` keeps a just-removed toast
 * mounted briefly with `exiting: true` (the renderer applies the `et-exit` class so
 * the `--et-exit-duration` token plays), then drops it for real.
 *
 * Robustness: the drop is driven by an `animationend`/`transitionend` event the
 * renderer reports via `done(id)`, backed by a timeout fallback so a toast can never
 * get stuck as a ghost if the animation event doesn't fire (display:none, a CSS
 * override, a backgrounded tab, etc.).
 *
 * Accessibility: under `prefers-reduced-motion` there is no exit phase at all —
 * removals are instant, matching the "no animation when the user asks for none"
 * contract.
 */

import { useEffect, useRef, useState } from "react";
import type { Toast } from "@embertoast/core";
import { prefersReducedMotion } from "./prefers-reduced-motion";

/** A toast in the rendered set, plus whether it's mid-exit (live snapshot dropped it). */
export interface PresentToast {
  toast: Toast;
  exiting: boolean;
}

/**
 * Fallback ms before a ghost is force-dropped if no animation event arrives. Must
 * comfortably exceed `--et-exit-duration` (220ms) so it only ever acts as a
 * backstop, never pre-empting a real, completing animation.
 */
const EXIT_TIMEOUT = 400;

/**
 * Merge the live toast list with any toasts currently animating out.
 *
 * Returns the rendered set in stable order (survivors keep their slots; exiting
 * toasts stay where they were) and a `done(id)` callback the renderer fires on
 * `animationend` to retire a ghost early.
 */
export function usePresence(live: Toast[]): {
  present: PresentToast[];
  done: (id: string) => void;
} {
  // Toasts kept alive past their store removal, keyed by id, frozen at the last
  // snapshot we saw them in (so their content stays stable while fading out).
  const [exiting, setExiting] = useState<Map<string, Toast>>(new Map);
  // Pending fallback timers, so we can clear them if a toast is retired early or
  // resurrected (re-added with the same id) before the backstop fires.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // The previous live set, to detect which ids just left.
  const prevLive = useRef<Map<string, Toast>>(new Map());

  const retire = (id: string): void => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setExiting((cur) => {
      if (!cur.has(id)) return cur;
      const next = new Map(cur);
      next.delete(id);
      return next;
    });
  };

  useEffect(() => {
    const liveIds = new Set(live.map((t) => t.id));
    const reduced = prefersReducedMotion();

    // Anything in the previous live set but not the current one just disappeared.
    const newlyGone: Toast[] = [];
    prevLive.current.forEach((toast, id) => {
      if (!liveIds.has(id)) newlyGone.push(toast);
    });

    // A toast that reappears (same id re-added) must cancel any in-flight exit.
    live.forEach((t) => {
      if (timers.current.has(t.id)) retire(t.id);
    });

    if (newlyGone.length > 0) {
      if (reduced) {
        // Reduced motion: no exit phase. Make sure nothing lingers.
        newlyGone.forEach((t) => retire(t.id));
      } else {
        setExiting((cur) => {
          const next = new Map(cur);
          newlyGone.forEach((t) => next.set(t.id, t));
          return next;
        });
        newlyGone.forEach((t) => {
          if (timers.current.has(t.id)) return;
          timers.current.set(
            t.id,
            setTimeout(() => retire(t.id), EXIT_TIMEOUT),
          );
        });
      }
    }

    prevLive.current = new Map(live.map((t) => [t.id, t]));
    // `live` is referentially stable between store mutations, so this runs once
    // per real change to the toast set.
  }, [live]);

  // Clear any outstanding fallback timers on unmount so they can't fire into a
  // dead component.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  // Build the rendered set: every live toast (not exiting), plus exiting ghosts that
  // aren't also live (a resurrected id renders only its live copy). Live order wins;
  // ghosts are appended so survivors keep their FLIP slots.
  const liveIds = new Set(live.map((t) => t.id));
  const present: PresentToast[] = live.map((toast) => ({
    toast,
    exiting: false,
  }));
  exiting.forEach((toast, id) => {
    if (!liveIds.has(id)) present.push({ toast, exiting: true });
  });

  return { present, done: retire };
}

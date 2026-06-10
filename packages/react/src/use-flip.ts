/**
 * FLIP (First, Last, Invert, Play) stack reflow.
 *
 * When a toast above others is removed, the survivors would jump to their new
 * positions. FLIP makes them slide instead: record each element's First top,
 * let React commit the Last layout, then invert the delta with a transform and
 * play it back to identity on the next frame.
 *
 * Transforms are skipped under `prefers-reduced-motion` — survivors snap to place.
 */

import { useLayoutEffect, useRef } from "react";

const FLIP_DURATION = 200;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const raf = (cb: () => void): void => {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(cb);
  } else {
    setTimeout(cb, 0);
  }
};

export type RegisterRef = (el: HTMLElement | null) => void;

/**
 * Returns a `register(key)` ref-callback factory. Pass `keys` in render order so
 * the hook re-measures whenever the visible set changes. On each commit it
 * inverts the position delta for every surviving element and plays it out.
 */
export function useFlip(keys: string[]): (key: string) => RegisterRef {
  const refs = useRef(new Map<string, HTMLElement>());
  const prev = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const next = new Map<string, number>();
    const reduced = prefersReducedMotion();

    refs.current.forEach((el, key) => {
      const top = el.getBoundingClientRect().top;
      next.set(key, top);

      if (reduced) return;

      const before = prev.current.get(key);
      if (before != null && before !== top) {
        const dy = before - top;
        // First → Last → Invert: jump back to the old position instantly…
        el.style.transition = "none";
        el.style.transform = `translateY(${dy}px)`;
        // …then play to identity on the next frame.
        raf(() => {
          el.style.transition = `transform ${FLIP_DURATION}ms ease`;
          el.style.transform = "";
          el.dataset.flip = "done";
        });
      }
    });

    prev.current = next;
    // `keys` order/length changing is the signal that layout may have shifted.
  }, [keys.join(",")]);

  return (key: string): RegisterRef =>
    (el) => {
      if (el) refs.current.set(key, el);
      else refs.current.delete(key);
    };
}

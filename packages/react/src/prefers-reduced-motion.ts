/**
 * `prefers-reduced-motion` probe, shared across the motion hooks.
 *
 * SSR-safe: guards both `window` and `matchMedia` so it returns `false` (motion
 * allowed) anywhere those are absent, never throwing. Read at call time rather
 * than cached so a mid-session OS preference change is honored.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

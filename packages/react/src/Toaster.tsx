/**
 * <Toaster/> — the single subscriber that renders the stack.
 *
 * Mounted once near the app root. It reads the store via `useToasts`, groups
 * toasts by resolved position into one `aria-live` region per position, renders
 * up to `visibleToasts` per group, and drives FLIP reflow so survivors slide
 * when a toast above them is removed. A `usePresence` layer keeps a just-dismissed
 * toast mounted briefly to play its leave animation before unmounting (instant
 * under `prefers-reduced-motion`).
 *
 * Imperative producer, declarative renderer: this component holds no toast state
 * beyond the transient "still animating out" set owned by `usePresence`.
 */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Position } from "@embertoast/core";
import { useToasts } from "./use-toasts";
import { ToastItem } from "./ToastItem";
import { useFlip } from "./use-flip";
import { usePresence } from "./use-presence";
import type { PresentToast } from "./use-presence";

const POSITIONS: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export interface ToasterProps {
  /** Default position for toasts that don't specify one. */
  position?: Position;
  /** Render a per-toast dismiss button in the styled default. */
  closeButton?: boolean;
  /** Stronger severity-tinted styling in the default theme. */
  richColors?: boolean;
  /** Color scheme for the styled default. `'system'` defers to the OS. */
  theme?: "light" | "dark" | "system";
  /** Max toasts shown per position; the rest queue. Default 3. */
  visibleToasts?: number;
  /** Pixel gap between stacked toasts. */
  gap?: number;
  /** Offset of the stack from the viewport edge, in px. */
  offset?: number;
  /**
   * Expand a collapsed stack on hover. Exposed as a `data-expand` attribute the
   * stylesheet keys off; defaults to expanded.
   */
  expand?: boolean;
  /** Extra class on each region container. */
  className?: string;
  /**
   * Where to portal the toast regions. Defaults to `document.body` so the fixed
   * positioning is always viewport-relative and never trapped by a transformed,
   * filtered, or `backdrop-blur`ed ancestor (which would create a containing
   * block). Pass `false` to render in place instead.
   */
  container?: HTMLElement | false;
}

/** One positioned `aria-live` region holding the visible toasts for that corner. */
function Region({
  position,
  theme,
  richColors,
  expand,
  gap,
  offset,
  className,
  closeButton,
  present,
  onExited,
}: {
  position: Position;
  theme: "light" | "dark" | "system";
  richColors: boolean;
  expand: boolean;
  gap: number | undefined;
  offset: number | undefined;
  className: string | undefined;
  closeButton: boolean | undefined;
  /** The rendered set for this corner: live toasts plus any animating out. */
  present: PresentToast[];
  /** Retire a ghost once its leave animation ends. */
  onExited: (id: string) => void;
}) {
  // FLIP must observe the same ordered key set the DOM renders (ghosts included).
  const register = useFlip(present.map((p) => p.toast.id));

  // Any live (non-exiting) error/warning in the group makes the whole region
  // assertive so urgent toasts interrupt; otherwise it stays polite. Exiting
  // toasts are on their way out, so they don't influence politeness.
  const assertive = present.some(
    (p) =>
      !p.exiting &&
      (p.toast.type === "error" || p.toast.type === "warning"),
  );

  // CSS custom properties aren't in the typed CSSProperties surface; a record
  // cast is the standard escape hatch for theming via inline vars.
  const style: CSSProperties = {};
  const vars = style as Record<string, string>;
  if (gap !== undefined) vars["--et-gap"] = `${gap}px`;
  if (offset !== undefined) vars["--et-offset"] = `${offset}px`;

  return (
    <ol
      data-embertoast-toaster=""
      data-position={position}
      data-theme={theme}
      data-rich={richColors ? "" : undefined}
      data-expand={expand ? "" : undefined}
      className={`et-toaster${className ? ` ${className}` : ""}`}
      style={style}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="false"
      tabIndex={-1}
    >
      {present.map(({ toast, exiting }) => (
        <ToastItem
          key={toast.id}
          ref={register(toast.id)}
          toast={toast}
          closeButton={closeButton}
          exiting={exiting}
          onExited={() => onExited(toast.id)}
        />
      ))}
    </ol>
  );
}

export function Toaster({
  position = "bottom-right",
  closeButton,
  richColors = false,
  theme = "system",
  visibleToasts = 3,
  gap,
  offset,
  expand = true,
  className,
  container,
}: ToasterProps) {
  const toasts = useToasts();
  // Portal to the body only after mount: the server (and first client paint)
  // render nothing, which both avoids a hydration mismatch and keeps the toasts
  // client-only (their store snapshot is empty on the server anyway).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The set actually on screen: per position, the live toasts trimmed to
  // `visibleToasts` (the rest queue, unseen). Presence tracks departures from this
  // visible set, so a toast that merely overflows the queue is never animated out —
  // only ones that were really showing get a leave animation.
  const visible = POSITIONS.flatMap((pos) =>
    toasts
      .filter((t) => (t.position ?? position) === pos)
      .slice(0, visibleToasts),
  );

  // One presence layer across the whole stack. Kept above the per-position render
  // so a region survives its last toast's exit instead of unmounting mid-animation.
  const { present, done } = usePresence(visible);

  const tree = (
    <>
      {POSITIONS.map((pos) => {
        const items = present.filter(
          (p) => (p.toast.position ?? position) === pos,
        );
        if (items.length === 0) return null;
        return (
          <Region
            key={pos}
            position={pos}
            theme={theme}
            richColors={richColors}
            expand={expand}
            gap={gap}
            offset={offset}
            className={className}
            closeButton={closeButton}
            present={items}
            onExited={done}
          />
        );
      })}
    </>
  );

  // Render in place when explicitly opted out; otherwise portal to the body so
  // positioning is viewport-relative regardless of where <Toaster/> is mounted.
  if (container === false) return tree;
  if (!mounted) return null;
  return createPortal(tree, container ?? document.body);
}

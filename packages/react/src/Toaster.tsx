/**
 * <Toaster/> — the single subscriber that renders the stack.
 *
 * Mounted once near the app root. It reads the store via `useToasts`, groups
 * toasts by resolved position into one `aria-live` region per position, renders
 * up to `visibleToasts` per group, and drives FLIP reflow so survivors slide
 * when a toast above them is removed.
 *
 * Imperative producer, declarative renderer: this component holds no toast state.
 */

import type { CSSProperties } from "react";
import type { Position } from "@embertoast/core";
import { useToasts } from "./use-toasts";
import { ToastItem } from "./ToastItem";
import { useFlip } from "./use-flip";

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
  toasts,
}: {
  position: Position;
  theme: "light" | "dark" | "system";
  richColors: boolean;
  expand: boolean;
  gap: number | undefined;
  offset: number | undefined;
  className: string | undefined;
  closeButton: boolean | undefined;
  toasts: import("@embertoast/core").Toast[];
}) {
  // FLIP must observe the same ordered key set the DOM renders.
  const register = useFlip(toasts.map((t) => t.id));

  // Any error/warning in the group makes the whole region assertive so urgent
  // toasts interrupt; otherwise it stays polite.
  const assertive = toasts.some(
    (t) => t.type === "error" || t.type === "warning",
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
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          ref={register(toast.id)}
          toast={toast}
          closeButton={closeButton}
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
}: ToasterProps) {
  const toasts = useToasts();

  return (
    <>
      {POSITIONS.map((pos) => {
        const items = toasts
          .filter((t) => (t.position ?? position) === pos)
          .slice(0, visibleToasts);
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
            toasts={items}
          />
        );
      })}
    </>
  );
}

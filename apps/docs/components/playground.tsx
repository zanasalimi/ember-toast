"use client";

/**
 * The live playground — the hero of the docs. Buttons fire REAL toasts from the
 * library; switches/selects drive <Toaster/> props live. This is the dogfood and
 * the proof in one component.
 *
 * Editorial control panel, not a centered demo card: a tactile, labeled board.
 *
 * TODO(M6): wire to @embertoast/react —
 *   - trigger buttons → toast.success/error/loading/promise/custom
 *   - position Select, expand/closeButton/richColors Switches → <Toaster/> props
 *   - a "generated code" pane that mirrors the current control state (copyable)
 *   - reduced-motion + theme respected
 */
export function Playground() {
  return (
    <div
      className="rounded-[14px] border border-rule bg-white/60 p-5 shadow-[0_1px_0_rgba(10,10,10,0.04),0_18px_40px_-24px_rgba(10,10,10,0.25)]"
      aria-label="Live toast playground"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          playground
        </span>
        <span className="h-2 w-2 rounded-full bg-ember" aria-hidden />
      </div>

      {/* TODO(M6): replace with real, wired controls. */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {["Default", "Success", "Error", "Promise"].map((label) => (
          <button
            key={label}
            type="button"
            disabled
            className="rounded-md border border-rule bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-ember disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">
        {/* not lorem — a real status line */}
        controls wire up in M6 · fires live toasts
      </p>
    </div>
  );
}

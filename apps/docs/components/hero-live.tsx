"use client";

/**
 * The hero, alive. A self-running demo on its OWN isolated store (so it never
 * fights the configurator's global Toaster), looping a curated sequence: a save,
 * an upload that fills then morphs to "complete", a network error with a Retry,
 * a "Changes saved" with a depleting timer bar, and a promise sync. Real toasts,
 * real enter/morph animation — motion is the point.
 */

import { useEffect, useMemo, type CSSProperties } from "react";
import { useSyncExternalStore } from "react";
import { createStore } from "@embertoast/react";
import type { Toast, ToastAction, ToastStoreApi, ToastType } from "@embertoast/react";

/* ── icons ─────────────────────────────────────────────────────────────── */
function StatusIcon({ type }: { type: ToastType }) {
  if (type === "loading") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="et-spin">
        <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M10 2.8a7.2 7.2 0 0 1 7.2 7.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      {type === "success" ? (
        <path d="M5.9 10.4l2.6 2.6 5.6-5.9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      ) : type === "info" ? (
        <>
          <circle cx="10" cy="6.1" r="1.05" fill="#fff" />
          <path d="M10 9.2v5.1" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ) : type === "error" || type === "warning" ? (
        <>
          <path d="M10 5.3v5.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="10" cy="14" r="1.05" fill="#fff" />
        </>
      ) : (
        <circle cx="10" cy="10" r="1.5" fill="#fff" />
      )}
    </svg>
  );
}
function Close() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── one toast (bound to the hero's isolated store) ────────────────────── */
function MiniToast({ t, store }: { t: Toast; store: ToastStoreApi }) {
  const hasTitle = t.title != null && t.title !== "";
  const primary = (hasTitle ? t.title : t.message) as React.ReactNode;
  const secondary = (hasTitle ? t.message : undefined) as React.ReactNode;
  const actions: ToastAction[] = t.actions ?? (t.action ? [t.action] : []);
  const determinate = typeof t.progress === "number";
  const timer = !determinate && t.timerBar === true && t.duration !== Infinity;
  const fill: CSSProperties = determinate
    ? { width: `${Math.max(0, Math.min(1, t.progress as number)) * 100}%` }
    : ({ "--et-duration": `${t.duration}ms`, animationPlayState: t.paused ? "paused" : "running" } as CSSProperties);

  return (
    <li
      className="et-toast"
      data-type={t.type}
      onMouseEnter={() => store.pause(t.id)}
      onMouseLeave={() => store.resume(t.id)}
    >
      <span className="et-toast__icon" data-spin={t.type === "loading" ? "" : undefined}>
        <StatusIcon type={t.type} />
      </span>
      <div className="et-toast__content" key={t.type}>
        <div className="et-toast__title">{primary}</div>
        {hasTitle && secondary != null && secondary !== "" ? (
          <div className="et-toast__desc">{secondary}</div>
        ) : null}
        {actions.length > 0 ? (
          <div className="et-toast__actions">
            {actions.map((a, i) =>
              a.variant === "button" ? (
                <button key={i} type="button" className="et-toast__btn" onClick={a.onClick}>{a.label}</button>
              ) : (
                <button key={i} type="button" className="et-toast__link" onClick={a.onClick}>{a.label}</button>
              ),
            )}
          </div>
        ) : null}
      </div>
      <button type="button" aria-label="Close" className="et-toast__close" onClick={() => store.dismiss(t.id)}>
        <Close />
      </button>
      {determinate || timer ? (
        <div className="et-toast__progress" aria-hidden>
          <span className="et-toast__progress-fill" data-mode={determinate ? "determinate" : "timer"} style={fill} />
        </div>
      ) : null}
    </li>
  );
}

export function HeroLive() {
  const store = useMemo(() => createStore(), []);
  const toasts = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(() => alive && fn(), ms));

    const loop = () => {
      store.dismiss();
      at(200, () =>
        store.add({ type: "success", title: "Profile updated", message: "Your changes are live.", duration: 6200 }),
      );
      at(1600, () => {
        const id = store.add({ type: "info", title: "Uploading report.pdf", message: "0% · 2.4 MB", duration: Infinity, progress: 0 });
        let p = 0;
        const iv = setInterval(() => {
          if (!alive) return clearInterval(iv);
          p = Math.min(1, p + 0.12);
          store.update(id, { message: `${Math.round(p * 100)}% · 2.4 MB`, progress: p });
          if (p >= 1) {
            clearInterval(iv);
            at(550, () =>
              store.update(id, { type: "success", title: "Upload complete", message: "report.pdf · 2.4 MB", progress: undefined, duration: 5000, timerBar: true }),
            );
          }
        }, 300);
        timers.push(iv as unknown as ReturnType<typeof setTimeout>);
      });
      at(3400, () =>
        store.add({ type: "error", title: "Network error", message: "Couldn’t reach the server.", duration: 5600, action: { label: "Retry", onClick: () => {} } }),
      );
      at(5400, () =>
        store.add({ type: "default", title: "Changes saved", message: "Task updated with the recent changes.", duration: 5200, timerBar: true, actions: [{ label: "Undo", variant: "button", onClick: () => {} }] }),
      );
      at(7400, () => {
        const id = store.add({ type: "loading", title: "Syncing workspace…", message: "Talking to the server.", duration: Infinity });
        at(2000, () => store.update(id, { type: "success", title: "Workspace synced", message: "Up to date.", duration: 3500 }));
      });
      at(12500, () => loop());
    };

    loop();
    return () => {
      alive = false;
      timers.forEach((t) => clearTimeout(t));
      store.dismiss();
    };
  }, [store]);

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(60%_60%_at_70%_30%,rgba(232,89,12,0.10),transparent_70%)]" />
      <ol
        data-embertoast-toaster
        data-theme="light"
        className="flex min-h-[360px] flex-col justify-end gap-3"
        aria-live="off"
      >
        {toasts.slice(-4).map((t) => (
          <MiniToast key={t.id} t={t} store={store} />
        ))}
      </ol>
    </div>
  );
}

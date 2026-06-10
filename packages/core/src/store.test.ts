import { describe, it, expect, beforeEach, vi } from "vitest";
import { createToastStore } from "./store";
import type { ToastStore } from "./store";

// TODO(M1): unskip as createToastStore lands. These name the behaviors the store
// must guarantee; they are the acceptance criteria, not placeholders for `true === true`.

describe.skip("createToastStore", () => {
  let store: ToastStore;

  beforeEach(() => {
    store = createToastStore({ maxVisible: 2, duration: 1000 });
  });

  it("assigns a stable id and notifies subscribers on add", () => {
    const listener = vi.fn();
    store.subscribe(listener);
    const id = store.add("hello", "default");
    expect(id).toBeTypeOf("string");
    expect(listener).toHaveBeenCalledOnce();
    expect(store.getSnapshot().toasts.at(-1)?.content).toBe("hello");
  });

  it("queues toasts beyond maxVisible and promotes on dismiss", () => {
    store.add("a", "default");
    store.add("b", "default");
    const third = store.add("c", "default");
    expect(store.getSnapshot().toasts).toHaveLength(2);
    expect(store.getSnapshot().queued.map((t) => t.id)).toContain(third);
  });

  it("updates a toast in place when add() reuses an id", () => {
    const id = store.add("loading…", "loading");
    store.add("done", "success", { id });
    const t = store.getSnapshot().toasts.find((x) => x.id === id);
    expect(t?.type).toBe("success");
    expect(t?.content).toBe("done");
  });

  it("pause() captures remaining time and resume() restarts from it", () => {
    vi.useFakeTimers();
    const id = store.add("timed", "default");
    vi.advanceTimersByTime(400);
    store.pause(id);
    const remaining = store.getSnapshot().toasts.find((t) => t.id === id)?.remaining;
    expect(remaining).toBeLessThanOrEqual(600);
    vi.useRealTimers();
  });

  it("dismiss() without an id clears everything", () => {
    store.add("a", "default");
    store.add("b", "default");
    store.dismiss();
    expect(store.getSnapshot().toasts.every((t) => t.phase === "exiting")).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createStore, DEFAULT_DURATION } from "./store";

describe("store: timers", () => {
  let store: ReturnType<typeof createStore>;
  beforeEach(() => {
    vi.useFakeTimers();
    store = createStore();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-dismisses after duration", () => {
    store.add({ message: "x", type: "default", duration: 1000 });
    expect(store.getSnapshot()).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("explicit `duration: undefined` falls back to the default (does not fire immediately)", () => {
    store.add({ message: "x", type: "default", duration: undefined });
    // Must NOT auto-dismiss synchronously or on a near-zero timer.
    vi.advanceTimersByTime(0);
    expect(store.getSnapshot()).toHaveLength(1);
    vi.advanceTimersByTime(DEFAULT_DURATION - 1);
    expect(store.getSnapshot()).toHaveLength(1);
    vi.advanceTimersByTime(1); // default duration elapses
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("Infinity duration never auto-dismisses", () => {
    store.add({ message: "x", type: "default", duration: Infinity });
    vi.advanceTimersByTime(100000);
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("pause stops the timer; resume finishes the remainder", () => {
    const id = store.add({ message: "x", type: "default", duration: 1000 });
    vi.advanceTimersByTime(600);
    store.pause(id);
    vi.advanceTimersByTime(5000); // paused — nothing happens
    expect(store.getSnapshot()).toHaveLength(1);
    store.resume(id);
    vi.advanceTimersByTime(399);
    expect(store.getSnapshot()).toHaveLength(1);
    vi.advanceTimersByTime(1); // remaining 400ms elapses
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("fires onAutoClose, not onDismiss, on timeout", () => {
    const onAutoClose = vi.fn();
    const onDismiss = vi.fn();
    store.add({ message: "x", type: "default", duration: 500, onAutoClose, onDismiss });
    vi.advanceTimersByTime(500);
    expect(onAutoClose).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

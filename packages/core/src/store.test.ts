import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStore } from "./store";

describe("store: add & subscribe", () => {
  let store: ReturnType<typeof createStore>;
  beforeEach(() => {
    store = createStore();
  });

  it("adds a toast and returns its id", () => {
    const id = store.add({ message: "hi", type: "default" });
    expect(typeof id).toBe("string");
    expect(store.getSnapshot()).toHaveLength(1);
    expect(store.getSnapshot()[0]?.message).toBe("hi");
  });

  it("notifies subscribers on add", () => {
    const cb = vi.fn();
    store.subscribe(cb);
    store.add({ message: "x", type: "default" });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("getSnapshot is referentially stable between mutations", () => {
    store.add({ message: "x", type: "default" });
    const a = store.getSnapshot();
    const b = store.getSnapshot();
    expect(a).toBe(b); // same ref → no infinite render loop
  });

  it("getSnapshot returns a new ref after a mutation", () => {
    const a = store.getSnapshot();
    store.add({ message: "x", type: "default" });
    const b = store.getSnapshot();
    expect(a).not.toBe(b);
  });

  it("honors a provided id", () => {
    const id = store.add({ message: "x", type: "default", id: "fixed" });
    expect(id).toBe("fixed");
  });
});

describe("store: update & dismiss", () => {
  let store: ReturnType<typeof createStore>;
  beforeEach(() => {
    store = createStore();
  });

  it("updates a toast in place", () => {
    const id = store.add({ message: "loading", type: "loading" });
    store.update(id, { type: "success", message: "done" });
    expect(store.getSnapshot()[0]).toMatchObject({ type: "success", message: "done" });
  });

  it("dismiss(id) removes one toast", () => {
    const a = store.add({ message: "a", type: "default" });
    store.add({ message: "b", type: "default" });
    store.dismiss(a);
    expect(store.getSnapshot().map((t) => t.message)).toEqual(["b"]);
  });

  it("dismiss() clears all", () => {
    store.add({ message: "a", type: "default" });
    store.add({ message: "b", type: "default" });
    store.dismiss();
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("add with an existing id updates instead of duplicating", () => {
    store.add({ message: "first", type: "default", id: "dup" });
    store.add({ message: "second", type: "default", id: "dup" });
    expect(store.getSnapshot()).toHaveLength(1);
    expect(store.getSnapshot()[0]?.message).toBe("second");
  });
});

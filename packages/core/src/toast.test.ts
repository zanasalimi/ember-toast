import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { toast } from "./toast";
import { store } from "./store";

describe("toast facade", () => {
  beforeEach(() => store.dismiss());
  // Drain the shared singleton so no real-timer setTimeout leaks past a test.
  afterEach(() => store.dismiss());

  it("toast(msg) adds a default toast", () => {
    toast("hello");
    expect(store.getSnapshot()[0]).toMatchObject({ type: "default", message: "hello" });
  });

  it("variants set the type", () => {
    toast.success("ok");
    toast.error("bad");
    toast.loading("wait");
    expect(store.getSnapshot().map((t) => t.type)).toEqual(["success", "error", "loading"]);
  });

  it("loading defaults to a persistent toast", () => {
    toast.loading("wait");
    expect(store.getSnapshot()[0]?.duration).toBe(Infinity);
  });

  it("toast.dismiss(id) removes it", () => {
    const id = toast("x");
    toast.dismiss(id);
    expect(store.getSnapshot()).toHaveLength(0);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { toast } from "./toast";
import { store } from "./store";

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

describe("toast.promise", () => {
  beforeEach(() => store.dismiss());

  it("shows loading then success on resolve, same id", async () => {
    const p = Promise.resolve({ name: "file.png" });
    toast.promise(p, {
      loading: "Uploading…",
      success: (r) => `Uploaded ${r.name}`,
      error: "Failed",
    });
    expect(store.getSnapshot()[0]).toMatchObject({ type: "loading", message: "Uploading…" });
    const idDuringLoading = store.getSnapshot()[0]?.id;
    await p;
    await flush();
    expect(store.getSnapshot()).toHaveLength(1);
    expect(store.getSnapshot()[0]).toMatchObject({
      id: idDuringLoading,
      type: "success",
      message: "Uploaded file.png",
    });
  });

  it("shows error on reject and never throws to caller", async () => {
    const p = Promise.reject(new Error("nope"));
    expect(() =>
      toast.promise(p, {
        loading: "L",
        success: "S",
        error: (e) => `E: ${(e as Error).message}`,
      }),
    ).not.toThrow();
    await p.catch(() => {});
    await flush();
    expect(store.getSnapshot()[0]).toMatchObject({ type: "error", message: "E: nope" });
  });
});

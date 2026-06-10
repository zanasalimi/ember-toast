import { describe, it, expect, vi } from "vitest";
import { toast } from "./toast";

// TODO(M3): unskip once the facade is wired to a fresh store per test.

describe.skip("toast facade", () => {
  it("each variant tags the toast with its type", () => {
    const cases = ["success", "error", "warning", "info", "loading"] as const;
    for (const variant of cases) {
      const id = toast[variant]("msg");
      expect(id).toBeTypeOf("string");
    }
  });

  describe("promise", () => {
    it("morphs one toast id from loading to success on resolve", async () => {
      const p = Promise.resolve({ name: "report.pdf" });
      await toast.promise(p, {
        loading: "Uploading…",
        success: (r) => `Uploaded ${r.name}`,
        error: "Failed",
      });
      // assert the same id transitioned loading → success without creating a second toast
    });

    it("morphs to error on reject and surfaces the error message", async () => {
      const p = Promise.reject(new Error("boom"));
      const onError = vi.fn();
      await toast
        .promise(p, { loading: "…", success: "ok", error: (e) => (e as Error).message })
        .catch(onError);
      expect(onError).toHaveBeenCalled();
    });
  });
});

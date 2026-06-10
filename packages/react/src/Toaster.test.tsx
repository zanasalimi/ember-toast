import { describe, it, expect } from "vitest";
import { roleForToast } from "./ToastItem";
import type { Toast } from "@embertoast/core";

function fixture(overrides: Partial<Toast>): Toast {
  return {
    id: "t1",
    type: "default",
    content: "hi",
    createdAt: 0,
    duration: 4000,
    position: "bottom-right",
    dismissible: true,
    ariaLive: "polite",
    phase: "visible",
    paused: false,
    remaining: 4000,
    ...overrides,
  };
}

// This one runs today: the ARIA-role mapping is the accessibility contract and is
// pure, so it can be asserted before the components are built.
describe("roleForToast", () => {
  it("uses alert for error and warning (assertive interrupt)", () => {
    expect(roleForToast(fixture({ type: "error" }))).toBe("alert");
    expect(roleForToast(fixture({ type: "warning" }))).toBe("alert");
  });

  it("uses status for non-urgent severities (polite)", () => {
    for (const type of ["default", "success", "info", "loading"] as const) {
      expect(roleForToast(fixture({ type }))).toBe("status");
    }
  });
});

// TODO(M2): unskip once <Toaster/> renders.
describe.skip("<Toaster/>", () => {
  it("renders a single aria-live region and never moves focus on mount", () => {
    // render <Toaster/>, fire a toast, assert document.activeElement is unchanged
  });

  it("limits rendered toasts to maxVisible and queues the overflow", () => {
    // render with maxVisible=2, fire 3, assert 2 in DOM
  });
});

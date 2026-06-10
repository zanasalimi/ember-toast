import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { toast, store } from "@embertoast/core";
import type { Toast } from "@embertoast/core";
import { Toaster } from "./Toaster";
import { roleForToast } from "./ToastItem";

function fixture(overrides: Partial<Toast>): Toast {
  return {
    id: "t1",
    type: "default",
    message: "hi",
    createdAt: 0,
    duration: 4000,
    position: "bottom-right",
    dismissible: true,
    ariaLive: "polite",
    paused: false,
    ...overrides,
  };
}

// The ARIA-role mapping is the accessibility contract and is pure, so it can be
// asserted directly.
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

describe("Toaster", () => {
  beforeEach(() => {
    store.dismiss();
  });

  it("renders a toast message", () => {
    render(<Toaster />);
    act(() => {
      toast.success("Saved");
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("groups by position into aria-live regions", () => {
    render(<Toaster />);
    act(() => {
      toast("x", { position: "top-left" });
    });
    const region = screen.getByText("x").closest("[aria-live]");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("data-position", "top-left");
  });

  it("renders an action button that fires its handler", () => {
    let clicked = false;
    render(<Toaster />);
    act(() => {
      toast("with action", {
        action: { label: "Undo", onClick: () => (clicked = true) },
      });
    });
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(clicked).toBe(true);
  });

  it("close button dismisses (plays the leave animation, then unmounts)", () => {
    render(<Toaster closeButton />);
    act(() => {
      toast("x");
    });
    fireEvent.click(screen.getByLabelText("Close"));
    // Dismiss removes the toast from the store, but the presence layer keeps it
    // mounted to animate out; it's gone for good once the leave animation ends.
    const ghost = screen.getByText("x").closest(".et-toast") as HTMLElement;
    expect(ghost).toHaveClass("et-exit");
    act(() => {
      fireEvent.animationEnd(ghost);
    });
    expect(screen.queryByText("x")).not.toBeInTheDocument();
  });

  it("renders a close button when the toast is dismissible even without closeButton prop", () => {
    render(<Toaster />);
    act(() => {
      toast("x", { dismissible: true });
    });
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  it("limits rendered toasts to visibleToasts per position", () => {
    const { container } = render(<Toaster visibleToasts={2} />);
    act(() => {
      toast("a");
      toast("b");
      toast("c");
    });
    expect(container.querySelectorAll(".et-toast")).toHaveLength(2);
  });
});

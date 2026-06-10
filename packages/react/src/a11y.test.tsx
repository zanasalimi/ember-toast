import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { toast, store } from "@embertoast/core";
import { Toaster } from "./Toaster";

describe("a11y", () => {
  beforeEach(() => {
    store.dismiss();
  });

  it("error toast uses role=alert; others role=status", () => {
    render(<Toaster position="top-left" />);
    act(() => {
      toast.error("boom", { position: "top-left" });
      toast.success("ok", { position: "bottom-right" });
    });
    expect(screen.getByText("boom").closest("[role]")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.getByText("ok").closest("[role]")).toHaveAttribute(
      "role",
      "status",
    );
  });

  it("an error in a region makes that region assertive", () => {
    render(<Toaster />);
    act(() => {
      toast.error("boom");
    });
    const region = screen.getByText("boom").closest("[aria-live]");
    expect(region).toHaveAttribute("aria-live", "assertive");
  });

  it("a polite region stays polite", () => {
    render(<Toaster />);
    act(() => {
      toast.success("ok");
    });
    const region = screen.getByText("ok").closest("[aria-live]");
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("never moves focus when a toast appears", () => {
    render(
      <>
        <button>anchor</button>
        <Toaster />
      </>,
    );
    const anchor = screen.getByText("anchor");
    anchor.focus();
    expect(document.activeElement).toBe(anchor);
    act(() => {
      toast("x");
    });
    expect(document.activeElement).toBe(anchor);
  });

  it("never moves focus when an error toast appears (assertive)", () => {
    render(
      <>
        <button>anchor</button>
        <Toaster />
      </>,
    );
    const anchor = screen.getByText("anchor");
    anchor.focus();
    act(() => {
      toast.error("boom");
    });
    expect(document.activeElement).toBe(anchor);
  });
});

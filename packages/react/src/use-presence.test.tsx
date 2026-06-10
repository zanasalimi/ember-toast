import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { toast, store } from "@embertoast/core";
import { Toaster } from "./Toaster";

describe("leave animation presence", () => {
  beforeEach(() => {
    store.dismiss();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("keeps a dismissed toast in the DOM (exiting) then removes it on animationend", () => {
    render(<Toaster />);
    let id = "";
    act(() => {
      id = toast("bye");
    });
    expect(screen.getByText("bye")).toBeInTheDocument();

    // Dismiss removes it from the store immediately…
    act(() => {
      store.dismiss(id);
    });
    // …but the presence layer keeps it mounted for the exit animation.
    const ghost = screen.getByText("bye").closest(".et-toast") as HTMLElement;
    expect(ghost).toBeInTheDocument();
    expect(ghost).toHaveClass("et-exit");
    expect(ghost).toHaveAttribute("data-exiting");

    // animationend retires the ghost.
    act(() => {
      fireEvent.animationEnd(ghost);
    });
    expect(screen.queryByText("bye")).not.toBeInTheDocument();
  });

  it("force-drops the ghost via the timeout fallback if animationend never fires", () => {
    vi.useFakeTimers();
    try {
      render(<Toaster />);
      let id = "";
      act(() => {
        id = toast("stuck");
      });
      act(() => {
        store.dismiss(id);
      });
      // Still present, mid-exit, with no animationend event coming.
      expect(screen.getByText("stuck")).toBeInTheDocument();

      // Advancing past the fallback window retires it without any animation event.
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.queryByText("stuck")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("removes instantly under prefers-reduced-motion (no exit phase)", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    );

    render(<Toaster />);
    let id = "";
    act(() => {
      id = toast("instant");
    });
    expect(screen.getByText("instant")).toBeInTheDocument();

    act(() => {
      store.dismiss(id);
    });
    // No ghost: reduced motion skips the exit phase entirely.
    expect(screen.queryByText("instant")).not.toBeInTheDocument();
  });

  it("does not keep an exiting ghost if the same id is re-added (resurrected)", () => {
    render(<Toaster />);
    let id = "";
    act(() => {
      id = toast("again");
    });
    act(() => {
      store.dismiss(id);
    });
    // Re-add with the same id before the exit finishes.
    act(() => {
      toast("again", { id });
    });
    // Exactly one live element, and it's not flagged as exiting.
    const items = document.querySelectorAll(".et-toast");
    expect(items).toHaveLength(1);
    expect(items[0]).not.toHaveClass("et-exit");
  });
});

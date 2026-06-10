import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { toast, store } from "@embertoast/core";
import { Toaster } from "./Toaster";

describe("FLIP reflow", () => {
  beforeEach(() => {
    store.dismiss();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies an inverted transform to survivors when a toast above is removed", () => {
    // Deterministic measured tops: each measured element reads a new, larger top
    // so removal shifts survivors and FLIP has a non-zero delta to invert.
    let y = 0;
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: (y += 40),
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 40,
          x: 0,
          y: 0,
          toJSON() {},
        } as DOMRect;
      });

    // jsdom provides rAF, but pin it to a synchronous shim so the "play" phase
    // runs inside this test instead of a later tick.
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    const { container } = render(<Toaster />);
    let a = "";
    act(() => {
      a = toast("a");
      toast("b");
    });
    act(() => {
      store.dismiss(a);
    });

    const survivor = container.querySelector(".et-toast") as HTMLElement;
    expect(survivor).not.toBeNull();
    // FLIP either left a transient transform or completed the play and flagged it.
    expect(
      survivor.style.transform !== "" || survivor.dataset.flip === "done",
    ).toBe(true);

    rectSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it("skips the transform under prefers-reduced-motion", () => {
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

    let y = 0;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return {
          top: (y += 40),
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 40,
          x: 0,
          y: 0,
          toJSON() {},
        } as DOMRect;
      },
    );

    const { container } = render(<Toaster />);
    let a = "";
    act(() => {
      a = toast("a");
      toast("b");
    });
    act(() => {
      store.dismiss(a);
    });

    const survivor = container.querySelector(".et-toast") as HTMLElement;
    expect(survivor.style.transform).toBe("");
    expect(survivor.dataset.flip).toBeUndefined();
  });
});

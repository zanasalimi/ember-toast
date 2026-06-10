import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { toast, store } from "@embertoast/core";
import { useToasts } from "./use-toasts";

function Probe() {
  const toasts = useToasts();
  return <div data-testid="count">{toasts.length}</div>;
}

describe("useToasts", () => {
  beforeEach(() => {
    store.dismiss();
  });

  it("starts empty", () => {
    render(<Probe />);
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("re-renders when a toast is added", () => {
    render(<Probe />);
    expect(screen.getByTestId("count").textContent).toBe("0");
    act(() => {
      toast("hi");
    });
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("re-renders when a toast is dismissed", () => {
    render(<Probe />);
    let id = "";
    act(() => {
      id = toast("hi");
    });
    expect(screen.getByTestId("count").textContent).toBe("1");
    act(() => {
      store.dismiss(id);
    });
    expect(screen.getByTestId("count").textContent).toBe("0");
  });
});

import { describe, it, expect } from "vitest";
import { shouldDismiss, DEFAULT_THRESHOLD } from "./use-swipe";

describe("swipe threshold", () => {
  const threshold = { distance: 80, velocity: 0.5 };

  it("dismisses past the distance threshold (slow drag, far)", () => {
    expect(shouldDismiss({ dx: 120, vx: 0 }, threshold)).toBe(true);
  });

  it("dismisses on a fast flick even under the distance threshold", () => {
    expect(shouldDismiss({ dx: 30, vx: 1.2 }, threshold)).toBe(true);
  });

  it("snaps back when under both distance and velocity", () => {
    expect(shouldDismiss({ dx: 20, vx: 0.1 }, threshold)).toBe(false);
  });

  it("treats direction symmetrically (negative dx/vx)", () => {
    expect(shouldDismiss({ dx: -120, vx: 0 }, threshold)).toBe(true);
    expect(shouldDismiss({ dx: -30, vx: -1.2 }, threshold)).toBe(true);
    expect(shouldDismiss({ dx: -20, vx: -0.1 }, threshold)).toBe(false);
  });

  it("dismisses exactly at the distance threshold (inclusive)", () => {
    expect(shouldDismiss({ dx: 80, vx: 0 }, threshold)).toBe(true);
  });

  it("dismisses exactly at the velocity threshold (inclusive)", () => {
    expect(shouldDismiss({ dx: 0, vx: 0.5 }, threshold)).toBe(true);
  });

  it("uses the default threshold when none is provided", () => {
    expect(DEFAULT_THRESHOLD).toEqual({ distance: 80, velocity: 0.5 });
    expect(shouldDismiss({ dx: 100, vx: 0 })).toBe(true);
    expect(shouldDismiss({ dx: 10, vx: 0.1 })).toBe(false);
  });
});

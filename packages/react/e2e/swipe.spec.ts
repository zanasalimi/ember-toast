import { test, expect } from "@playwright/test";

// TODO(M3): drive the docs playground. These name the gesture/animation guarantees
// that only a real browser can verify.

test.describe("swipe-to-dismiss", () => {
  test.skip("flings a toast out past the velocity threshold", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /show toast/i }).click();
    const toast = page.getByRole("status").first();
    await expect(toast).toBeVisible();
    // pointer drag past threshold → toast leaves the DOM
  });

  test.skip("snaps back when the drag is under threshold", async ({ page }) => {
    await page.goto("/");
    // short drag → toast returns to rest, stays visible
  });
});

test.describe("FLIP reflow", () => {
  test.skip("survivors slide when a middle toast is removed", async ({ page }) => {
    await page.goto("/");
    // fire 3, dismiss the middle, assert the top one's box translates smoothly (no jump)
  });
});

test.describe("pause-on-hover", () => {
  test.skip("auto-dismiss is held while the pointer is over the stack", async ({ page }) => {
    await page.goto("/");
    // hover during the countdown, wait past the duration, assert still visible
  });
});

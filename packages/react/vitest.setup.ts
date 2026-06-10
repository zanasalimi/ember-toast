import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// `globals: false` disables Testing Library's automatic post-test cleanup
// (it hooks the global afterEach). Register it explicitly so each test starts
// from a clean DOM and unmounted React trees — otherwise repeated renders pile
// up and queries match across tests.
afterEach(() => {
  cleanup();
});

/**
 * Compile-time inference guard for `toast.promise`.
 *
 * This file is type-only (no runtime assertions, never executed by vitest). It lives
 * under `src/` so `tsc --noEmit` (the package `typecheck`) compiles it; if the callback
 * inference for `toast.promise` regresses, this file fails to compile and typecheck goes
 * red. There is no `expect-type`/`tsd` dependency in the workspace, so the assertions are
 * expressed directly: a `.name` access proves `data` was inferred (not `unknown`), and a
 * `@ts-expect-error` block proves the inference is genuinely narrowed rather than `any`.
 */

import { toast } from "./toast";

// The success/error params MUST infer from the promise with NO hand annotation.
// `data.name` only compiles if `data` is `{ name: string }`; on `unknown` it errors.
toast.promise(Promise.resolve({ name: "a" }), {
  loading: "l",
  success: (data) => data.name,
  error: (e) => String(e),
});

// Inference must survive a richer settled type, including method/property access.
toast.promise(Promise.resolve({ id: 1, tags: ["x"] as string[] }), {
  loading: "l",
  success: (data) => `#${data.id} (${data.tags.length})`,
  error: (e) => String(e),
});

// Negative guard: if inference regressed to `unknown`/`any`, the body below would
// compile and this `@ts-expect-error` would become an *unused* directive — which
// `tsc` reports as an error. So this line is green ONLY while `data` is narrowed.
toast.promise(Promise.resolve({ name: "a" }), {
  loading: "l",
  // @ts-expect-error - `data` is `{ name: string }`, so `.missing` is not a property
  success: (data) => data.missing,
  error: (e) => String(e),
});

import { defineConfig } from "tsup";

// Dual ESM + CJS with emitted declarations. Keep the core dependency-free so the
// output is fully tree-shakeable; `sideEffects: false` in package.json does the rest.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
});

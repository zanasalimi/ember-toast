import { defineConfig } from "tsup";

// React binding: dual ESM/CJS, declarations emitted, CSS copied to dist as a
// separately-importable side-effect file. `react`/`react-dom` stay external
// (peer deps), and the core is bundled in for a single drop-in artifact.
export default defineConfig({
  entry: ["src/index.ts", "src/styles.css"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  loader: { ".css": "copy" },
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
});

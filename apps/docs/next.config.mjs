import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolve to the monorepo root (two levels up from apps/docs). Using
// fileURLToPath + path.resolve yields a real OS path (e.g. D:\...\embertoast on
// Windows) — unlike `new URL("../../", import.meta.url).pathname`, which leaves a
// leading slash before the drive letter and makes Next trace from the drive root,
// dumping a stray standalone tree outside the app.
const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output so the Docker runtime stage is a thin node:alpine image.
  output: "standalone",
  reactStrictMode: true,
  // Transpile the workspace packages from source — dogfoods the unpublished build.
  transpilePackages: ["@embertoast/core", "@embertoast/react"],
  // The monorepo root, so standalone tracing picks up workspace deps correctly and
  // writes the standalone tree under apps/docs/.next, not at the filesystem root.
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;

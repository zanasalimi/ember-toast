import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolve to the monorepo root (two levels up from apps/docs). Using
// fileURLToPath + path.resolve yields a real OS path (e.g. D:\...\embertoast on
// Windows) — unlike `new URL("../../", import.meta.url).pathname`, which leaves a
// leading slash before the drive letter and makes Next trace from the drive root,
// dumping a stray standalone tree outside the app.
const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Two build targets share this app:
//   • default → `output: "standalone"`, a thin self-hosted server for Docker.
//   • PAGES=1 → a fully static export under a project-pages base path, for the
//     GitHub Pages demo at https://<user>.github.io/<repo>/.
const isPages = process.env.PAGES === "1";
// Repo name = the GitHub Pages sub-path. Overridable so a fork/rename just sets it.
const basePath = process.env.PAGES_BASE_PATH ?? "/ember-toast";

/** @type {import('next').NextConfig} */
const nextConfig = isPages
  ? {
      output: "export",
      basePath,
      // Pages has no image optimizer; serve sources as-is. (No next/image today,
      // but this keeps the export valid if one is added.)
      images: { unoptimized: true },
      trailingSlash: true,
      reactStrictMode: true,
      transpilePackages: ["@embertoast/core", "@embertoast/react"],
    }
  : {
      // Standalone output so the Docker runtime stage is a thin node:alpine image.
      output: "standalone",
      reactStrictMode: true,
      // Transpile the workspace packages from source — dogfoods the unpublished build.
      transpilePackages: ["@embertoast/core", "@embertoast/react"],
      // The monorepo root, so standalone tracing picks up workspace deps correctly
      // and writes the standalone tree under apps/docs/.next, not the FS root.
      outputFileTracingRoot: monorepoRoot,
    };

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output so the Docker runtime stage is a thin node:24-alpine image.
  output: "standalone",
  reactStrictMode: true,
  // Transpile the workspace packages from source — dogfoods the unpublished build.
  transpilePackages: ["@embertoast/core", "@embertoast/react"],
  experimental: {
    // The monorepo root, so standalone tracing picks up workspace deps correctly.
    outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
  },
};

export default nextConfig;

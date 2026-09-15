import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  outputFileTracingIncludes: {
    "/*": [
      "./data/snapshots/**/*.csv",
      "./node_modules/@fontsource/noto-sans-devanagari/files/*.woff",
    ],
  },
};

export default nextConfig;

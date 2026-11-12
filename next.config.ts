import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add remote patterns here when using external image hosts
    remotePatterns: [],
  },
  // Required for JSON imports in lib/data/json-provider.ts
  experimental: {},
};

export default nextConfig;

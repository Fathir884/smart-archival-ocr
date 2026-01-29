import type { NextConfig } from "next";

// Check if we're building for Android (via environment variable)
const isAndroidBuild = process.env.BUILD_TARGET === 'android';

const nextConfig: NextConfig = {
  // Enable static export only for Android build
  ...(isAndroidBuild && { output: 'export' }),

  images: {
    unoptimized: true,
  },

  // Trailing slash only for Android
  ...(isAndroidBuild && { trailingSlash: true }),
};

export default nextConfig;

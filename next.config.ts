import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // All imagery is local (public/images/*) and pre-sized to the design; skip the
  // optimizer so the app renders identically with zero external image config.
  images: {
    unoptimized: true,
  },
  // The design export lives inside the repo but is not part of the app build.
  outputFileTracingExcludes: {
    "*": ["./VFinal - HTML/**"],
  },
};

export default nextConfig;

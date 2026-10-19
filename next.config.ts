import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client-store demo workbench: disable Cache Components so pathname/params
  // in shared shell do not block prerender of dynamic routes.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained build for the VPS deploy (see DEPLOY.md) — bundles only
  // the files node needs to run, no full node_modules copy on the server.
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;

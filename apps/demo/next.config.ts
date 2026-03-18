import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@promptkit/core",
    "@promptkit/protocol",
    "@promptkit/react",
    "@promptkit/widget-pack-essentials",
  ],
}

export default nextConfig

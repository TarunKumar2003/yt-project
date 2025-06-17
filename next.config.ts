import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Set this according to your file size needs
    },
  },
};

export default nextConfig;

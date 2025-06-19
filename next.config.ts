import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/compet-lean-start-up.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;

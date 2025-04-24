import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bỏ qua lỗi dynamic routes
  experimental: {
    appDir: true,
  },
  distDir: 'out',
};

export default nextConfig;

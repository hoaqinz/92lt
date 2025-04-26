import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['imagedelivery.net'], // Cho phép ảnh từ Cloudflare Images
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: 'out',
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;

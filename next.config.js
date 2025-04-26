/** @type {import('next').NextConfig} */
const nextConfig = {
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
  distDir: 'out',
  experimental: {
    // Tắt kiểm tra tham số động
    disableRouteValidation: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
  // Removed 'output: export' to allow middleware usage
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

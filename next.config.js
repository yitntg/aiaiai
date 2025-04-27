/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  // Cloudflare Pages 适配
  output: 'standalone',
};

module.exports = nextConfig; 
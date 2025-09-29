/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["api.stability.ai"],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;

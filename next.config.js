/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.stability.ai"],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;

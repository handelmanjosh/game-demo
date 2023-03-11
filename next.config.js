/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

const nextConfig = {
  reactStrictMode: true,
  
}

module.exports = nextConfig

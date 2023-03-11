/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,  
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}





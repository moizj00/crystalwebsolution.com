/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode is intentionally OFF so the WebGL context isn't
  // double-created in dev. Do not turn it back on.
  reactStrictMode: false,
  // Standalone output traces only the node_modules the server actually
  // needs into .next/standalone — required for the slim Docker runner stage.
  output: 'standalone',
  // Enable SWR caching and aggressive minification
  swcMinify: true,
  // Optimize images with aggressive sizing
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Enable compression and optimize for fast builds
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable experimental optimizations for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['three'],
  },
  // Cache all headers aggressively
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
};

module.exports = nextConfig;

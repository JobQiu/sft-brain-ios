/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Always use 'export' for Capacitor mobile builds
  output: 'export',
  // Disable Vercel Analytics
  experimental: {
    webVitalsAttribution: [],
  },
  // Allow Android emulator and local network access during development
  allowedDevOrigins: ['10.0.2.2', '192.168.1.127', 'localhost'],
  // Add cache headers for optimization
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images for 30 days
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, must-revalidate',
          },
        ],
      },
      {
        // HTML pages - cache for 1 hour with revalidation
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.example.com" },
      { protocol: "https", hostname: "pub-*.r2.dev" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**" }
    ],
    formats: ['image/avif', 'image/webp'],
  },
  typedRoutes: false,
  productionBrowserSourceMaps: true,
  output: 'standalone',
  staticPageGenerationTimeout: 300,
  experimental: {
    workerThreads: false,
    cpus: 1,
    staleTimes: {
      dynamic: 30,
      static: 180,
    }
  }
};

export default nextConfig;

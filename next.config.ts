import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'zod'],
    staleTimes: {
      dynamic: 30, // Cache dynamic pages client-side for 30 seconds
      static: 300, // Cache static pages client-side for 5 minutes
    },
  },
};

export default nextConfig;

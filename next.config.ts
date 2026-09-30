import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // `/home` is the default route; LayoutWrapper sends logged-out users to `/login`
  async redirects() {
    return [{ source: '/', destination: '/home', permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Vimeo thumbnail CDN
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      // AWS S3 bucket (elance media)
      {
        protocol: 'https',
        hostname: 'mybucketelance.s3.ap-south-1.amazonaws.com',
      },
      // Any other S3 bucket in ap-south-1
      {
        protocol: 'https',
        hostname: '*.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;

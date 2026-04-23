import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
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

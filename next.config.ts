
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9004-firebase-studio-1750086716916.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev',
      'http://localhost:9004', // Assuming your local dev port is 9004
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    // In development, proxy /api/* to local FastAPI server
    // In production, Vercel's vercel.json handles the rewrite to Railway
    const isDev = process.env.NODE_ENV !== 'production';
    return isDev
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;

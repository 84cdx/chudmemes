/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For easier deployment to static hosts and StackBlitz compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.thecatapi.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  eslint: {
    // Désactiver ESLint pendant le build en production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Désactiver les vérifications TypeScript pendant le build en production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: 'cdn.coingecko.com' },
      { protocol: 'https', hostname: 'assets.investy-static.com' },
    ],
  },
  // Headers désactivés temporairement pour éviter les conflits
  // async headers() {
  //   return [];
  // },
};

module.exports = nextConfig;



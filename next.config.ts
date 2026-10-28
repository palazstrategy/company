import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const isExport = process.env.NEXT_EXPORT === '1';

const nextConfig: NextConfig = {
  ...(isExport && { output: 'export', trailingSlash: true }),
  ...(!isExport && {
    async redirects() {
      return [
        { source: '/about', destination: '/sobre', permanent: true },
        { source: '/en/about', destination: '/en/sobre', permanent: true },
        { source: '/contact', destination: '/contato', permanent: true },
        { source: '/en/contact', destination: '/en/contato', permanent: true },
        { source: '/privacy', destination: '/politica-de-privacidade', permanent: true },
        { source: '/en/privacy', destination: '/en/politica-de-privacidade', permanent: true },
      ];
    },
  }),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);

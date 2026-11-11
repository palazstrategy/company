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
        // Redirecionamento de resíduos da antiga página de produto do Fatuz para o case oficial
        { source: '/produtos/fatuz', destination: '/cases/fatuz', permanent: true },
        { source: '/en/produtos/fatuz', destination: '/en/cases/fatuz', permanent: true },
        { source: '/fatuz', destination: '/cases/fatuz', permanent: true },
        { source: '/en/fatuz', destination: '/en/cases/fatuz', permanent: true },
      ];
    },
    async headers() {
      return [
        {
          // Impede o Googlebot de tentar indexar imagens e fontes como se fossem páginas HTML
          source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|otf|mp4|webm)',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
        },
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

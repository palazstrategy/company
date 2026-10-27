import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/editor/', '/proposta/', '/diagnostico/'],
    },
    sitemap: 'https://palazstrategy.vercel.app/sitemap.xml',
  };
}

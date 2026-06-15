import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/editor/'],
    },
    sitemap: 'https://palaz.com.br/sitemap.xml',
  };
}

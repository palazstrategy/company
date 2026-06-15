import { MetadataRoute } from 'next';
import { getProjects } from '@/data/projects';

const BASE_URL = 'https://palazstrategy.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  
  // Rotas estáticas
  const staticPaths = ['', '/cases', '/sobre', '/contato', '/produtos/fatuz', '/politica-de-privacidade'];
  
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
    alternates: {
      languages: {
        'pt-BR': `${BASE_URL}${route}`,
        'en-US': `${BASE_URL}/en${route}`,
        'x-default': `${BASE_URL}${route}`,
      }
    }
  }));

  // Rotas dinâmicas dos cases
  const projectRoutes: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${BASE_URL}/cases/${project.slug}`,
    lastModified: new Date(), 
    changeFrequency: 'weekly',
    priority: 0.6,
    alternates: {
      languages: {
        'pt-BR': `${BASE_URL}/cases/${project.slug}`,
        'en-US': `${BASE_URL}/en/cases/${project.slug}`,
      }
    }
  }));

  return [...staticRoutes, ...projectRoutes];
}

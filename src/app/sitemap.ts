import { MetadataRoute } from 'next';
import { getProjects } from '@/data/projects';

const BASE_URL = 'https://palazstrategy.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  
  // Rotas estáticas canônicas (exclusivamente páginas HTML indexáveis)
  const staticPaths = [
    '',
    '/cases',
    '/sobre',
    '/contato',
    '/politica-de-privacidade'
  ];
  
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
    },
    images: route === '' ? [`${BASE_URL}/imagem-compartilhamento.png`, `${BASE_URL}/logo-palaz.png`] : undefined
  }));

  // Rotas dinâmicas dos cases
  const projectRoutes: MetadataRoute.Sitemap = projects.map(project => {
    const images: string[] = [];
    if (project.imageSrc) {
      images.push(project.imageSrc.startsWith('http') ? project.imageSrc : `${BASE_URL}${project.imageSrc.startsWith('/') ? '' : '/'}${project.imageSrc}`);
    }
    if (project.contentBlocks) {
      for (const block of project.contentBlocks) {
        if (block.type === 'image' && block.content && typeof block.content === 'string') {
          images.push(block.content.startsWith('http') ? block.content : `${BASE_URL}${block.content.startsWith('/') ? '' : '/'}${block.content}`);
        } else if ((block.type === 'photo-grid' || block.type === 'grid') && Array.isArray(block.images)) {
          for (const img of block.images) {
            images.push(img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`);
          }
        }
      }
    } else if (project.galleryImages) {
      for (const img of project.galleryImages) {
        images.push(img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`);
      }
    }

    return {
      url: `${BASE_URL}/cases/${project.slug}`,
      lastModified: new Date(), 
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'pt-BR': `${BASE_URL}/cases/${project.slug}`,
          'en-US': `${BASE_URL}/en/cases/${project.slug}`,
        }
      },
      images: Array.from(new Set(images))
    };
  });

  return [...staticRoutes, ...projectRoutes];
}

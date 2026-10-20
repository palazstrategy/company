import React from 'react';
import { Project } from '@/types';

interface CaseJsonLdProps {
  project: Project;
  title: string;
  description: string;
  category: string;
  url: string;
  baseUrl: string;
}

export function CaseJsonLd({
  project,
  title,
  description,
  category,
  url,
  baseUrl,
}: CaseJsonLdProps) {
  const images: { url: string; caption: string }[] = [];

  const formatUrl = (src: string) => {
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  if (project.imageSrc) {
    images.push({
      url: formatUrl(project.imageSrc),
      caption: `${title} - Capa | Palaz Strategy & Design`,
    });
  }

  if (project.contentBlocks && project.contentBlocks.length > 0) {
    project.contentBlocks.forEach((block: any, idx: number) => {
      if (block.type === 'image' && block.content) {
        images.push({
          url: formatUrl(block.content),
          caption: `${title}${category ? ` - ${category}` : ''} | Palaz Strategy & Design (Imagem ${idx + 1})`,
        });
      } else if (
        (block.type === 'photo-grid' || block.type === 'grid') &&
        Array.isArray(block.images)
      ) {
        block.images.forEach((img: string, iIdx: number) => {
          images.push({
            url: formatUrl(img),
            caption: `${title}${category ? ` - ${category}` : ''} | Palaz Strategy & Design (Grade ${iIdx + 1})`,
          });
        });
      }
    });
  } else if (project.galleryImages && project.galleryImages.length > 0) {
    project.galleryImages.forEach((img: string, idx: number) => {
      images.push({
        url: formatUrl(img),
        caption: `${title} | Palaz Strategy & Design (${idx + 1})`,
      });
    });
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    headline: title,
    description: description,
    url: url,
    creator: {
      '@type': 'Organization',
      name: 'Palaz Strategy Company',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Palaz Strategy Company',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icone-palaz.png`,
      },
    },
    image: images.map((img) => img.url),
    hasPart: images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: img.url,
      caption: img.caption,
      name: img.caption,
      representativeOfPage: img.url === formatUrl(project.imageSrc),
      author: {
        '@type': 'Organization',
        name: 'Palaz Strategy Company',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
    />
  );
}

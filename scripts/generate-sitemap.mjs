import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://palazstrategy.vercel.app';

function getProjects() {
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(raw);
}

function getPtTranslations() {
  const ptPath = path.join(process.cwd(), 'src', 'messages', 'pt.json');
  const raw = fs.readFileSync(ptPath, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.ProjectsData || {};
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemapXml() {
  const projects = getProjects();
  const translations = getPtTranslations();

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'monthly' },
    { path: '/cases', priority: '0.9', changefreq: 'weekly' },
    { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
    { path: '/contato', priority: '0.8', changefreq: 'monthly' },
    { path: '/politica-de-privacidade', priority: '0.3', changefreq: 'yearly' },
    { path: '/llms.txt', priority: '0.5', changefreq: 'monthly' },
    { path: '/openapi.json', priority: '0.5', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  const today = new Date().toISOString().split('T')[0];

  // Static routes
  for (const route of staticRoutes) {
    const isRoot = route.path === '';
    const locPt = `${BASE_URL}${route.path}`;
    const locEn = `${BASE_URL}/en${route.path}`;

    xml += `  <url>
    <loc>${locPt}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${locPt}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${locEn}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locPt}" />
`;

    if (isRoot) {
      xml += `    <image:image>
      <image:loc>${BASE_URL}/imagem-compartilhamento.png</image:loc>
      <image:title>Palaz Strategy Company | Estúdio de Design &amp; Branding</image:title>
    </image:image>
    <image:image>
      <image:loc>${BASE_URL}/logo-palaz.png</image:loc>
      <image:title>Logo Palaz Strategy &amp; Design</image:title>
    </image:image>
`;
    }

    xml += `  </url>\n`;
  }

  // Project routes with Google Image Sitemap
  for (const project of projects) {
    const slug = project.slug;
    const projectInfo = translations[slug] || {};
    const title = projectInfo.title || slug;
    const category = projectInfo.category || '';
    const fullTitle = `${title}${category ? ` - ${category}` : ''} | Palaz Strategy & Design`;

    const locPt = `${BASE_URL}/cases/${slug}`;
    const locEn = `${BASE_URL}/en/cases/${slug}`;

    const projectImages = [];
    if (project.imageSrc) {
      projectImages.push(project.imageSrc);
    }
    if (project.contentBlocks && project.contentBlocks.length > 0) {
      for (const block of project.contentBlocks) {
        if (block.type === 'image' && block.content) {
          projectImages.push(block.content);
        } else if ((block.type === 'photo-grid' || block.type === 'grid') && Array.isArray(block.images)) {
          for (const img of block.images) {
            projectImages.push(img);
          }
        }
      }
    } else if (project.galleryImages) {
      for (const img of project.galleryImages) {
        projectImages.push(img);
      }
    }

    const uniqueImages = Array.from(new Set(projectImages));

    xml += `  <url>
    <loc>${locPt}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${locPt}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${locEn}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locPt}" />
`;

    for (let i = 0; i < uniqueImages.length; i++) {
      const imgPath = uniqueImages[i];
      const imgUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
      const imgCaption = `${fullTitle} (Foto ${i + 1})`;

      xml += `    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(imgCaption)}</image:caption>
    </image:image>
`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

const xml = generateSitemapXml();
const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, xml, 'utf8');
console.log(`Sitemap gerado com sucesso em: ${publicPath}`);

// Se a pasta dist existir, copia para ela também
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  const distPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(distPath, xml, 'utf8');
  console.log(`Sitemap copiado para: ${distPath}`);
}

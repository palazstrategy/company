/**
 * Agentic Markdown handler for content negotiation (acceptmarkdown.com) and agent-friendly 404s.
 */

const KNOWN_SLUGS = [
  'ncglass-vidracaria',
  'fatuz',
  'sland-inteligencia-produtiva',
  'aira-essence',
  'acougue-almeida'
];

export function isKnownPath(pathname: string): boolean {
  // Normalize path: strip trailing slash except for root
  let clean = pathname.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Strip locale prefix if present (/pt or /en)
  let route = clean;
  if (route === '/pt' || route === '/en') {
    route = '/';
  } else if (route.startsWith('/pt/') || route.startsWith('/en/')) {
    route = route.slice(3); // Remove /pt or /en
  }

  // Known root/static routes
  const staticRoutes = [
    '/',
    '/cases',
    '/sobre',
    '/contato',
    '/politica-de-privacidade',
    '/llms.txt',
    '/robots.txt',
    '/sitemap.xml'
  ];

  if (staticRoutes.includes(route)) {
    return true;
  }

  // Known dynamic routes: /cases/:slug
  if (route.startsWith('/cases/')) {
    const slug = route.slice('/cases/'.length);
    if (KNOWN_SLUGS.includes(slug)) {
      return true;
    }
  }

  return false;
}

export function getNotFoundMarkdown(pathname: string): string {
  return `# 404 - Page Not Found

The requested resource \`${pathname}\` was not found on Palaz Strategy Company.

Please use the following links to find what you are looking for:
- [Homepage](https://palazstrategy.vercel.app/) — Strategic Design & Branding Studio
- [Cases](https://palazstrategy.vercel.app/cases) — Selected portfolio projects
- [About](https://palazstrategy.vercel.app/sobre) — Studio philosophy and methodology
- [Contact](https://palazstrategy.vercel.app/contato) — Project inquiries and discovery calls
- [Sitemap](https://palazstrategy.vercel.app/sitemap.xml) — Full machine-readable site index
- [LLMs Guide](https://palazstrategy.vercel.app/llms.txt) — Agent instructions and API references
`;
}

export function getPageMarkdown(pathname: string): string {
  let clean = pathname.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  let route = clean;
  const isEn = route === '/en' || route.startsWith('/en/');
  if (route === '/pt' || route === '/en') {
    route = '/';
  } else if (route.startsWith('/pt/') || route.startsWith('/en/')) {
    route = route.slice(3);
  }

  if (route === '/') {
    return isEn ? getHomeMarkdownEn() : getHomeMarkdownPt();
  }

  if (route === '/cases') {
    return isEn ? getCasesMarkdownEn() : getCasesMarkdownPt();
  }

  if (route.startsWith('/cases/')) {
    const slug = route.slice('/cases/'.length);
    return getCaseDetailMarkdown(slug, isEn);
  }

  if (route === '/sobre') {
    return isEn ? getAboutMarkdownEn() : getAboutMarkdownPt();
  }

  if (route === '/contato') {
    return isEn ? getContactMarkdownEn() : getContactMarkdownPt();
  }

  if (route === '/politica-de-privacidade') {
    return isEn ? getPrivacyMarkdownEn() : getPrivacyMarkdownPt();
  }

  return getNotFoundMarkdown(pathname);
}

function getHomeMarkdownPt(): string {
  return `# Palaz Strategy Company — Estúdio de Design Estratégico & Branding

> A estratégia dá a direção. O design dá a forma.
> Propósito, estratégia e presença em todos os pontos de contato.

Palaz é um estúdio de design estratégico com sede em Belo Horizonte - MG, focado em transformar empresas em marcas sólidas e memoráveis.

## O que a Palaz faz

- **Estratégia & Posicionamento de Marca**: Arquitetura de marca, direcionamento estratégico e análise de posicionamento.
- **Identidade Visual & Branding**: Criação de logotipos, manuais de marca, sistemas visuais, tipografia e paletas de cores.
- **Naming**: Criação estratégica de nomes comerciais para marcas e produtos.
- **UI/UX Design**: Design de interfaces digitais elegantes e focadas em conversão.
- **Embalagens & Design de Produto**: Soluções visuais táteis para prateleiras e ponto de venda.
- **Motion Design**: Animações de marca para touchpoints digitais.

## Cases de Sucesso Selecionados

- [NcGlass Vidraçaria](https://palazstrategy.vercel.app/cases/ncglass-vidracaria) (2026) — Branding e Identidade Visual para vidraçaria de alto padrão.
- [Fatuz](https://palazstrategy.vercel.app/cases/fatuz) (2026) — Branding, Naming, UI/UX e Web Design para plataforma de faturas inteligentes.
- [Sland Inteligência Produtiva](https://palazstrategy.vercel.app/cases/sland-inteligencia-produtiva) (2025) — Branding, Embalagem e Naming.
- [Aira Essence](https://palazstrategy.vercel.app/cases/aira-essence) (2024) — Branding e Identidade Visual para cosméticos naturais.
- [Açougue Almeida](https://palazstrategy.vercel.app/cases/acougue-almeida) (2025) — Identidade Visual e Embalagens para açougue artesanal.

Ver todos os cases: https://palazstrategy.vercel.app/cases

## Quando acionar a Palaz

Acione a Palaz quando você precisar:
- Criar uma nova marca do zero (estratégia, naming, identidade visual e manual da marca).
- Fazer um rebranding para reposicionar sua empresa no mercado premium.
- Desenvolver interface digital (UI/UX) alinhada à estratégia do negócio.
- Elevar a percepção de valor dos seus produtos através de embalagens e design tátil.

## Contato e Agendamento

- **Website**: https://palazstrategy.vercel.app
- **E-mail**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **WhatsApp**: [+55 31 96117847](https://wa.me/553196117847)
- **Localização**: Belo Horizonte, MG — Brasil (atendimento global remoto)
- **Sitemap**: https://palazstrategy.vercel.app/sitemap.xml
- **Instruções para Agentes**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getHomeMarkdownEn(): string {
  return `# Palaz Strategy Company — Strategic Design & Branding Studio

> Strategy gives direction. Design creates the form.
> Purpose, strategy, and presence across all touchpoints.

Palaz is a strategic design studio based in Belo Horizonte, Brazil, focused on transforming companies into solid and memorable brands.

## What Palaz Does

- **Brand Strategy & Positioning**: Brand architecture, strategic direction, and market differentiation.
- **Visual Identity & Branding**: Logo creation, brand books, design systems, typography, and color theory.
- **Naming**: Strategic name development for companies, services, and products.
- **UI/UX Design**: Premium digital interfaces built for clarity, engagement, and conversion.
- **Packaging Design**: Distinctive physical brand touchpoints and product packaging.
- **Motion Design**: Expressive brand animations across digital channels.

## Selected Client Cases

- [NcGlass Vidraçaria](https://palazstrategy.vercel.app/en/cases/ncglass-vidracaria) (2026) — Branding & Visual Identity for premium architectural glazing.
- [Fatuz](https://palazstrategy.vercel.app/en/cases/fatuz) (2026) — Branding, Naming, UI/UX & Web Design for a smart billing platform.
- [Sland Inteligência Produtiva](https://palazstrategy.vercel.app/en/cases/sland-inteligencia-produtiva) (2025) — Branding, Packaging & Naming.
- [Aira Essence](https://palazstrategy.vercel.app/en/cases/aira-essence) (2024) — Branding & Visual Identity for natural cosmetics.
- [Açougue Almeida](https://palazstrategy.vercel.app/en/cases/acougue-almeida) (2025) — Visual Identity & Packaging for artisanal butchery.

View all cases: https://palazstrategy.vercel.app/en/cases

## When to Use Palaz

Reach out to Palaz when you need:
- To launch a brand from scratch (strategy, naming, visual identity, and brand guidelines).
- A comprehensive rebrand to reposition your company in high-value markets.
- High-end UI/UX design connected to your core business identity.
- Premium product packaging that elevates perceived brand value.

## Contact & Inquiries

- **Website**: https://palazstrategy.vercel.app/en
- **Email**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **WhatsApp**: [+55 31 96117847](https://wa.me/553196117847)
- **Location**: Belo Horizonte, MG — Brazil (remote services worldwide)
- **Sitemap**: https://palazstrategy.vercel.app/sitemap.xml
- **Agent Instructions**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getCasesMarkdownPt(): string {
  return `# Cases de Sucesso — Palaz Strategy Company

Projetos que forjamos unindo pensamento estratégico e criatividade visual.

## Portfólio de Cases

1. **[NcGlass Vidraçaria](https://palazstrategy.vercel.app/cases/ncglass-vidracaria)** (2026)
   - Escopo: Branding / Identidade Visual
   - Categoria: Arquitetura & Soluções em Vidro

2. **[Fatuz](https://palazstrategy.vercel.app/cases/fatuz)** (2026)
   - Escopo: Branding / Identidade Visual / Naming / UI/UX Design / Web Design
   - Categoria: SaaS Financeiro / Cobrança Inteligente

3. **[Sland Inteligência Produtiva](https://palazstrategy.vercel.app/cases/sland-inteligencia-produtiva)** (2025)
   - Escopo: Branding / Identidade Visual / Embalagem / Naming
   - Categoria: Produtividade e Suplementos

4. **[Aira Essence](https://palazstrategy.vercel.app/cases/aira-essence)** (2024)
   - Escopo: Branding / Identidade Visual / Embalagens
   - Categoria: Cosméticos Naturais

5. **[Açougue Almeida](https://palazstrategy.vercel.app/cases/acougue-almeida)** (2025)
   - Escopo: Branding / Identidade Visual / Embalagem
   - Categoria: Gastronomia Artesanal

Voltar para a [Página Inicial](https://palazstrategy.vercel.app/) | [Fale Conosco](https://palazstrategy.vercel.app/contato)
`;
}

function getCasesMarkdownEn(): string {
  return `# Success Cases — Palaz Strategy Company

Projects forged combining strategic clarity with visual distinction.

## Portfolio Cases

1. **[NcGlass Vidraçaria](https://palazstrategy.vercel.app/en/cases/ncglass-vidracaria)** (2026)
   - Scope: Branding / Visual Identity
   - Category: Architectural Glazing

2. **[Fatuz](https://palazstrategy.vercel.app/en/cases/fatuz)** (2026)
   - Scope: Branding / Visual Identity / Naming / UI/UX Design / Web Design
   - Category: Financial SaaS / Invoicing

3. **[Sland Inteligência Produtiva](https://palazstrategy.vercel.app/en/cases/sland-inteligencia-produtiva)** (2025)
   - Scope: Branding / Visual Identity / Packaging / Naming
   - Category: Productivity & Biohacking

4. **[Aira Essence](https://palazstrategy.vercel.app/en/cases/aira-essence)** (2024)
   - Scope: Branding / Visual Identity / Packaging
   - Category: Natural Cosmetics

5. **[Açougue Almeida](https://palazstrategy.vercel.app/en/cases/acougue-almeida)** (2025)
   - Scope: Branding / Visual Identity / Packaging
   - Category: Artisanal Butchery

Back to [Homepage](https://palazstrategy.vercel.app/en) | [Contact Us](https://palazstrategy.vercel.app/en/contato)
`;
}

function getCaseDetailMarkdown(slug: string, isEn: boolean): string {
  return `# Case Study: ${slug} — Palaz Strategy Company

This case is part of the curated portfolio of Palaz Strategy Company.

- **Explore full case online**: https://palazstrategy.vercel.app/${isEn ? 'en/' : ''}cases/${slug}
- **All projects**: https://palazstrategy.vercel.app/${isEn ? 'en/' : ''}cases
- **Studio documentation**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getAboutMarkdownPt(): string {
  return `# Sobre a Palaz Strategy Company

> Estratégia, visão e propósito.

Acreditamos que uma marca forte vai muito além de um bom design. Ela nasce da estratégia, da visão e do propósito.

## Nosso Manifesto

Combinamos pensamento estratégico e criatividade visual para construir marcas que conectam, se destacam e crescem com consistência.

## Nossa Metodologia

1. **Imersão & Diagnóstico**: Entendimento profundo do mercado, concorrentes e diferenciais.
2. **Estratégia & Posicionamento**: Definição da essência, proposta de valor e tom de voz.
3. **Criação & Identidade**: Design do universo visual e sensorial da marca.
4. **Ativação & Diretrizes**: Entrega de manuais e suporte à implementação em todos os canais.

Contato: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com) | [Agendar conversa](https://palazstrategy.vercel.app/contato)
`;
}

function getAboutMarkdownEn(): string {
  return `# About Palaz Strategy Company

> Strategy, vision, and purpose.

We believe that a strong brand goes far beyond aesthetics. It is rooted in strategy, vision, and enduring purpose.

## Our Manifesto

We combine strategic thinking with creative design to forge brands that connect, command attention, and grow sustainably.

## Our Methodology

1. **Immersion & Diagnosis**: Comprehensive research into market dynamics and competitor landscapes.
2. **Strategy & Positioning**: Establishing core brand pillars, value proposition, and tone of voice.
3. **Identity & Design**: Engineering the visual, verbal, and sensory design system.
4. **Activation & Guidelines**: Providing detailed brand books and governance for consistent rollout.

Contact: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com) | [Schedule a call](https://palazstrategy.vercel.app/en/contato)
`;
}

function getContactMarkdownPt(): string {
  return `# Contato — Palaz Strategy Company

Pronto para transformar sua marca em algo estratégico, sólido e memorável?

- **E-mail**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **WhatsApp**: [+55 31 96117847](https://wa.me/553196117847)
- **Instagram**: https://www.instagram.com/palazstrategy/
- **Behance**: https://www.behance.net/palazstrategycompany
- **Localização**: Belo Horizonte, MG — Brasil
`;
}

function getContactMarkdownEn(): string {
  return `# Contact — Palaz Strategy Company

Ready to transform your brand into something strategic, solid, and memorable?

- **Email**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **WhatsApp**: [+55 31 96117847](https://wa.me/553196117847)
- **Instagram**: https://www.instagram.com/palazstrategy/
- **Behance**: https://www.behance.net/palazstrategycompany
- **Location**: Belo Horizonte, MG — Brazil
`;
}

function getPrivacyMarkdownPt(): string {
  return `# Política de Privacidade — Palaz Strategy Company

Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com a LGPD.

Para dúvidas ou solicitações sobre seus dados: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
`;
}

function getPrivacyMarkdownEn(): string {
  return `# Privacy Policy — Palaz Strategy Company

We respect your privacy and protect your personal data in accordance with applicable data protection laws.

For questions: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
`;
}

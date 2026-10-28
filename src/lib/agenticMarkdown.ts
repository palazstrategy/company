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
    '/sitemap.xml',
    '/openapi.json'
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

  if (route === '/sobre' || route === '/about') {
    return isEn ? getAboutMarkdownEn() : getAboutMarkdownPt();
  }

  if (route === '/contato' || route === '/contact') {
    return isEn ? getContactMarkdownEn() : getContactMarkdownPt();
  }

  if (route === '/politica-de-privacidade' || route === '/privacy') {
    return isEn ? getPrivacyMarkdownEn() : getPrivacyMarkdownPt();
  }

  return getNotFoundMarkdown(pathname);
}

function getHomeMarkdownPt(): string {
  return `# Palaz Strategy Company | Palaz Design Studio — Estúdio de Design Estratégico & Branding

> A estratégia dá a direção. O design dá a forma.
> Propósito, estratégia e presença em todos os pontos de contato.

Palaz Strategy Company (também conhecida no mercado como Palaz Design Studio) é um estúdio independente de design estratégico e branding com sede em Belo Horizonte, Minas Gerais, Brasil, atuando em projetos nacionais e internacionais.

## O que a Palaz faz

- **Estratégia & Posicionamento de Marca**: Arquitetura de marca, direcionamento estratégico e análise de posicionamento competitivo.
- **Identidade Visual & Branding**: Criação de logotipos, manuais de marca, design systems, tipografia exclusiva e paletas de cores.
- **Naming**: Criação estratégica de nomes comerciais para marcas, empresas e produtos digitais.
- **UI/UX Design**: Design de interfaces digitais sofisticadas, centradas no usuário e otimizadas para conversão.
- **Embalagens & Design de Produto**: Soluções visuais táteis para prateleiras, e-commerce e ponto de venda.
- **Motion Design**: Animações de marca para campanhas e touchpoints digitais.

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
- **Instruções para Agentes & MCP**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getHomeMarkdownEn(): string {
  return `# Palaz Strategy Company | Palaz Design Studio — Strategic Design & Branding Studio

> Strategy gives direction. Design creates the form.
> Purpose, strategy, and presence across all touchpoints.

Palaz Strategy Company (also known internationally as Palaz Design Studio) is an independent strategic design and branding studio based in Belo Horizonte, Brazil, serving ambitious clients globally.

## What Palaz Does

- **Brand Strategy & Positioning**: Brand architecture, strategic direction, and market differentiation.
- **Visual Identity & Branding**: Logo creation, brand books, design systems, typography, and color theory.
- **Naming**: Strategic name development for companies, services, and digital products.
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
- **Agent Instructions & MCP**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getCasesMarkdownPt(): string {
  return `# Cases de Sucesso — Palaz Strategy Company | Palaz Design Studio

Projetos que forjamos unindo pensamento estratégico e criatividade visual para marcas que desejam liderar seus segmentos.

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
  return `# Success Cases — Palaz Strategy Company | Palaz Design Studio

Projects forged combining strategic clarity with visual distinction for forward-thinking enterprises.

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
  return `# Case Study: ${slug} — Palaz Strategy Company (Palaz Design Studio)

This project is part of the curated portfolio of Palaz Strategy Company.

- **Explore full case online**: https://palazstrategy.vercel.app/${isEn ? 'en/' : ''}cases/${slug}
- **All projects**: https://palazstrategy.vercel.app/${isEn ? 'en/' : ''}cases
- **Studio documentation & MCP tools**: https://palazstrategy.vercel.app/llms.txt
`;
}

function getAboutMarkdownPt(): string {
  return `# Sobre a Palaz Strategy Company | Palaz Design Studio

> Estratégia, visão e propósito.

Acreditamos que uma marca forte vai muito além de um bom design. Ela nasce da estratégia, da visão e do propósito. Somos um estúdio de design estratégico focado em transformar empresas em marcas sólidas e memoráveis. Atuamos lado a lado com empreendedores e negócios que querem mais do que estética: querem posicionamento, identidade e direção clara.

## Nosso Manifesto

Combinamos pensamento estratégico e criatividade visual para construir marcas que conectam, se destacam e crescem com consistência. Se você procura presença de marca, clareza no posicionamento e uma identidade que represente verdadeiramente o valor do seu negócio, a Palaz é o seu lugar.

## Nossa Metodologia

1. **Imersão & Diagnóstico**: Entendimento profundo do negócio, do mercado, dos concorrentes e dos diferenciais que sustentam a empresa.
2. **Estratégia & Posicionamento**: Definição da essência da marca, proposta de valor única, arquitetura de portfólio e tom de voz.
3. **Criação & Identidade**: Design do universo visual completo, incluindo logotipo, cores, tipografia, grafismos e aplicações reais.
4. **Ativação & Diretrizes**: Entrega de manuais de identidade da marca (brand guidelines) e suporte na implementação em todos os pontos de contato.

## Informações Corporativas
- **Razão Social / Entidade**: Palaz Strategy Company (Palaz Design Studio)
- **CNPJ**: 62.808.025/0001-73
- **Localização**: Belo Horizonte, Minas Gerais — Brasil
- **Contato**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com) | [Agendar conversa](https://palazstrategy.vercel.app/contato)
`;
}

function getAboutMarkdownEn(): string {
  return `# About Palaz Strategy Company | Palaz Design Studio

> Strategy, vision, and purpose.

We believe that a strong brand goes far beyond aesthetics. It is rooted in strategy, vision, and enduring purpose. We are a strategic design studio focused on transforming companies into solid and memorable brands. We collaborate side by side with entrepreneurs and enterprises that seek more than superficial design: they want market positioning, authentic identity, and clear strategic direction.

## Our Manifesto

We combine strategic thinking with creative design to forge brands that connect, command attention, and grow sustainably. If you are looking for brand presence, positioning clarity, and an identity that truly reflects the value of your business, Palaz is your partner.

## Our Methodology

1. **Immersion & Diagnosis**: Comprehensive research into market dynamics, competitive landscapes, and core differentiators.
2. **Strategy & Positioning**: Establishing brand pillars, unique value propositions, brand architecture, and voice.
3. **Identity & Design**: Engineering the visual, verbal, and sensory design system across all touchpoints.
4. **Activation & Guidelines**: Providing detailed brand books and governance documentation for consistent global rollout.

## Corporate Details
- **Legal Entity**: Palaz Strategy Company (Palaz Design Studio)
- **Business Tax ID (CNPJ)**: 62.808.025/0001-73
- **Headquarters**: Belo Horizonte, Minas Gerais — Brazil
- **Contact**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com) | [Schedule a discovery call](https://palazstrategy.vercel.app/en/contato)
`;
}

function getContactMarkdownPt(): string {
  return `# Contato e Informações Corporativas — Palaz Strategy Company | Palaz Design Studio

Seja bem-vindo aos canais oficiais de comunicação da Palaz Strategy Company. Se você deseja iniciar um novo projeto de branding, solicitar um diagnóstico estratégico ou agendar uma conversa com nossos diretores criativos, utilize as informações abaixo:

## Canais de Atendimento Direto
- **E-mail Institucional**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **WhatsApp Oficial**: [+55 31 96117847](https://wa.me/553196117847)
- **Website Oficial**: https://palazstrategy.vercel.app
- **Instagram**: https://www.instagram.com/palazstrategy/
- **Behance**: https://www.behance.net/palazstrategycompany

## Dados Cadastrais e Localização
- **Nome Comercial**: Palaz Strategy Company / Palaz Design Studio
- **CNPJ**: 62.808.025/0001-73
- **Endereço**: Belo Horizonte, Minas Gerais — Brasil
- **Horário de Funcionamento**: Segunda a Sexta-feira, das 09:00 às 18:00 (Horário de Brasília)
- **Tempo Médio de Retorno**: Até 24 horas úteis para novas solicitações de projeto.

## Como Trabalhamos
1. **Briefing Inicial**: Você nos envia os detalhes do seu projeto através do formulário em https://palazstrategy.vercel.app/contato ou por e-mail.
2. **Alinhamento Estratégico**: Realizamos uma reunião online de 30 minutos para compreender metas de negócio, orçamento e prazos.
3. **Proposta Sob Medida**: Apresentamos um cronograma detalhado de etapas, entregáveis e investimento.
`;
}

function getContactMarkdownEn(): string {
  return `# Contact & Corporate Verification — Palaz Strategy Company | Palaz Design Studio

Welcome to the official communication and business inquiry portal of Palaz Strategy Company. If you are looking to start a new branding engagement, request a strategic brand diagnosis, or schedule a discovery meeting with our team, please use the verified channels below:

## Direct Communication Channels
- **Official Inquiries Email**: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com)
- **Official WhatsApp**: [+55 31 96117847](https://wa.me/553196117847)
- **Primary Website**: https://palazstrategy.vercel.app/en
- **Instagram**: https://www.instagram.com/palazstrategy/
- **Behance**: https://www.behance.net/palazstrategycompany

## Business Identity & Legal Verification
- **Trading Names**: Palaz Strategy Company / Palaz Design Studio
- **Tax Registration (CNPJ)**: 62.808.025/0001-73
- **Headquarters**: Belo Horizonte, Minas Gerais — Brazil
- **Operating Hours**: Monday through Friday, 09:00 to 18:00 (UTC-3 / BRT)
- **Response SLA**: Within 24 business hours for all project requests.

## How to Engage Palaz
1. **Initial Brief**: Submit your goals and scope via https://palazstrategy.vercel.app/en/contato or email.
2. **Strategic Discovery Call**: A 30-minute video session to assess business objectives, timelines, and deliverables.
3. **Tailored Proposal**: Transparent roadmap specifying project milestones, brand architecture, and deliverables.
`;
}

function getPrivacyMarkdownPt(): string {
  return `# Política de Privacidade — Palaz Strategy Company | Palaz Design Studio

Última atualização: Março de 2026

A Palaz Strategy Company valoriza a transparência e a privacidade de seus visitantes, parceiros e clientes. Esta Política de Privacidade descreve como coletamos, tratamos, armazenamos e protegemos suas informações de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

## 1. Coleta de Informações
Coletamos dados fornecidos voluntariamente por você através de formulários de contato ou canais diretos, incluindo:
- Nome completo e nome da empresa;
- Endereço de e-mail e telefone de contato;
- Detalhes contextuais sobre o projeto de branding ou design solicitado.
Adicionalmente, dados de navegação técnica (endereço IP anonimizado, páginas visualizadas e tipo de navegador) podem ser coletados via ferramentas de análise de tráfego para aprimoramento contínuo da experiência.

## 2. Finalidade do Tratamento de Dados
Os dados coletados são utilizados exclusivamente para:
- Responder a solicitações de propostas comerciais e agendamento de reuniões;
- Prestar os serviços de consultoria de marca, design estratégico e desenvolvimento contratados;
- Cumprimento de obrigações legais, contratuais e fiscais cabíveis.
Não comercializamos nem compartilhamos dados com terceiros para fins publicitários sob nenhuma hipótese.

## 3. Segurança e Armazenamento
Adotamos medidas rigorosas de segurança técnica e organizacional, incluindo criptografia HTTPS/TLS em todo o tráfego do site, controle estrito de acesso e servidores com certificação de segurança de ponta.

## 4. Seus Direitos (LGPD)
Conforme assegurado pela legislação brasileira, você possui o direito de solicitar a qualquer momento a confirmação da existência de tratamento, o acesso aos seus dados pessoais, a correção de dados incompletos ou a revogação de consentimento com a exclusão definitiva dos seus dados.

## 5. Contato do Encarregado de Dados
Para exercer seus direitos de privacidade ou esclarecer dúvidas, entre em contato através do e-mail oficial: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com).
`;
}

function getPrivacyMarkdownEn(): string {
  return `# Privacy Policy — Palaz Strategy Company | Palaz Design Studio

Last updated: March 2026

Palaz Strategy Company is committed to protecting the privacy, confidentiality, and personal data of our website visitors and clients, adhering strictly to global data protection standards including the GDPR and Brazilian LGPD.

## 1. Data Collection
We collect personal information that you provide voluntarily when submitting contact inquiries or project briefs, including:
- Full Name and Company Information;
- Email Address and WhatsApp/Phone Number;
- Project specifications and business requirements.
We also collect anonymized technical telemetry (browser type, operating system, and pages visited) via secure analytics tools to optimize site performance.

## 2. Lawful Basis and Purpose of Processing
Your information is processed strictly for legitimate business purposes:
- Communicating with you regarding branding quotes and project proposals;
- Delivering contracted design, branding, and strategic consulting services;
- Complying with applicable legal, accounting, and regulatory obligations.
We do not sell, rent, or trade your personal information to third parties under any circumstances.

## 3. Data Protection and Security
We implement robust technical and organizational safeguards, including SSL/TLS encryption across all site traffic, restricted data access protocols, and ISO-compliant cloud infrastructure providers.

## 4. Data Subject Rights
You have the right to request access to, rectification of, portability, or deletion of your personal data at any time. You may also withdraw your consent for future communications.

## 5. Privacy Contact & DPO
To exercise any of your privacy rights or discuss data governance, please contact our team at: [estudiopalaz@gmail.com](mailto:estudiopalaz@gmail.com).
`;
}

import React from 'react'

export function JsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Palaz Strategy Company",
    "url": "https://palaz.com.br",
    "logo": "https://palaz.com.br/icon-palaz.svg",
    "image": "https://palaz.com.br/imagem-compartilhamento.png",
    "description": "Design Estratégico & Branding. Forjamos marcas sólidas e memoráveis.",
    "sameAs": [
      "https://www.instagram.com/palazstrategy/",
      "https://www.behance.net/palazstrategycompany"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Belo Horizonte",
      "addressRegion": "MG",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "ola@palaz.com.br",
      "contactType": "customer service"
    }
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Palaz",
    "url": "https://palaz.com.br"
  }

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Palaz Strategy Company",
    "url": "https://palaz.com.br",
    "logo": "https://palaz.com.br/icon-palaz.svg",
    "image": "https://palaz.com.br/imagem-compartilhamento.png",
    "description": "Estúdio de Design Estratégico & Branding em Belo Horizonte. Transformamos empresas em marcas sólidas e memoráveis.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Belo Horizonte",
      "addressRegion": "MG",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -19.9167,
      "longitude": -43.9333
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "telephone": "+553196117847",
    "priceRange": "$$$"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  )
}

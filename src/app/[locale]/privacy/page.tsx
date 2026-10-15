import PrivacyPolicyPage, { generateMetadata as baseGenerateMetadata } from "../politica-de-privacidade/page"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'pt' 
      ? 'Política de Privacidade — Palaz Strategy Company'
      : 'Privacy Policy — Palaz Strategy Company',
    description: locale === 'pt'
      ? 'Política de privacidade da Palaz Strategy Company (Palaz Design Studio). Saiba como coletamos, usamos e protegemos suas informações de acordo com a LGPD e GDPR.'
      : 'Privacy Policy of Palaz Strategy Company (Palaz Design Studio). Learn how we collect, use and protect your data in compliance with LGPD and GDPR.',
    robots: { index: true, follow: true },
    alternates: {
      canonical: locale === 'pt' ? `/privacy` : `/${locale}/privacy`,
      languages: {
        'pt-BR': `/privacy`,
        'en-US': `/en/privacy`,
        'x-default': `/privacy`,
      },
    },
  };
}

export default PrivacyPolicyPage;

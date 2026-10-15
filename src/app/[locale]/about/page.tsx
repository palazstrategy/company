import { AboutClient } from "@/components/page-specific/AboutClient"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Sobre" })

  return {
    title: `About Palaz Strategy Company | Palaz Design Studio`,
    description: t("hero.description_main"),
    alternates: {
      canonical: locale === 'pt' ? `/about` : `/${locale}/about`,
      languages: {
        'pt-BR': `/about`,
        'en-US': `/en/about`,
        'x-default': `/about`,
      },
    }
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutClient />
}

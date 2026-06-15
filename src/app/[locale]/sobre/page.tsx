import { AboutClient } from "@/components/page-specific/AboutClient"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Sobre" })

  return {
    title: `${t("hero.subtitle1")} ${t("hero.subtitle2")} | Palaz`,
    description: t("hero.description_main"),
    alternates: {
      canonical: locale === 'pt' ? `/sobre` : `/${locale}/sobre`,
      languages: {
        'pt-BR': `/sobre`,
        'en-US': `/en/sobre`,
        'x-default': `/sobre`,
      },
    }
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutClient />
}

import { ContactClient } from "@/components/page-specific/ContactClient"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Contato" })

  return {
    title: `${t("hero.title_pt1")} ${t("hero.title_pt2")} | Palaz`,
    description: t("hero.description"),
    alternates: {
      canonical: locale === 'pt' ? `/contato` : `/${locale}/contato`,
      languages: {
        'pt-BR': `/contato`,
        'en-US': `/en/contato`,
        'x-default': `/contato`,
      },
    }
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ContactClient />
}

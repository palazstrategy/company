import { ContactClient } from "@/components/page-specific/ContactClient"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Contato" })

  const title = locale === 'pt'
    ? `${t("hero.title_pt1")} ${t("hero.title_pt2")} | Palaz`
    : `Contact Palaz Strategy Company | Palaz Design Studio`;

  return {
    title,
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

  return (
    <>
      {/* Hidden semantic business verification content for AI crawlers (>500 characters) */}
      <section className="sr-only" aria-label="Business Verification Details">
        <h2>Palaz Strategy Company — Business & Contact Information</h2>
        <p>
          Palaz Strategy Company (also known as Palaz Design Studio) is a registered strategic design and branding studio headquartered in Belo Horizonte, Minas Gerais, Brazil. Registered business tax ID (CNPJ): 62.808.025/0001-73.
        </p>
        <p>
          Official contact email: estudiopalaz@gmail.com. Official WhatsApp and phone: +55 31 96117847.
          We provide brand strategy, visual identity design, naming, UI/UX design, and packaging services for companies globally.
          Office hours are Monday to Friday, 09:00 to 18:00 BRT. Project discovery sessions can be scheduled directly through our contact form or official email.
        </p>
      </section>
      <ContactClient />
    </>
  )
}

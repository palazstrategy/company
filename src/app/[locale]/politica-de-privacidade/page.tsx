import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { FadeIn } from "@/components/animations/FadeIn"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'pt'
        ? 'Política de Privacidade — Palaz Strategy Company'
        : 'Privacy Policy — Palaz Strategy Company';
    const description = locale === 'pt'
        ? 'Política de privacidade da Palaz Strategy Company. Saiba como coletamos, usamos e protegemos suas informações.'
        : 'Privacy Policy of Palaz Strategy Company. Learn how we collect, use and protect your information.';

    return {
        title,
        description,
        robots: { index: true, follow: true },
        alternates: {
            canonical: locale === 'pt' ? `/politica-de-privacidade` : `/${locale}/politica-de-privacidade`,
            languages: {
                'pt-BR': `/politica-de-privacidade`,
                'en-US': `/en/politica-de-privacidade`,
                'x-default': `/politica-de-privacidade`,
            },
        },
    };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("PrivacyPolicy");

    return (
        <div className="w-full min-h-screen bg-black text-white selection:bg-[#F24B0F] selection:text-white">
            <section className="relative w-full pt-32 lg:pt-48 pb-24 md:pb-32 px-6 md:px-10 lg:px-[60px]">
                <div className="max-w-[900px] mx-auto w-full">
                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[0.95] mb-16">
                            {t("title")}
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="prose prose-invert prose-lg max-w-none space-y-8">
                            <p className="text-white/60 text-sm uppercase tracking-widest mb-8">
                                {t("last_updated")}
                            </p>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section1_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section1_content")}</p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section2_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section2_content")}</p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section3_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section3_content")}</p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section4_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section4_content")}</p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section5_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section5_content")}</p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">{t("section6_title")}</h2>
                                <p className="text-white/70 leading-relaxed">{t("section6_content")}</p>
                            </div>

                            <div className="mt-16 pt-8 border-t border-white/10">
                                <p className="text-white/50 text-sm">
                                    {t("contact_info")}
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    )
}

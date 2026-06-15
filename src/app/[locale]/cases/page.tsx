import { getProjects } from "@/data/projects"
import { ProjectCard } from "@/components/ui/ProjectCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CTA } from "@/components/sections/CTA"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: `Cases | ${t('title')}`,
    description: t('description'),
    alternates: {
      canonical: locale === 'pt' ? '/cases' : `/${locale}/cases`,
      languages: {
        'pt-BR': '/cases',
        'en-US': '/en/cases',
        'x-default': '/cases',
      },
    },
  };
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const rawProjects = (await getProjects()).sort((a, b) => {
        const aOrder = (a as { casesPageOrder?: number }).casesPageOrder ?? 999;
        const bOrder = (b as { casesPageOrder?: number }).casesPageOrder ?? 999;
        return aOrder - bOrder;
    });
    const t = await getTranslations("Projetos")
    const tData = await getTranslations("ProjectsData")

    const projects = rawProjects.map(p => ({
        ...p,
        title: tData(`${p.slug}.title`),
        client: tData(`${p.slug}.client`),
        category: tData(`${p.slug}.category`),
        role: tData(`${p.slug}.role`),
        description: tData(`${p.slug}.description`),
        year: p.year
    }))

    return (
        <div className="w-full min-h-screen bg-black text-white selection:bg-[#F24B0F] selection:text-white">
            {/* --- HERO SECTION --- */}
            <section className="relative w-full pt-32 lg:pt-48 pb-32 md:pb-40 px-6 md:px-10 lg:px-[60px] overflow-hidden">
                <div className="max-w-[1440px] mx-auto w-full">
                    <FadeIn>
                        <h1 className="text-[clamp(45px,8vw,120px)] font-bold tracking-[-0.04em] leading-[0.9] max-w-6xl mb-16 md:mb-24">
                            {t("hero.title1")} <br />
                            <span className="font-serif italic text-[#F24B0F]">{t("hero.title2")}</span>
                        </h1>
                    </FadeIn>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 md:gap-12 xl:gap-20">
                        <div className="xl:col-span-7">
                            <FadeIn delay={0.2}>
                                <p className="text-2xl md:text-3xl xl:text-4xl font-normal tracking-tight leading-[1.2] text-white/90 max-w-3xl">
                                    {t("hero.description_main")}
                                </p>
                            </FadeIn>
                        </div>
                        <div className="xl:col-span-5 xl:border-l xl:border-white/10 xl:pl-12">
                            <FadeIn delay={0.4}>
                                <p className="text-lg text-white/50 leading-relaxed font-light md:max-w-2xl xl:max-w-none">
                                    {t("hero.description")}
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROJECTS LISTING --- */}
            <section className="w-full py-16 md:py-24 bg-black border-t border-white/5">
                <div className="w-full px-6 md:px-10 lg:px-[50px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        {projects.map((project, idx) => (
                            <ProjectCard
                                key={project.slug}
                                {...project}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <CTA />
        </div>
    )
}


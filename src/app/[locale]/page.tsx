import { FadeIn } from "@/components/animations/FadeIn"
import { ProjectCard } from "@/components/ui/ProjectCard"
import { getProjects } from "@/data/projects"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CTA } from "@/components/sections/CTA"
import { HeroVideo } from "@/components/sections/HeroVideo"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'pt' ? '/' : `/${locale}`,
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: 'https://palaz.com.br',
      siteName: 'Palaz',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations("Home")
  const tData = await getTranslations("ProjectsData")

  const rawProjects = await getProjects()
  const projects = rawProjects.map(p => ({
    ...p,
    title: tData(`${p.slug}.title`),
    client: tData(`${p.slug}.client`),
    category: tData(`${p.slug}.category`),
    year: p.year,
    description: tData(`${p.slug}.description`)
  }))
  const selectedProjects = projects.filter(p => p.showOnHome !== false)

  return (
    <div className="w-full relative min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="sticky top-0 w-full h-[100vh] flex flex-col overflow-hidden bg-black z-0">
        {/* Full-screen Spline 3D Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <div className="absolute inset-0 h-full w-full bg-black flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden [transform:translateZ(0)]">
              <HeroVideo
                src='/video-hero-palaz.webm'
                poster='/video-hero-poster.webp'
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Subtle gradient overlay to blend bottom edge into the black background of the next section and hide watermark on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
          {/* Extra bottom gradient specifically to hide the Spline logo deeply */}
          <div className="absolute inset-x-0 bottom-0 h-[15vh] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
        </div>

        {/* Conteúdo da Hero: Título e Texto de Apoio */}
        <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto px-6 xl:px-[60px] flex flex-col justify-center">
          <div className="flex flex-col items-start xl:flex-row xl:items-center justify-between gap-6 xl:gap-24 w-full">
            <div className="flex-1 w-full xl:max-w-none flex flex-col items-start translate-y-[-5%] md:translate-y-0 hero-text-animate">
              <h1 className="text-white leading-[1.05] text-left flex flex-col">
                <span className="block text-[clamp(42px,6vw,92px)] font-bold tracking-[-0.04em] uppercase">
                  {tHome("hero.title1_p1")}
                </span>
                <span className="block text-[clamp(42px,6vw,92px)] font-bold tracking-[-0.04em] uppercase mb-5">
                  {tHome("hero.title1_p2")}
                </span>
                <span className="block text-[clamp(38px,5.5vw,86px)] font-serif italic font-light text-white/80 tracking-tight leading-[1.05]">
                  {tHome("hero.title2")}
                </span>
              </h1>
            </div>

            <div className="w-full max-w-[340px] xl:max-w-[340px] hero-p-animate">
              <p className="text-[clamp(15px,1.1vw,18px)] text-white/90 leading-[1.6] font-normal text-left whitespace-pre-line">
                {tHome("hero.description")}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* --- PROJECTS LISTING --- */}
      <section className="w-full bg-black relative z-10 pointer-events-none">
        <h2 className="sr-only">Cases</h2>
        <div className="w-full flex-col pointer-events-auto">
          {selectedProjects.map((project, idx) => (
            <div key={project.slug} className="sticky top-0 w-full h-screen z-20">
              <ProjectCard
                {...project}
                index={idx}
                variant="fullscreen"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- MEMBERSHIP / CTA SECTION --- */}
      <div className="relative z-10 bg-black">
        <CTA />
      </div>

    </div>
  );
}

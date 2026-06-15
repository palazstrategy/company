"use client"

import { FadeIn } from "@/components/animations/FadeIn"
import { useTranslations } from "next-intl"
import { ArrowRight, FileText, Zap, PieChart, LayoutGrid } from "lucide-react"
import Image from "next/image"
import { OrbitingFeatures } from "@/components/fatuz/OrbitingFeatures"

const FATUZ_URL = "https://fatuz.palaz.com.br/"

export default function FatuzPage() {
  const t = useTranslations("Fatuz")

  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      titleKey: "features.faturas.title" as const,
      descKey: "features.faturas.description" as const,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      titleKey: "features.pix.title" as const,
      descKey: "features.pix.description" as const,
    },
    {
      icon: <PieChart className="w-5 h-5" />,
      titleKey: "features.lucro.title" as const,
      descKey: "features.lucro.description" as const,
    },
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      titleKey: "features.orcamentos.title" as const,
      descKey: "features.orcamentos.description" as const,
    },
  ]

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white selection:bg-[#F24B0F] selection:text-white relative overflow-x-hidden">

      {/* ===== GLOBAL BACKGROUND EFFECTS ===== */}
      {/* Central Upper Ambient Glow (Palaz Orange Style) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-[0.2] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2dce89]/20 via-[#2dce89]/5 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full pt-48 pb-32 px-6 lg:px-[60px] overflow-hidden">
        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7">
              <FadeIn>
                <h1 className="text-[clamp(32px,8vw,90px)] font-bold tracking-[-0.04em] leading-[0.95] mb-12 text-white">
                  {t("hero.title1")}<br />
                  {t("hero.title2")}<br />
                  {t("hero.title3")}{" "}
                  <span className="font-serif italic text-[#2dce89]">{t("hero.title_highlight")}</span>
                </h1>


                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <a
                    href={FATUZ_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white text-black pl-2 pr-8 h-[55px] rounded-full transition-all duration-500 group relative border border-transparent hover:bg-[#2dce89] hover:text-white cursor-none"
                  >
                    <span className="bg-[#2dce89] text-white rounded-full p-2.5 transition-all duration-500 group-hover:bg-white group-hover:text-[#2dce89] flex items-center justify-center">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                    <span className="text-base md:text-lg font-bold">{t("hero.cta")}</span>
                  </a>
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px] lg:min-h-[700px]">
              <div className="relative w-full h-full flex items-center justify-center">
                <OrbitingFeatures />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE SECTION ===== */}
      <section className="relative w-full pt-16 lg:pt-24 pb-0 px-6 lg:px-[60px] overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <FadeIn>
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-6xl mx-auto leading-[1.1]">
                {t("showcase.title1")} <br />
                {t("showcase.title2")}{" "}
                <span className="font-serif italic text-[#2dce89]">{t("showcase.title_highlight")}</span>{" "}
                {t("showcase.title3")}
              </h2>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="relative w-full max-w-[1800px] mx-auto aspect-[4/3] md:aspect-[16/9] overflow-hidden">
            <Image
              src="/produtos-fatuz-palaz.jpg"
              alt="Fatuz Products"
              fill
              className="object-contain md:object-cover"
              priority
              unoptimized
            />
            {/* Gradient Overlay for smooth transition */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#000000] to-transparent z-10" />
          </div>
        </FadeIn>
      </section>

      {/* ===== ABOUT SECTION (Manifesto Style) ===== */}
      <section className="w-full py-32 md:py-48 bg-[#2dce89]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Left: Tag + Title in Blockquote style */}
            <div className="lg:col-span-8">
              <FadeIn>
                <h2 className="text-sm uppercase tracking-[0.3em] text-[#0f1115] font-semibold mb-12 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-[#0f1115]" />
                  {t("about.tag")}
                </h2>
                <blockquote className="relative pl-8 border-l-2 border-[#0f1115]">
                  <p className="text-3xl md:text-5xl lg:text-[56px] font-medium tracking-tight leading-[1.1] italic font-serif text-[#0f1115]">
                    &ldquo;{t("about.title1")} {t("about.title2")}&rdquo;
                  </p>
                </blockquote>
              </FadeIn>
            </div>

            {/* Right: Supporting Description */}
            <div className="lg:col-span-4 flex items-end">
              <FadeIn delay={0.15}>
                <p className="font-light text-lg text-[#0f1115]/80 leading-relaxed">
                  {t("about.description")}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES BENTO GRID (Asymmetric) ===== */}
      <section className="w-full py-48 px-6 lg:px-[60px] bg-black">
        <div className="max-w-[1440px] mx-auto">
          <FadeIn>
            <div className="mb-20 lg:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#2dce89] font-semibold mb-8 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-[#2dce89]" />
                  {t("features.tag")}
                </p>
                <h2 className="text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.85] text-white">
                  {t("features.title1")}<br />
                  {t("features.title2")}<br />
                  {t("features.title3")}{" "}
                  <span className="font-serif italic text-[#2dce89]">{t("features.title_highlight")}</span>
                </h2>
              </div>

              <div className="relative h-[400px] lg:h-[450px] w-full overflow-hidden">
                <Image
                  src="/fatuz-faturas.avif"
                  alt="Fatuz Faturas"
                  fill
                  className="object-contain lg:object-right"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {features.map((feature, idx) => {
              const colors = [
                "lg:col-span-8",
                "lg:col-span-4",
                "lg:col-span-4",
                "lg:col-span-8"
              ]
              return (
                <FadeIn key={idx} delay={0.1 * idx} className={colors[idx]}>
                  <div className="group flex flex-col p-6 md:p-10 lg:p-12 h-full bg-[#050505] rounded-[32px] md:rounded-[40px] border border-white/[0.04] hover:border-[#2dce89]/20 hover:bg-[#080808] transition-all duration-500 relative overflow-hidden">

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="mb-8 md:mb-12 text-[#2dce89] transition-transform duration-500 group-hover:scale-110 origin-left">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-white group-hover:text-[#2dce89] transition-colors duration-500 leading-none">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-lg text-[#8A8A8E] leading-relaxed flex-1 tracking-tight font-light">
                        {t(feature.descKey)}
                      </p>

                      <ul className="mt-12 space-y-4 pt-8 border-t border-white/[0.03]">
                        {(t.raw(feature.titleKey.replace('.title', '.bullets')) as string[]).map((bullet: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-base text-[#8A8A8E] group-hover:text-white/80 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2dce89] mt-2 group-hover:scale-125 transition-transform" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>


      {/* ===== FINAL CTA ===== */}
      <section className="relative w-full h-[500px] min-h-[500px] flex items-center justify-center px-6 lg:px-[60px] overflow-hidden bg-black">
        {/* Grid Background using the specified image */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `url('/imagem-palaz-cta-site.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="flex flex-col items-center text-center gap-10">
            {/* Title */}
            <div className="max-w-4xl">
              <FadeIn>
                <h2 className="text-[clamp(32px,8vw,90px)] font-bold tracking-[-0.04em] text-white leading-[0.95]">
                  {t("cta.title1")}<br />
                  {t("cta.title2")}{" "}
                  <span className="font-serif italic text-[#2dce89]">{t("cta.highlight")}</span>
                </h2>
              </FadeIn>
            </div>

            {/* Description + Button */}
            <div className="flex flex-col items-center gap-10 max-w-2xl">
              <FadeIn>
                <p className="text-base md:text-lg text-[#8A8A8E] font-normal leading-relaxed tracking-tight">
                  {t("cta.description")}
                </p>
                <div className="mt-8 flex justify-center">
                  <a
                    href={FATUZ_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit inline-flex items-center gap-3 bg-white text-black pl-2 pr-8 h-[55px] rounded-full transition-all duration-500 group relative border border-transparent hover:bg-[#2dce89] hover:text-white cursor-none"
                  >
                    <span className="bg-[#2dce89] text-white rounded-full p-2.5 transition-all duration-500 group-hover:bg-white group-hover:text-[#2dce89] flex items-center justify-center">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                    <span className="text-base md:text-lg font-bold">{t("cta.button")}</span>
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

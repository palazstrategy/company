"use client"

import { FadeIn } from "@/components/animations/FadeIn"
import { useTranslations } from "next-intl"
import { CTA } from "@/components/sections/CTA"

export function AboutClient() {
  const tSobre = useTranslations("Sobre")

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#F24B0F] selection:text-white">
      {/* --- HERO SECTION (SOBRE A PALAZ) --- */}
      <section className="relative w-full pt-32 lg:pt-48 pb-40 px-6 lg:px-[60px] overflow-hidden">
        <div className="max-w-[1440px] mx-auto w-full">
          <FadeIn>
            <h1 className="text-[clamp(45px,8vw,120px)] font-bold tracking-[-0.04em] leading-[0.9] max-w-6xl mb-24">
              {tSobre("hero.subtitle1")}<br />
              {tSobre("hero.subtitle2")}<span className="font-serif italic text-[#F24B0F]">{tSobre("hero.subtitle3")}</span>
            </h1>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <FadeIn delay={0.2}>
                <p className="text-2xl md:text-4xl font-normal tracking-tight leading-[1.2] text-white/90">
                  {tSobre("hero.description_main")}
                </p>
              </FadeIn>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12">
              <FadeIn delay={0.4}>
                <p className="text-lg text-white/50 leading-relaxed font-light">
                  {tSobre("hero.description")}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- MANIFESTO SECTION --- */}
      <section className="w-full py-32 md:py-48 bg-[#F24B0F]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Left: Label + Quote */}
            <div className="lg:col-span-8">
              <FadeIn>
                <h2 className="text-sm uppercase tracking-[0.3em] text-white font-semibold mb-12 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-white" />
                  {tSobre("manifesto.subtitle")}
                </h2>
                <blockquote className="relative pl-8 border-l-2 border-white">
                  <p className="text-3xl md:text-5xl lg:text-[56px] font-medium tracking-tight leading-[1.1] italic font-serif text-white">
                    &ldquo;{tSobre("manifesto.title")}&rdquo;
                  </p>
                </blockquote>
              </FadeIn>
            </div>

            {/* Right: Supporting Text */}
            <div className="lg:col-span-4 flex items-end">
              <FadeIn delay={0.15}>
                <p className="font-light text-lg text-white/80 leading-relaxed">
                  {tSobre("manifesto.text1")}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- METODOLOGIA SECTION --- */}
      <section className="w-full py-32 md:py-48 bg-black">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px]">
          <FadeIn className="mb-24 md:mb-32">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#F24B0F] font-semibold mb-8 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#F24B0F]" />
              {tSobre("metodologia.title_label")}
            </h2>
            <h3 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-[-0.05em] leading-[0.85] whitespace-pre-line">
              {tSobre.rich("metodologia.title", {
                highlight: (chunks) => <span className="font-serif italic text-[#F24B0F]">{chunks}</span>
              })}
            </h3>
          </FadeIn>

          <div className="flex flex-col">
            {[
              {
                num: "01",
                tag: tSobre("metodologia.step1.tag"),
                title: tSobre("metodologia.step1.title"),
                desc: tSobre("metodologia.step1.description")
              },
              {
                num: "02",
                tag: tSobre("metodologia.step2.tag"),
                title: tSobre("metodologia.step2.title"),
                desc: tSobre("metodologia.step2.description")
              },
              {
                num: "03",
                tag: tSobre("metodologia.step3.tag"),
                title: tSobre("metodologia.step3.title"),
                desc: tSobre("metodologia.step3.description")
              },
              {
                num: "04",
                tag: tSobre("metodologia.step4.tag"),
                title: tSobre("metodologia.step4.title"),
                desc: tSobre("metodologia.step4.description")
              }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={0.1 * (idx + 1)}>
                <div className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start ${idx !== 3 ? 'border-b border-white/5 pb-16 lg:pb-24 mb-16 lg:mb-24' : ''}`}>
                  {/* Left: Number + Tag */}
                  <div className="lg:col-span-4 relative z-0">
                    <span className="absolute -top-12 -left-6 lg:-left-8 text-[120px] font-bold text-[#F24B0F] leading-none select-none z-[-1]">
                      {step.num}
                    </span>
                    <div className="relative z-10 pt-4 lg:pt-6">
                      <h4 className="text-2xl uppercase tracking-[0.15em] font-bold text-white mb-4">
                        {step.tag}
                      </h4>
                    </div>
                  </div>

                  {/* Right: Title + Description */}
                  <div className="lg:col-span-8 lg:pt-6">
                    <h5 className="text-2xl md:text-4xl font-semibold tracking-tight mb-6 text-white max-w-3xl">
                      {step.title}
                    </h5>
                    <p className="text-white/50 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <CTA />

    </div>
  )
}

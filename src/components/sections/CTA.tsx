"use client"

import { DotPattern } from "@/components/animations/DotPattern"
import { FadeIn } from "@/components/animations/FadeIn"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import {  m  } from 'framer-motion'
 
export function CTA() {
  const tHome = useTranslations("Home")
 
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      <DotPattern className="w-full h-full bg-black" glowColor="#F24B0F">

      <div className="relative z-10 h-full max-w-[1440px] w-full mx-auto px-6 lg:px-[60px] flex flex-col justify-center items-center text-center">
        <FadeIn>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl lg:text-[80px] font-bold tracking-[-0.05em] text-white leading-[0.95] mb-10">
              {tHome("cta.title_pt1")}<br className="hidden lg:block" />{" "}
              {tHome("cta.title_pt2")} <span className="font-serif italic text-white/90 font-medium">{tHome("cta.estrategico")}</span>,{" "}<br className="hidden lg:block" />
              <span className="font-serif italic text-white/90 font-medium">{tHome("cta.solido")}</span> {tHome("cta.e")} <span className="font-serif italic text-white/90 font-medium">{tHome("cta.memoravel")}</span>?
            </h2>
          </div>
        </FadeIn>
 
        <FadeIn delay={0.15}>
          <div className="flex flex-col items-center max-w-3xl mx-auto mt-4">
            <p className="text-base md:text-lg lg:text-xl text-white/65 mb-12 leading-relaxed font-normal max-w-2xl">
              {tHome("cta.description")}
            </p>
            <div className="flex justify-center">
              <Link
                href="/contato"
                className="flex items-center gap-3 bg-white text-black pl-2 pr-8 h-[55px] rounded-full transition-all duration-500 group relative border border-transparent hover:bg-[#F24B0F] hover:text-white cursor-none"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-[#F24B0F] text-white rounded-full p-2.5 transition-all duration-500 group-hover:bg-white group-hover:text-[#F24B0F] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <span className="text-base md:text-lg font-bold">{tHome("cta.button")}</span>
                </div>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
      </DotPattern>
    </section>
  )
}

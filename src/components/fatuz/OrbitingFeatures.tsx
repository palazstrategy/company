"use client"

import React from "react"
import Image from "next/image"
import {
  Zap,
  MessageCircle,
  Smartphone,
  FileText,
  Users,
  LayoutGrid,
  PieChart,
  LineChart,
  Palette
} from "lucide-react"
import { OrbitingCircles } from "@/registry/magicui/orbiting-circles"
import { cn } from "@/lib/utils"

interface FeatureIconProps {
  icon?: React.ElementType
  svgPath?: string
  label: string
  className?: string
}

const FeatureIcon = ({ icon: Icon, svgPath, label, className }: FeatureIconProps) => (
  <div className={cn("flex items-center justify-center relative", className)}>
    {/* Squircle Icon Style - Dark BG, Green Icon */}
    <div
      className={cn(
        "w-10 h-10 rounded-[12px] bg-[#0c0c0c] border border-[#2dce89]/10 flex items-center justify-center transition-all duration-300"
      )}
    >
      {svgPath ? (
        <div className="w-5 h-5 relative">
          <Image
            src={svgPath}
            alt={label}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ) : Icon ? (
        <Icon size={18} className="text-[#2dce89]" />
      ) : null}
    </div>
  </div>
)

export function OrbitingFeatures() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="relative flex h-[500px] lg:h-[650px] w-full items-center justify-center bg-transparent overflow-hidden">
      {/* Central Branding - Palaz Icon */}
      <div className="relative z-10 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#2dce89]/5 blur-2xl rounded-full" />
        <div className="relative w-10 h-10 lg:w-12 lg:h-12">
          <Image
            src="/icon-palaz.svg"
            alt="Palaz"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Layer 1 - Inner */}
      <OrbitingCircles radius={isMobile ? 60 : 80} duration={15} delay={5} iconSize={isMobile ? 32 : 40}>
        <FeatureIcon icon={Zap} label="Rápido" />
        <FeatureIcon svgPath="/icons-fatuz.svg" label="Fatuz" />
        <FeatureIcon icon={MessageCircle} label="Envio Rápido" />
        <FeatureIcon icon={Smartphone} label="Pix" />
      </OrbitingCircles>

      {/* Layer 2 - Middle */}
      <OrbitingCircles radius={isMobile ? 120 : 170} duration={25} delay={5} reverse iconSize={isMobile ? 32 : 40}>
        <FeatureIcon icon={FileText} label="Faturas" />
        <FeatureIcon svgPath="/icons-fatuz.svg" label="Fatuz" />
        <FeatureIcon icon={Users} label="Clientes" />
        <FeatureIcon svgPath="/icons-fatuz.svg" label="Fatuz" />
        <FeatureIcon icon={LayoutGrid} label="Catálogo" />
      </OrbitingCircles>

      {/* Layer 3 - Outer */}
      <OrbitingCircles radius={isMobile ? 180 : 260} duration={35} delay={10} iconSize={isMobile ? 32 : 40}>
        <FeatureIcon icon={PieChart} label="Custos" />
        <FeatureIcon svgPath="/icons-fatuz.svg" label="Fatuz" />
        <FeatureIcon icon={LineChart} label="Relatórios" />
        <FeatureIcon svgPath="/icons-fatuz.svg" label="Fatuz" />
        <FeatureIcon icon={Palette} label="Design" />
      </OrbitingCircles>
    </div>
  )
}

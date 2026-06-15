"use client"

import { useRef, useState } from "react"
import { m, useScroll, useTransform } from 'framer-motion'
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface StickyProjectCardProps {
    project: {
        slug: string
        title: string
        client: string
        category: string
        year?: string
        description?: string
        imageSrc: string
    }
    idx: number
    total: number
}

export function StickyProjectCard({ project, idx, total }: StickyProjectCardProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const t = useTranslations("Cursor")

    // Track scroll of this specific card
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 1], [1, idx === total - 1 ? 1 : 0.92])
    const opacity = useTransform(scrollYProgress, [0, 1], [1, idx === total - 1 ? 1 : 0.5])

    // Removida a lógica manual de hover com getBoundingClientRect para evitar Layout Thrashing
    // O estado agora é controlado apenas via eventos nativos onMouseEnter/onMouseLeave do React no container principal




    return (
        <div
            ref={containerRef}
            className="sticky top-0 h-[100vh] w-full overflow-hidden flex items-center justify-center p-0"
            style={{ zIndex: idx }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <m.div
                style={{
                    scale,
                    opacity,
                    transformOrigin: "top center",
                    willChange: "transform, opacity"
                }}
                className="w-full h-full relative rounded-none overflow-hidden bg-black border-t border-white/[0.03]"
            >
                <Link href={`/cases/${project.slug}`} className="group block w-full h-full relative" data-cursor-label={t("ver")} prefetch={false}>
                    {/* Background Image Full Bleed */}
                    <Image
                        src={project.imageSrc}
                        alt={`${project.title} - ${project.category} por Palaz Strategy Company`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 1920px"
                        quality={100}
                        priority={idx === 0}
                        className={`object-cover transform-gpu will-change-transform transition-transform duration-[2s] ease-out ${isHovered ? 'scale-[1.04]' : 'scale-100'}`}
                    />

                    {/* Overlay Gradient (Consistent with ProjectCard) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-10 opacity-50 transition-opacity duration-700" />

                    {/* Content Overlay - Positioned at bottom left like ProjectCard */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 lg:p-20">
                        <div className="flex flex-col items-start max-w-4xl">
                            {/* Hover Description */}
                            <div className="overflow-hidden mb-4">
                                <m.p
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: isHovered ? 0 : "100%", opacity: isHovered ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-base md:text-xl text-white/90 font-light leading-relaxed max-w-2xl line-clamp-2"
                                >
                                    {project.description}
                                </m.p>
                            </div>

                            {/* Divider Line (1px) */}
                            <m.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="h-px bg-white/30 w-full md:w-[600px] mb-8 origin-left"
                            />

                            {/* Title & Category/Year */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-4xl md:text-6xl lg:text-[84px] font-bold tracking-tight text-white leading-[1.05]">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <p className="text-lg md:text-2xl text-white/65 font-medium">
                                        {project.category}
                                    </p>
                                    <span className="text-white/20 text-xl md:text-2xl">•</span>
                                    <p className="text-lg md:text-2xl text-white/65 font-medium">
                                        {project.year}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </Link>
            </m.div>
        </div>
    )
}

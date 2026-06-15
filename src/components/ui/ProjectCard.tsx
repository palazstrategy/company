"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/animations/FadeIn"
import { useTranslations } from "next-intl"

interface ProjectCardProps {
    slug: string
    title: string
    client: string
    category: string
    year?: string
    description?: string
    imageSrc: string
    index?: number
    variant?: 'default' | 'fullscreen'
}

export function ProjectCard({
    slug,
    title,
    category,
    year,
    description,
    imageSrc,
    index = 0,
    variant = 'default',
}: ProjectCardProps) {
    const t = useTranslations("Cursor")

    const content = (
        <Link href={`/cases/${slug}`} className={`group block w-full relative ${variant === 'fullscreen' ? 'h-full' : ''}`} data-cursor-label={t("ver")}>
            <div className={`relative w-full overflow-hidden bg-[#111] ${variant === 'fullscreen' ? 'h-screen' : 'aspect-[4/3]'}`}>
                {/* Image with subtle zoom */}
                <Image
                    src={imageSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
                    alt={`${title} - ${category} por Palaz Strategy Company`}
                    fill
                    priority={variant === 'fullscreen' || index < 2}
                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
                />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-10" />

                    {/* Content Overlay */}
                    <div className={`absolute inset-0 z-20 flex flex-col justify-end ${variant === 'fullscreen' ? 'p-6 md:p-12 lg:p-20' : 'p-6 md:p-8 lg:p-10'}`}>
                        <div className={`flex flex-col items-start ${variant === 'fullscreen' ? 'max-w-4xl' : ''}`}>
                        {/* Hover Description */}
                        <div className="overflow-hidden mb-4">
                            <p className={`${variant === 'fullscreen' ? 'text-base md:text-xl max-w-2xl' : 'text-sm lg:text-base max-w-md'} text-white/90 font-light leading-relaxed transform translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 line-clamp-2`}>
                                {description}
                            </p>
                        </div>

                        {/* Divider Line (1px) */}
                        <div className={`h-px bg-white/30 ${variant === 'fullscreen' ? 'w-full md:w-[600px] mb-8' : 'w-full mb-4 md:mb-5 lg:mb-6'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />

                        {/* Title & Category/Year */}
                        <div className={`flex flex-col ${variant === 'fullscreen' ? 'gap-2' : 'gap-1 md:gap-2'}`}>
                            <h3 className={`${variant === 'fullscreen' ? 'text-4xl md:text-6xl lg:text-[84px] leading-[1.05]' : 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.1]'} font-bold tracking-tight text-white`}>
                                {title}
                            </h3>
                            <div className={`flex items-center ${variant === 'fullscreen' ? 'gap-4' : 'gap-2 md:gap-3'}`}>
                                <p className={`${variant === 'fullscreen' ? 'text-lg md:text-2xl' : 'text-sm md:text-base lg:text-lg'} text-white/50 font-medium`}>
                                    {category}
                                </p>
                                <span className={`text-white/20 ${variant === 'fullscreen' ? 'text-xl md:text-2xl' : ''}`}>•</span>
                                <p className={`${variant === 'fullscreen' ? 'text-lg md:text-2xl' : 'text-sm md:text-base lg:text-lg'} text-white/50 font-medium`}>
                                    {year}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )

    if (variant === 'fullscreen') {
        return content
    }

    return (
        <FadeIn delay={index * 0.1}>
            {content}
        </FadeIn>
    )
}

'use client'

import { useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {  m, useScroll, useTransform  } from 'framer-motion'
import { GalleryParallax } from "@/components/ui/GalleryParallax"
import { CompareSlider } from "@/components/ui/CompareSlider"
import { Lightbox } from "@/components/ui/Lightbox"
import { Project } from "@/types"
import { FadeIn } from "@/components/animations/FadeIn"

function ParallaxBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

    return (
        <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
            <m.div style={{ y }} className="relative w-full">
                {children}
            </m.div>
        </div>
    )
}

interface CaseGalleryProps {
    project: Project;
    slug: string;
}

export function CaseGallery({ project, slug }: CaseGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const locale = useLocale() as "pt" | "en";
    const tData = useTranslations("ProjectsData");

    const getBlockValue = (block: any, field: 'title' | 'content') => {
        // 1. Try new translation structure: block.translations[locale][field]
        const translated = block.translations?.[locale]?.[field];
        if (translated !== undefined && translated !== null) return translated;

        // 2. Fallback to old structure: block[field][locale]
        const val = block[field];
        if (val && typeof val === 'object' && val[locale]) return val[locale];

        // 3. Fallback to raw string (legacy PT content at root)
        if (typeof val === 'string' && locale === 'pt') return val;

        return '';
    };

    const handleMediaClick = (src: string) => {
        setSelectedMedia(src);
    };

    // Fallback migration: If contentBlocks is absent, build it temporarily from legacy galleryImages.
    const blocks = project.contentBlocks && project.contentBlocks.length > 0
        ? project.contentBlocks
        : project.galleryImages?.map((url, i) => ({
            id: `legacy-${i}-${Date.now()}`,
            type: 'image',
            content: url
        })) || [];

    return (
        <div className="flex flex-col w-full">
            {blocks.map((block: any, index: number) => {

                if (block.type === 'image') {
                    return (
                        <GalleryParallax
                            key={block.id || index}
                            images={[block.content]}
                            title={project.title}
                            onMediaClick={handleMediaClick}
                            mode={block.mode || "contain"}
                        />
                    );
                }

                if (block.type === 'video') {
                    return (
                        <div key={block.id || index} className="w-full bg-black">
                            <video
                                src={block.content}
                                className="w-full h-auto object-contain max-h-[100vh]"
                                controls
                                muted
                                autoPlay
                                loop
                                playsInline
                            />
                        </div>
                    );
                }

                if (block.type === 'text') {
                    return (
                        <div key={block.id || index} className="bg-black py-20 md:py-24 lg:py-32 border-y border-white/5">
                            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[60px]">
                                <FadeIn>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 xl:gap-24">
                                        <div className="md:col-span-12 xl:col-span-4">
                                            {getBlockValue(block, 'title') && (
                                                <h2 className="text-3xl md:text-4xl xl:text-5xl text-white font-medium tracking-tight">
                                                    {getBlockValue(block, 'title')}
                                                </h2>
                                            )}
                                        </div>
                                        <div className="md:col-span-12 xl:col-span-8 flex items-center">
                                            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-[800px] whitespace-pre-line">
                                                {getBlockValue(block, 'content')}
                                            </p>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>
                    );
                }

                if (block.type === 'embed') {
                    const getEmbedContent = (code: string) => {
                        if (!code) return '';
                        if (code.includes('<iframe')) return code;

                        let url = code.trim();
                        if (url.includes('youtube.com/watch?v=')) {
                            const id = url.split('v=')[1]?.split('&')[0];
                            url = `https://www.youtube.com/embed/${id}`;
                        } else if (url.includes('youtu.be/')) {
                            const id = url.split('youtu.be/')[1]?.split('?')[0];
                            url = `https://www.youtube.com/embed/${id}`;
                        } else if (url.includes('vimeo.com/')) {
                            const id = url.split('vimeo.com/')[1]?.split('?')[0];
                            url = `https://player.vimeo.com/video/${id}`;
                        }
                        return `<iframe src="${url}" allowfullscreen></iframe>`;
                    };

                    return (
                        <ParallaxBlock key={block.id || index} className="bg-black">
                            <div className="flex justify-center">
                                <div
                                    className="w-full aspect-video relative [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                                    dangerouslySetInnerHTML={{ __html: getEmbedContent(block.embedCode) }}
                                />
                            </div>
                        </ParallaxBlock>
                    );
                }

                if (block.type === 'compare') {
                    const beforeImg = block.before || block.images?.[0] || "";
                    const afterImg = block.after || block.images?.[1] || "";
                    if (!beforeImg && !afterImg) return null;
                    return (
                        <ParallaxBlock key={block.id || index} className="bg-black">
                            <CompareSlider
                                beforeImage={beforeImg}
                                afterImage={afterImg}
                            />
                        </ParallaxBlock>
                    );
                }

                if (block.type === 'photo-grid' || block.type === 'grid') {
                    let layout = block.layout;
                    if (!layout && block.columns) {
                        layout = `cols-${block.columns}`;
                    }
                    if (!layout) layout = 'cols-2';

                    const images = block.images || [];

                    let gridClass = "grid gap-px md:gap-1 overflow-hidden bg-black w-full mx-auto md:max-w-[calc(100vh*16/9)] md:aspect-video";
                    if (layout === 'cols-2') gridClass += " grid-cols-2";
                    else if (layout === 'cols-3') gridClass += " grid-cols-3";
                    else if (layout === 'cols-4') gridClass += " grid-cols-2 md:grid-cols-4";
                    else if (layout === 'mosaic-1-2' || layout === 'mosaic-2-1') {
                        gridClass += " md:grid-cols-2 md:grid-rows-2";
                    }

                    return (
                        <div key={block.id || index} className="relative w-full overflow-hidden bg-black flex items-center justify-center max-h-screen h-auto">
                            <div className="relative w-full h-auto flex items-center justify-center">
                                <div className={gridClass}>
                                    {images.map((img: string, iIdx: number) => {
                                        let itemClass = "relative overflow-hidden cursor-pointer group h-full";

                                        const mobileHeight = "min-h-[40vh]";
                                        const heightClass = `${mobileHeight} md:h-full`;

                                        if (layout === 'mosaic-1-2') {
                                            if (iIdx === 0) itemClass += " md:col-start-1 md:row-start-1 md:row-span-2";
                                            else if (iIdx === 1) itemClass += " md:col-start-2 md:row-start-1";
                                            else if (iIdx === 2) itemClass += " md:col-start-2 md:row-start-2";
                                        } else if (layout === 'mosaic-2-1') {
                                            if (iIdx === 0) itemClass += " md:col-start-1 md:row-start-1";
                                            else if (iIdx === 1) itemClass += " md:col-start-1 md:row-start-2";
                                            else if (iIdx === 2) itemClass += " md:col-start-2 md:row-start-1 md:row-span-2";
                                        }

                                        return (
                                            <div
                                                key={iIdx}
                                                className={`${itemClass} ${heightClass}`}
                                                onClick={() => handleMediaClick(img)}
                                            >
                                                <img
                                                    src={img}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover bg-black"
                                                    alt={`${project.title} - ${tData(`${slug}.category`) || ""} por Palaz Strategy Company - Imagem ${iIdx + 1}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }

                return null;
            })}

            {/* Antes/Depois legado */}
            {project.compareImages && project.compareImages.before && project.compareImages.after && !blocks.some((b: any) => b.type === 'compare') && (
                <ParallaxBlock className="bg-[#A6C4C8]">
                    <CompareSlider
                        beforeImage={project.compareImages.before}
                        afterImage={project.compareImages.after}
                    />
                </ParallaxBlock>
            )}

            <Lightbox
                src={selectedMedia || ""}
                isOpen={!!selectedMedia}
                onClose={() => setSelectedMedia(null)}
            />
        </div>
    )
}

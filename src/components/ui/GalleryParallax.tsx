"use client"

import { useRef } from "react"
import {  m, useScroll, useTransform  } from 'framer-motion'
import Image from "next/image"

interface GalleryParallaxProps {
    images: string[]
    title: string;
    mode?: "contain" | "cover";
    onMediaClick?: (src: string) => void;
}

function ParallaxImage({ src, alt, mode = "contain", onClick }: { src: string; alt: string; mode?: "contain" | "cover"; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Image moves slightly slower than the scroll (parallax depth)
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

    const isVideo = src.toLowerCase().endsWith(".mp4")

    return (
        <div 
            ref={ref} 
            className={`relative w-full overflow-hidden cursor-pointer ${mode === "contain" ? "bg-black flex items-center justify-center max-h-screen" : ""}`}
            onClick={onClick}
        >
            <m.div 
                style={{ y: isVideo ? 0 : y }} 
                className={`relative w-full ${mode === "contain" ? "h-auto max-h-screen flex items-center justify-center" : ""}`}
            >
                {isVideo ? (
                    <video
                        src={src}
                        controls
                        className={`${mode === "contain" ? "w-full h-auto max-h-screen object-contain mx-auto" : "w-full h-auto object-contain"}`}
                    />
                ) : (
                    <Image
                        src={src}
                        alt={alt}
                        width={1920}
                        height={1080}
                        className={`${mode === "contain" ? "w-full h-auto max-h-screen object-contain mx-auto object-center" : "w-full h-auto object-contain"}`}
                        unoptimized
                    />
                )}
                {mode === "contain" && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                )}
            </m.div>
        </div>
    )
}

export function GalleryParallax({ images, title, mode = "contain", onMediaClick }: GalleryParallaxProps) {
    if (!images || images.length === 0) return null

    return (
        <div className="flex flex-col w-full">
            {images.map((img, idx) => (
                <ParallaxImage 
                    key={idx} 
                    src={img} 
                    alt={`${title} gallery ${idx + 1}`} 
                    mode={mode} 
                    onClick={() => onMediaClick?.(img)}
                />
            ))}
        </div>
    )
}

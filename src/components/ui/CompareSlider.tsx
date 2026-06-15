'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {  m  } from 'framer-motion'

interface CompareSliderProps {
    beforeImage: string
    afterImage: string
}

export function CompareSlider({ beforeImage, afterImage }: CompareSliderProps) {
    const [sliderX, setSliderX] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 100
        setSliderX(Math.min(Math.max(x, 0), 100))
    }

    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)

    return (
        <div className="w-full h-auto max-h-screen bg-black flex items-center justify-center overflow-hidden">
            <div 
                ref={containerRef}
                className="relative w-full aspect-video mx-auto md:max-w-[calc(100vh*16/9)] cursor-ew-resize overflow-hidden"
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
            >
                {/* Base Image (Bottom layer) */}
                <div className="absolute inset-0">
                    <Image
                        src={afterImage}
                        alt="After"
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover select-none pointer-events-none"
                        priority
                        unoptimized
                    />
                </div>

                {/* Before Image (Top layer, spans inner container perfectly) */}
                <m.div 
                    className="absolute inset-0 border-r border-white/20 z-10"
                    style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
                >
                    <Image
                        src={beforeImage}
                        alt="Before"
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover select-none pointer-events-none"
                        priority
                        unoptimized
                    />
                </m.div>

                {/* Slider Handle */}
                <div 
                    className="absolute top-0 bottom-0 z-20 w-px bg-white/50"
                    style={{ left: `${sliderX}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#F24B0F] rounded-full flex items-center justify-center z-30 shadow-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="m11 17-5-5 5-5M13 17l5-5-5-5"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

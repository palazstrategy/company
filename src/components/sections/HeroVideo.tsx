"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

interface HeroVideoProps {
  desktopSrc?: string
  mobileSrc?: string
  desktopPoster?: string
  mobilePoster?: string
  className?: string
  // Retrocompatibilidade
  src?: string
  poster?: string
}

export function HeroVideo({
  desktopSrc = "/hero-desktop.mp4",
  mobileSrc = "/hero-mobile.mp4",
  desktopPoster = "/hero-poster-desktop.webp",
  mobilePoster = "/hero-poster-mobile.webp",
  className = "",
  src,
  poster,
}: HeroVideoProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(containerRef, { margin: "0px" })
  const [, setIsPlaying] = useState(false)

  const finalDesktopSrc = src || desktopSrc
  const finalDesktopPoster = poster || desktopPoster

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const activeVideo = isMobile ? mobileVideoRef.current : desktopVideoRef.current
    const inactiveVideo = isMobile ? desktopVideoRef.current : mobileVideoRef.current

    if (inactiveVideo) {
      inactiveVideo.pause()
    }

    if (!activeVideo) return

    if (isInView) {
      const promise = activeVideo.play()
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch((err) => {
          console.error("Autoplay prevented:", err)
        })
      }
    } else {
      activeVideo.pause()
      setIsPlaying(false)
    }
  }, [isInView])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Vídeo Desktop (Telas a partir de 768px / md) */}
      <video
        ref={desktopVideoRef}
        src={finalDesktopSrc}
        poster={finalDesktopPoster}
        muted
        loop
        playsInline
        preload="metadata"
        // @ts-expect-error - fetchPriority é suportado em navegadores modernos
        fetchPriority="high"
        className={`hidden md:block w-full h-full object-cover will-change-transform transform-gpu ${className}`}
        autoPlay
      />

      {/* Vídeo Mobile Vertical (Telas até 767px) */}
      <video
        ref={mobileVideoRef}
        src={mobileSrc}
        poster={mobilePoster}
        muted
        loop
        playsInline
        preload="metadata"
        // @ts-expect-error - fetchPriority é suportado em navegadores modernos
        fetchPriority="high"
        className={`block md:hidden w-full h-full object-cover will-change-transform transform-gpu ${className}`}
        autoPlay
      />
    </div>
  )
}

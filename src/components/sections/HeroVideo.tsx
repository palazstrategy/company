"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

interface HeroVideoProps {
  src: string
  poster: string
  className?: string
}

export function HeroVideo({ src, poster, className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Detects if the section is in viewport (even partially)
  // We use margin "200px" to start playing slightly before it enters screen if needed,
  // but "0px" is fine since it's the hero block, already visible on load.
  const isInView = useInView(videoRef, { margin: "0px" })
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isInView) {
      // It's in view, let's play
      const promise = video.play()
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch((err) => {
          // Auto-play was prevented
          console.error("Autoplay prevented:", err)
        })
      }
    } else {
      // Off-screen, pause it to free up GPU and CPU cycles
      video.pause()
      setIsPlaying(false)
    }
  }, [isInView])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      // @ts-expect-error - fetchPriority is supported in modern browsers but some TS versions might not have it in VideoHTMLAttributes
      fetchPriority="high"
      className={`${className} will-change-transform transform-gpu`}
      // We don't use autoPlay directly here because we manage it via JS for performance,
      // but putting it guarantees initial render trigger in some strict browsers.
      autoPlay
    />
  )
}

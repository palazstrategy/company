"use client"

import {  m  } from 'framer-motion'
import { useEffect, useState } from "react"
import { ARPEGGIO_EASE } from "./FadeIn"

const COLUMNS = 5

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex" aria-hidden="true">
            {Array.from({ length: COLUMNS }).map((_, i) => (
                <m.div
                    key={i}
                    initial={{ y: "0%" }}
                    animate={
                        isLoading
                            ? { y: "0%" }
                            : { y: "-110%", transitionEnd: { display: "none" } }
                    }
                    transition={{
                        duration: 0.5,
                        ease: ARPEGGIO_EASE,
                        delay: isLoading ? 0 : i * 0.04,
                    }}
                    className="flex-1 h-[105vh] bg-[#F24B0F]"
                />
            ))}
        </div>
    )
}

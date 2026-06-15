"use client"

import {  AnimatePresence, m  } from 'framer-motion'
import { useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ARPEGGIO_EASE } from "@/components/animations/FadeIn"

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isFirstRender = useRef(true)

    useLayoutEffect(() => {
        if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
            history.scrollRestoration = 'auto'
        }

        // Skip scroll reset on initial page load (F5/reload)
        // so SmoothScrollProvider can restore the saved position
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        // Force immediate scroll reset on route navigation
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

    }, [pathname])

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: ARPEGGIO_EASE,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            transition: {
                duration: 0.4,
                ease: ARPEGGIO_EASE
            }
        }
    }

    return (
        <AnimatePresence mode="wait">
            <m.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </m.div>
        </AnimatePresence>
    )
}

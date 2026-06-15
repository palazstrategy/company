"use client"

import {  m, useInView  } from 'framer-motion'
import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

export const ARPEGGIO_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface FadeInProps {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    className?: string
    duration?: number
    once?: boolean
    scale?: number
    staggerIndex?: number
    useVariants?: boolean
}

export function FadeIn({
    children,
    delay,
    direction = "up",
    className,
    duration = 1.0,
    once = true,
    scale = 1,
    useVariants = false
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: "-10% 0px" })

    const getHiddenPosition = () => {
        switch (direction) {
            case "up":
                return { y: 30 }
            case "down":
                return { y: -30 }
            case "left":
                return { x: 30 }
            case "right":
                return { x: -30 }
            case "none":
            default:
                return { y: 0, x: 0 }
        }
    }

    // Variantes para orquestração (via PageTransition pai)
    // Mantemos a opacidade inicial 1 para o elemento já estar na tela
    // e ser revelado apenas pelo movimento geográfico da cortina do Preloader subindo.
    const fadeVariants = {
        initial: { opacity: 0, scale: scale, ...getHiddenPosition() },
        animate: {
            opacity: 1, x: 0, y: 0, scale: 1,
            transition: {
                duration: duration,
                ease: ARPEGGIO_EASE,
                ...(delay !== undefined && { delay }) // Sobrescreve stagging natural se passar delay
            }
        }
    }

    if (useVariants) {
        return (
            <m.div
                variants={fadeVariants}
                className={cn("w-full", className)}
            >
                {children}
            </m.div>
        )
    }

    return (
        <m.div
            ref={ref}
            initial={{ opacity: 0, scale: scale, ...getHiddenPosition() }}
            animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, scale: scale, ...getHiddenPosition() }}
            transition={{
                duration: duration,
                delay: delay || 0,
                ease: ARPEGGIO_EASE,
            }}
            className={cn("w-full", className)}
        >
            {children}
        </m.div>
    )
}

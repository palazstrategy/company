"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {  m, useMotionValue, AnimatePresence  } from 'framer-motion'
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function CustomCursor() {
    let verLabel = "VER";
    try {
        const t = useTranslations("Cursor")
        verLabel = t("ver")
    } catch (e) {
        // Fallback para quando o componente for renderizado fora de um contexto NextIntl
        console.warn("CustomCursor rendered without NextIntl context, using fallback label.");
    }

    const [isHovering, setIsHovering] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const [cursorLabel, setCursorLabel] = useState<string | null>(null)
    const lastMousePos = useRef({ x: 0, y: 0 })

    // Motion Values para performance máxima
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // O cursor deve ser 100% preciso, seguindo o mouse sem delay ou efeito de mola
    const cursorX = mouseX
    const cursorY = mouseY

    const updateMousePosition = useCallback((e: MouseEvent) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
        lastMousePos.current = { x: e.clientX, y: e.clientY }
    }, [mouseX, mouseY])

    const checkElementUnderMouse = useCallback((target: HTMLElement | null) => {
        if (!target) return
        const interactive = target.closest('a, button, [role="button"]')
        const project = target.closest(`[data-cursor-label="${verLabel}"]`)
        const label = target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label')

        setIsHovering(!!interactive && !project)
        setCursorLabel(label || null)
    }, [verLabel])

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleMouseDown = () => setIsPressed(true)
        const handleMouseUp = () => setIsPressed(false)

        const onMouseMove = (e: MouseEvent) => {
            updateMousePosition(e)
            checkElementUnderMouse(e.target as HTMLElement)
        }

        const onMouseOver = (e: MouseEvent) => {
            checkElementUnderMouse(e.target as HTMLElement)
        }

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("mouseover", onMouseOver)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            window.removeEventListener("mouseover", onMouseOver)
        }
    }, [updateMousePosition, checkElementUnderMouse])

    if (!mounted) return null

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null
    }

    return (
        <div id="custom-cursor-container" className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block" style={{ mixBlendMode: 'difference' }}>
            {/* Arpeggio Supreme Cursor - Ponto Laranja Vibrante #F24B0F */}
            <m.div
                className="absolute top-0 left-0 flex items-center justify-center rounded-full pointer-events-none transition-colors duration-300"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    // Tamanho Arpeggio: 24px base -> 120px Glass Hover nos projetos
                    width: cursorLabel ? 120 : 24,
                    height: cursorLabel ? 120 : 24,
                    backgroundColor: cursorLabel ? "rgba(255, 255, 255, 0.6)" : "#F24B0F",
                    backdropFilter: cursorLabel ? "blur(8px)" : "none",
                    willChange: "transform, width, height",
                }}
                animate={{
                    scale: isPressed ? 0.9 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.2 }}
            >
                <AnimatePresence mode="wait">
                    {/* Rótulo "VISIT" do Arpeggio (Minimalista e Elegante) */}
                    {cursorLabel === verLabel ? (
                        <m.span
                            key="visit"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[14px] font-bold tracking-[0.1em] text-black uppercase font-sans"
                        >
                            {verLabel}
                        </m.span>
                    ) : isHovering ? (
                        <m.div
                            key="arrow"
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        >
                            <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </m.div>
                    ) : cursorLabel && (
                        <m.span
                            key="custom-label"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[14px] font-bold tracking-[0.1em] text-black uppercase font-sans"
                        >
                            {cursorLabel}
                        </m.span>
                    )}
                </AnimatePresence>
            </m.div>
        </div>
    )
}

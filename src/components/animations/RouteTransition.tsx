"use client"

import {  AnimatePresence, m  } from 'framer-motion'
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { ARPEGGIO_EASE } from "./FadeIn"

export function RouteTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        // Sempre aplica um pequeno delay no primeiro mount da árvore (full page reload)
        // para aguardar a abertura do preloader inicial.
    }, [])

    const columns = 5

    // Padrão Two-Pass Rendering para SSR:
    // O servidor renderiza apenas o conteúdo estático para evitar mismatch de transform/opacity.
    // O cliente assume as animações e overlays após o mount.
    if (!isClient) {
        return (
            <div className="w-full h-full flex flex-col relative">
                {children}
            </div>
        )
    }

    return (
        <AnimatePresence 
            mode="wait" 
            onExitComplete={() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                window.dispatchEvent(new CustomEvent('scroll-to-top'));
            }}
        >
            <m.div
                key={pathname}
                className="w-full h-full flex flex-col relative"
            >
                {/* Conteúdo da página */}
                <m.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.5,
                            ease: ARPEGGIO_EASE,
                            delay: 0.35,
                        }
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                        ease: ARPEGGIO_EASE,
                    }}
                >
                    {children}
                </m.div>

                {/* Camadas de animação (Overlays) */}
                <>
                    {/* Camada de REVELAÇÃO */}
                    <div className="fixed inset-0 z-[999] pointer-events-none flex" aria-hidden="true">
                        {Array.from({ length: columns }).map((_, i) => (
                            <m.div
                                key={`reveal-${i}`}
                                className="flex-1 h-[110vh] bg-[#F24B0F]"
                                initial={{ y: "0%" }}
                                animate={{
                                    y: "-110%",
                                    transition: {
                                        duration: 0.5,
                                        ease: ARPEGGIO_EASE,
                                        delay: i * 0.04,
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Camada de COBERTURA */}
                    <div className="fixed inset-0 z-[999] pointer-events-none flex" aria-hidden="true">
                        {Array.from({ length: columns }).map((_, i) => (
                            <m.div
                                key={`cover-${i}`}
                                className="flex-1 h-[110vh] bg-[#F24B0F]"
                                initial={{ y: "110%" }}
                                exit={{
                                    y: "0%",
                                    transition: {
                                        duration: 0.4,
                                        ease: ARPEGGIO_EASE,
                                        delay: i * 0.04,
                                    }
                                }}
                            />
                        ))}
                    </div>
                </>
            </m.div>
        </AnimatePresence>
    )
}

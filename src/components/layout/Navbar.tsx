"use client"

import { useState, useEffect, useRef } from "react"
import {Link, usePathname} from "@/i18n/routing"
import {  m, useScroll, useMotionValueEvent, AnimatePresence, useTransform, useMotionValue, animate  } from 'framer-motion'
import { ARPEGGIO_EASE } from "@/components/animations/FadeIn"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Monitor } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"

export function Navbar() {
    const t = useTranslations("Navigation")
    const { scrollY } = useScroll()
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [windowHeight, setWindowHeight] = useState(1000)
    const [targetScaleDesk, setTargetScaleDesk] = useState(0.058)
    const [targetScaleMob, setTargetScaleMob] = useState(0.058)
    const [targetXDesk, setTargetXDesk] = useState(0)
    const [targetXMob, setTargetXMob] = useState(0)
    const [isHoveredMenu, setIsHoveredMenu] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
            const deskWidth = Math.min(window.innerWidth, 1440) - 120 // 60px padding em cada lado
            setTargetScaleDesk(21 / (deskWidth / 3.2)) // 1920/600 = 3.2
            setTargetXDesk(108 + (21 * 3.2) / 2 - (Math.min(window.innerWidth, 1440) / 2))
            
            const mobWidth = window.innerWidth - 48 // 24px padding em cada lado (px-6)
            setTargetScaleMob(21 / (mobWidth / 3.2))
            setTargetXMob(24 + 35 + 13 + (21 * 3.2) / 2 - (window.innerWidth / 2))
        }
        handleResize()
        window.addEventListener("resize", handleResize)

        if (menuOpen) {
            document.body.style.overflow = "hidden"
            document.body.style.touchAction = "none"
        } else {
            document.body.style.overflow = ""
            document.body.style.touchAction = ""
        }

        return () => {
            window.removeEventListener("resize", handleResize)
            document.body.style.overflow = ""
            document.body.style.touchAction = ""
        }
    }, [menuOpen])

    // MotionValues efetivos que controlam as propriedades CSS de fato na tela
    const logoYDesk = useMotionValue(windowHeight * 0.75)
    const logoXDesk = useMotionValue(0)
    const logoScaleDesk = useMotionValue(1)

    const logoYMob = useMotionValue(windowHeight * 0.84)
    const logoXMob = useMotionValue(0)
    const logoScaleMob = useMotionValue(1)

    // --- LÓGICA DE ANIMAÇÃO NO SCROLL ---
    // Valores de referência (Base Scroll) calculados silenciosamente a partir do scrollY
    const logoYDeskBase = useTransform(scrollY, [0, 400], [windowHeight * 0.75, 24.5])
    const logoScaleDeskBase = useTransform(scrollY, (y) => {
        const p = Math.min(Math.max(y / 400, 0), 1)
        return 1 - (1 - targetScaleDesk) * p
    })

    const logoYMobBase = useTransform(scrollY, [0, 300], [windowHeight * 0.84, 24.5])
    const logoScaleMobBase = useTransform(scrollY, [0, 300], [1, targetScaleMob])

    const logoXDeskBase = useTransform(scrollY, [0, 400], [0, targetXDesk])
    const logoXMobBase = useTransform(scrollY, [0, 300], [0, targetXMob])

    // Estilos de transformação para a logo centralizada (Home) - Devem ficar no topo (Rules of Hooks)
    const logoXDeskStyle = useTransform(logoXDesk, (v) => `calc(-50% + ${v}px)`)
    const logoXMobStyle = useTransform(logoXMob, (v) => `calc(-50% + ${v}px)`)

    // 1. Sincroniza o valor de scroll com o DOM contanto que o menu NÃO esteja aberto
    useMotionValueEvent(logoYDeskBase, "change", (latest) => { if (!menuOpen) logoYDesk.set(latest) })
    useMotionValueEvent(logoXDeskBase, "change", (latest) => { if (!menuOpen) logoXDesk.set(latest) })
    useMotionValueEvent(logoScaleDeskBase, "change", (latest) => { if (!menuOpen) logoScaleDesk.set(latest) })

    useMotionValueEvent(logoYMobBase, "change", (latest) => { if (!menuOpen) logoYMob.set(latest) })
    useMotionValueEvent(logoXMobBase, "change", (latest) => { if (!menuOpen) logoXMob.set(latest) })
    useMotionValueEvent(logoScaleMobBase, "change", (latest) => { if (!menuOpen) logoScaleMob.set(latest) })

    // 1.5. Sincronização forçada no carregamento e no resize do client-side
    // Atualiza a logo instantaneamente da altura SSR padrão (1000px) para a altura real do device no momento do mount
    useEffect(() => {
        if (!menuOpen) {
            logoYDesk.set(logoYDeskBase.get())
            logoXDesk.set(logoXDeskBase.get())
            logoScaleDesk.set(logoScaleDeskBase.get())
            logoYMob.set(logoYMobBase.get())
            logoXMob.set(logoXMobBase.get())
            logoScaleMob.set(logoScaleMobBase.get())
        }
    }, [windowHeight, menuOpen, logoYDeskBase, logoXDeskBase, logoScaleDeskBase, logoYMobBase, logoXMobBase, logoScaleMobBase, logoYDesk, logoXDesk, logoScaleDesk, logoYMob, logoXMob, logoScaleMob])

    // 2. Transições forçosas do cabeçalho na abertura/fechamento do Menu Independente do scroll
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }

        if (menuOpen) {
            animate(logoYDesk, 24.5, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoXDesk, targetXDesk, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoScaleDesk, targetScaleDesk, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoYMob, 24.5, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoXMob, targetXMob, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoScaleMob, targetScaleMob, { duration: 0.6, ease: ARPEGGIO_EASE as [number, number, number, number] })
        } else {
            animate(logoYDesk, logoYDeskBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoXDesk, logoXDeskBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoScaleDesk, logoScaleDeskBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoYMob, logoYMobBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoXMob, logoXMobBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
            animate(logoScaleMob, logoScaleMobBase.get(), { duration: 0.5, ease: ARPEGGIO_EASE as [number, number, number, number] })
        }
    }, [menuOpen, targetScaleDesk, targetScaleMob, targetXDesk, targetXMob, logoYDesk, logoXDesk, logoScaleDesk, logoYMob, logoXMob, logoScaleMob, logoYDeskBase, logoXDeskBase, logoScaleDeskBase, logoYMobBase, logoXMobBase, logoScaleMobBase])

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50)
    })

    const navLinks = [
        { href: "/", label: t("inicio") },
        { href: "/cases", label: t("cases") },
        { href: "/sobre", label: t("sobre") },
        { href: "/produtos/fatuz", label: t("produtos") },
        { href: "/contato", label: t("contato") },
    ]

    return (
        <>
            <m.header
                initial={{ y: "-100%", opacity: 1 }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{ duration: 0.8, ease: ARPEGGIO_EASE, delay: 0.9 }}
                className="fixed top-0 inset-x-0 z-50 h-[70px]"
            >
                {/* Background overlay para evitar piscar tela com transição de filter nativo */}
                <div 
                    className={`absolute inset-0 transition-opacity duration-300 pointer-events-none border-b bg-black/80 backdrop-blur-md ${
                        scrolled && !menuOpen 
                        ? "opacity-100 border-white/5" 
                        : "opacity-0 border-transparent"
                    }`}
                />
                <div className="relative z-10 max-w-[1440px] w-full h-full mx-auto px-6 lg:px-[60px] flex items-center justify-between">
                    {/* Left: Logo & Icon */}
                    <div className="flex-1 flex justify-start items-center gap-[13px]">
                        <Link href="/" className="relative h-[35px] w-[35px]" onClick={() => setMenuOpen(false)} prefetch={false}>
                            <Image
                                src="/icone-palaz.png"
                                alt="Palaz Strategy & Design - Ícone"
                                fill
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </Link>
                        {/* Logo Text (Animated on internal pages) */}
                        {pathname !== "/" && (
                            <m.div
                                initial={{ y: "-100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: ARPEGGIO_EASE, delay: 0.9 }}
                            >
                                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center hover:opacity-80 transition-opacity" prefetch={false}>
                                    <Image 
                                        src="/logo-palaz.png" 
                                        alt="Palaz Strategy & Design" 
                                        width={112} 
                                        height={21} 
                                        priority 
                                        className="h-[21px] w-auto drop-shadow-md translate-y-[1px]" 
                                        unoptimized
                                    />
                                </Link>
                            </m.div>
                        )}
                    </div>

                    {/* Right: Contato & Menu Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Language Switcher & Editor Link - Desktop only */}
                        <div className="hidden md:flex items-center gap-2">
                            {process.env.NODE_ENV === 'development' && (
                                <Link 
                                    href="/editor" 
                                    className="p-2 transition-colors duration-300 text-white/50 hover:text-[#F24B0F]"
                                    title="Ir para o Editor"
                                    prefetch={false}
                                >
                                    <Monitor size={20} />
                                </Link>
                            )}
                            <LanguageSwitcher />
                        </div>
                        
                        <Link
                            href="/contato"
                            onClick={() => setMenuOpen(false)}
                            className="hidden md:flex items-center gap-2 bg-white text-black pl-1 pr-3 h-[35px] rounded-full transition-all duration-500 group relative border border-transparent hover:bg-[#F24B0F] hover:text-white cursor-none"
                            prefetch={false}
                        >
                            <m.div 
                                className="flex items-center gap-2"
                                initial={false}
                            >
                                <span className="bg-[#F24B0F] text-white rounded-full p-1.5 transition-all duration-500 group-hover:bg-white group-hover:text-[#F24B0F] flex items-center justify-center">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[12px] font-bold tracking-tight uppercase">{t("contato")}</span>
                            </m.div>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            onMouseEnter={() => setIsHoveredMenu(true)}
                            onMouseLeave={() => setIsHoveredMenu(false)}
                            className="flex flex-col justify-center h-[35px] gap-[6px] px-2 z-50 group relative cursor-none"
                            aria-label="Toggle menu"
                        >
                            <m.span
                                animate={menuOpen ? { rotate: 45, y: 4, backgroundColor: "#fff" } : { rotate: 0, y: 0, backgroundColor: isHoveredMenu ? "#F24B0F" : "#fff" }}
                                transition={{ ease: ARPEGGIO_EASE, duration: 0.5 }}
                                className="w-8 h-[2px] block origin-center"
                            />
                            <m.span
                                animate={menuOpen ? { rotate: -45, y: -4, backgroundColor: "#fff" } : { rotate: 0, y: 0, backgroundColor: isHoveredMenu ? "#F24B0F" : "#fff" }}
                                transition={{ ease: ARPEGGIO_EASE, duration: 0.5 }}
                                className="w-8 h-[2px] block origin-center"
                            />
                            <m.span
                                animate={menuOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: isHoveredMenu ? "#F24B0F" : "#fff" }}
                                transition={{ ease: ARPEGGIO_EASE, duration: 0.5 }}
                                className="w-8 h-[2px] block origin-center"
                            />
                        </button>
                    </div>
                </div>
            </m.header>

            {/* Logo Centralizada (Animada na Home, Estática nas demais páginas) */}
            {pathname === "/" && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="fixed inset-0 pointer-events-none z-[55]"
                >
                    {/* Desktop Animated Logo */}
                    <m.div
                        className="absolute left-1/2 hidden md:flex justify-center w-full max-w-[1440px] px-6 lg:px-[60px]"
                        style={{
                            x: logoXDeskStyle,
                            y: logoYDesk,
                            scale: logoScaleDesk,
                            transformOrigin: "top center"
                        }}
                    >
                        <Image src="/logo-palaz.png" alt="Palaz Strategy & Design" width={1920} height={600} priority className="w-full h-auto drop-shadow-lg" unoptimized />
                    </m.div>

                    {/* Mobile Animated Logo */}
                    <m.div
                        className="absolute left-1/2 flex md:hidden justify-center w-full px-6"
                        style={{
                            x: logoXMobStyle,
                            y: logoYMob,
                            scale: logoScaleMob,
                            transformOrigin: "top center"
                        }}
                    >
                        <Image src="/logo-palaz.png" alt="Palaz Strategy & Design" width={1920} height={600} priority className="w-full h-auto drop-shadow-lg" unoptimized />
                    </m.div>
                </m.div>
            )}

            {/* Fullscreen Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: ARPEGGIO_EASE }}
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-lg"
                    >
                        <div className="h-full w-full max-w-[1440px] mx-auto px-6 lg:px-[60px] flex flex-col justify-between pt-24 pb-10 md:pt-0 md:pb-0 md:flex-row md:items-center md:justify-between md:gap-12">

                            {/* Navigation Links — Right on mobile & desktop */}
                            <nav className="flex flex-col items-end gap-3 md:gap-5 md:order-2">
                                {navLinks.map((link, idx) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <m.div
                                            key={link.href}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{ delay: idx * 0.07, duration: 0.7, ease: ARPEGGIO_EASE }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMenuOpen(false)}
                                                className={`text-[clamp(50px,12vw,100px)] font-bold tracking-[-0.03em] leading-[1.05] transition-colors flex items-center gap-4 ${isActive ? 'text-[#F24B0F]' : 'text-white hover:text-[#F24B0F]'}`}
                                                prefetch={false}
                                            >
                                                {isActive && (
                                                    <m.span
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.4, ease: ARPEGGIO_EASE }}
                                                    >
                                                        <ArrowRight className="w-[clamp(30px,6vw,60px)] h-[clamp(30px,6vw,60px)] stroke-[1.5]" />
                                                    </m.span>
                                                )}
                                                {link.label}
                                            </Link>
                                        </m.div>
                                    )
                                })}
                                {/* Language switcher - Mobile only */}
                                <m.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ delay: navLinks.length * 0.07, duration: 0.7, ease: ARPEGGIO_EASE }}
                                    className="md:hidden mt-6 flex flex-col items-end gap-4"
                                >
                                    {process.env.NODE_ENV === 'development' && (
                                        <Link 
                                            href="/editor" 
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-white/70 hover:text-[#F24B0F] transition-all"
                                            prefetch={false}
                                        >
                                            <span className="text-xs font-semibold uppercase tracking-wider">Editor</span>
                                            <Monitor size={18} />
                                        </Link>
                                    )}
                                    <LanguageSwitcher />
                                </m.div>
                            </nav>

                            {/* Contact Info — Right on mobile, Left on desktop */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: ARPEGGIO_EASE }}
                                className="md:order-1 flex flex-col items-end md:items-start gap-2 md:gap-3 mt-auto md:mt-0 w-full md:w-auto"
                            >
                                <div className="w-full md:w-auto flex flex-col items-end md:items-start">
                                    <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-semibold mb-4 md:mb-6">{t("contato")}</p>
                                    
                                    <div className="flex flex-col w-full md:min-w-[300px]">
                                        {[
                                            { label: 'Instagram', href: 'https://www.instagram.com/palazstrategy/' },
                                            { label: 'Behance', href: 'https://www.behance.net/palazstrategycompany' },
                                            { label: 'WhatsApp', href: 'https://wa.me/553196117847' },
                                            { label: 'E-mail', href: 'mailto:ola@palaz.com.br' }
                                        ].map((social) => (
                                            <a 
                                                key={social.label}
                                                href={social.href} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="group flex items-center justify-end md:justify-between py-3 md:py-4 border-b border-white/5 hover:border-white/10 transition-all w-full"
                                            >
                                                <span className="text-xl md:text-2xl font-bold tracking-tighter text-white/70 group-hover:text-[#F24B0F] transition-all duration-500 uppercase">
                                                    {social.label}
                                                </span>
                                                <div className="ml-4 w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-[#F24B0F] group-hover:border-[#F24B0F] transition-all duration-500">
                                                    <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white transition-transform duration-500 group-hover:rotate-12" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </m.div>

                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    )
}

"use client"
import Link from 'next/link'
import { ArrowUpRight } from "lucide-react"
import { CustomCursor } from '@/components/ui/CustomCursor'
import { FramerProvider } from '@/components/providers/FramerProvider'

export default function RootNotFound() {
    return (
        <FramerProvider>
            <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 overflow-hidden relative">
                <CustomCursor />
                {/* Texture Overlay (Grain/Noise) */}
                <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/static/noise.svg')]" />

            {/* Elemento de Design de Fundo - Dramatic 404 */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 flex items-center justify-center pointer-events-none">
                <span className="text-[45vw] font-bold tracking-tighter select-none opacity-[0.08]">404</span>
            </div>

            <div className="relative z-20 flex flex-col items-center max-w-4xl w-full">
                <div className="mb-10 flex justify-center items-center">
                    <div className="w-12 h-[1px] bg-white/20" />
                    <span className="mx-4 text-[10px] uppercase tracking-[0.5em] text-[#F24B0F] font-bold">Error</span>
                    <div className="w-12 h-[1px] bg-white/20" />
                </div>
                
                <h1 className="text-6xl md:text-[120px] font-bold tracking-tightest mb-8 text-center leading-[0.85] italic font-serif">
                    Página Não Encontrada
                </h1>
                
                <p className="text-white/50 text-xl md:text-2xl mb-16 text-center max-w-md mx-auto font-light leading-snug">
                   O endereço que você busca segue em outra direção.<br/>
                   <span className="text-white/30 text-lg">A página não existe ou foi movida.</span>
                </p>
                
                {/* Quick Nav Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 w-full max-w-2xl">
                    {[
                        { label: "Início", href: "/pt" },
                        { label: "Cases", href: "/pt/cases" },
                        { label: "Sobre", href: "/pt/sobre" },
                    ].map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className="group flex items-center justify-between p-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
                        >
                            <span className="text-sm uppercase tracking-widest font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                                {item.label}
                            </span>
                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-40 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500" />
                        </Link>
                    ))}
                </div>

            </div>
            </main>
        </FramerProvider>
    )
}

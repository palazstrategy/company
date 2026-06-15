"use client"

import { useState, useEffect } from "react"
import {  m, AnimatePresence  } from 'framer-motion'
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Mostra o botão apenas quando o usuário rolar para baixo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    // Scroll suave nativo
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center cursor-none"
          aria-label="Voltar ao topo"
        >
          {/* Círculo externo fosco (Frosted Glass) */}
          <div className="relative flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full shadow-xl transition-all duration-500 group-hover:bg-[#F24B0F] group-active:scale-90 border border-white/20">
            {/* Ícone de Seta Menor */}
            <ArrowUp className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-1" />
            
            {/* Efeito de brilho sutil no hover */}
            <div className="absolute inset-0 rounded-full bg-[#F24B0F]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </m.button>
      )}
    </AnimatePresence>
  )
}

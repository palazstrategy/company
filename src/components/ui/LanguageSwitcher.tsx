"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import {  AnimatePresence, m  } from 'framer-motion';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSwitch = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 h-10 rounded-full transition-colors duration-300 text-white/70 hover:text-[#F24B0F]"
        aria-label={locale === 'pt' ? 'Alterar idioma para Inglês' : 'Switch language to Portuguese'}
      >
        <Globe size={22} strokeWidth={1.8} />
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center"
        >
          <ChevronDown size={14} strokeWidth={2} />
        </m.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-20 flex flex-col gap-1 p-1 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[9999]"
          >
            <button
              onClick={() => handleSwitch("pt")}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 text-center ${locale === "pt"
                  ? "bg-[#F24B0F] text-white shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              PT
            </button>
            <button
              onClick={() => handleSwitch("en")}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 text-center ${locale === "en"
                  ? "bg-[#F24B0F] text-white shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              EN
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

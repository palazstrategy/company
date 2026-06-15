"use client"

import { FadeIn } from "@/components/animations/FadeIn"
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import {  m  } from 'framer-motion'
import { useTranslations } from "next-intl"

// --- COMPONENTE SELECT CUSTOMIZADO ---
function CustomSelect({ 
  label, 
  options, 
  value, 
  onChange,
  placeholder
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-2 group relative" ref={containerRef}>
      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
        {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer border-b border-white/20 py-4 group-focus-within:border-[#F24B0F] transition-all duration-500"
      >
        <span className={`text-xl font-light ${value ? 'text-white' : 'text-white/20'}`}>
          {value || placeholder}
        </span>
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#F24B0F]' : 'text-white/30'}`}>
          <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
        </div>

        {/* --- DROPDOWN MENU --- */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            {options.map((option) => (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`px-6 py-4 text-lg font-light transition-colors hover:bg-white/5 hover:text-[#F24B0F] cursor-pointer ${
                  value === option ? 'text-[#F24B0F] bg-white/5' : 'text-white/70'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
    </div>
  )
}

export function ContactClient() {
  const t = useTranslations("Contato")
  const s1 = useTranslations("Contato.section1")
  const s2 = useTranslations("Contato.section2")
  const s3 = useTranslations("Contato.section3")
  
  const [formData, setFormData] = useState({
    employees: "",
    origin: "",
    investment: ""
  })
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName.toUpperCase() === "INPUT") {
      e.preventDefault()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")

    const currentLocale = window.location.pathname.split('/')[1] || 'pt'
    const subject = currentLocale === 'en' 
      ? "New Contact - Web Inquiry (EN)" 
      : "Novo Contato - Site Palaz (PT)"

    const form = e.currentTarget
    const data = new FormData(form)
    
    // Adicionar campos dos selects customizados que não são inputs nativos
    data.append("employees", formData.employees)
    data.append("origin", formData.origin)
    data.append("investment", formData.investment)
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY as string)
    data.append("subject", subject)
    data.append("from_name", "Site Palaz")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      })

      const result = await response.json()

      if (result.success) {
        setStatus("success")
        form.reset()
        setFormData({ employees: "", origin: "", investment: "" })
        // Reset success state after 5 seconds
        setTimeout(() => setStatus("idle"), 5000)
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 5000)
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#F24B0F] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px] pt-24 lg:pt-48 pb-32">
        {/* --- HERO SECTION --- */}
        <div className="mb-24 lg:mb-40">
          <FadeIn>
            <div className="flex flex-col gap-8">
              <h1 className="text-[clamp(50px,9vw,110px)] font-bold tracking-[-0.05em] leading-[1] whitespace-pre-line">
                {t("hero.title_pt1")}
                <span className="font-serif italic text-[#F24B0F] selection:text-white">
                  {t("hero.title_pt2")}
                </span>
                {t("hero.title_pt3") && ` ${t("hero.title_pt3")}`}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 tracking-tight max-w-2xl leading-relaxed font-light mt-4">
                {t("hero.description")}
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="relative">
          <form 
            className="flex flex-col gap-32 lg:gap-48 max-w-6xl mx-auto" 
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          >
            
            {/* --- SEÇÃO 01: IDENTIFICAÇÃO --- */}
            <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
                <div className="relative z-0">
                  <span className="absolute -top-12 -left-6 lg:-left-8 text-[120px] font-bold text-[#F24B0F] leading-none select-none z-[-1]">01</span>
                  <div className="relative z-10 pt-4 lg:pt-6">
                    <h2 className="text-2xl uppercase tracking-[0.15em] font-bold text-white mb-4">{s1("title")}</h2>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FadeIn delay={0.2} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s1("name_label")}
                      </label>
                      <input
                        type="text"
                        required
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s1("name_placeholder")}
                        name="name"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.3} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s1("email_label")}
                      </label>
                      <input
                        type="email"
                        required
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s1("email_placeholder")}
                        name="email"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <FadeIn delay={0.4} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s1("phone_label")}
                      </label>
                      <input
                        type="tel"
                        required
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s1("phone_placeholder")}
                        name="phone"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.5} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s1("state_label")}
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s1("state_placeholder")}
                        name="state"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.6} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s1("city_label")}
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s1("city_placeholder")}
                        name="city"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </section>

            {/* --- SEÇÃO 02: O NEGÓCIO --- */}
            <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
                <div className="relative z-0">
                  <span className="absolute -top-12 -left-6 lg:-left-8 text-[120px] font-bold text-[#F24B0F] leading-none select-none z-[-1]">02</span>
                  <div className="relative z-10 pt-4 lg:pt-6">
                    <h2 className="text-2xl uppercase tracking-[0.15em] font-bold text-white mb-4">{s2("title")}</h2>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FadeIn delay={0.2} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s2("company_label")}
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s2("company_placeholder")}
                        name="company"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.3} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s2("site_label")}
                      </label>
                      <input
                        type="url"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s2("site_placeholder")}
                        name="website"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FadeIn delay={0.4} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s2("instagram_label")}
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s2("instagram_placeholder")}
                        name="instagram"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.5} direction="up">
                    <div className="flex flex-col gap-2 group relative">
                      <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                        {s2("segment_label")}
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                        placeholder={s2("segment_placeholder")}
                        name="business_segment"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                    </div>
                  </FadeIn>
                </div>

                <FadeIn delay={0.6} direction="up">
                  <CustomSelect 
                    label={s2("employees_label")}
                    placeholder={t("choose_option")}
                    value={formData.employees}
                    onChange={(val) => setFormData({...formData, employees: val})}
                    options={[
                      s2("employees_options.opt1"),
                      s2("employees_options.opt2"),
                      s2("employees_options.opt3"),
                      s2("employees_options.opt4")
                    ]}
                  />
                </FadeIn>
              </div>
            </section>

            {/* --- SEÇÃO 03: O PROJETO --- */}
            <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
                <div className="relative z-0">
                  <span className="absolute -top-12 -left-6 lg:-left-8 text-[120px] font-bold text-[#F24B0F] leading-none select-none z-[-1]">03</span>
                  <div className="relative z-10 pt-4 lg:pt-6">
                    <h2 className="text-2xl uppercase tracking-[0.15em] font-bold text-white mb-4">{s3("title")}</h2>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">
                <FadeIn delay={0.2} direction="up">
                  <div className="flex flex-col gap-2 group relative">
                    <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                      {s3("products_label")}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                      placeholder={s3("products_placeholder")}
                      name="products_of_interest"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                  </div>
                </FadeIn>

                <FadeIn delay={0.3} direction="up">
                  <div className="flex flex-col gap-2 group relative">
                    <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                      {s3("extras_label")}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 font-light placeholder:text-white/20"
                      placeholder={s3("extras_placeholder")}
                      name="extras"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FadeIn delay={0.4} direction="up">
                    <CustomSelect 
                      label={s3("origin_label")}
                      placeholder={t("choose_option")}
                      value={formData.origin}
                      onChange={(val) => setFormData({...formData, origin: val})}
                      options={[
                        s3("origin_options.opt1"),
                        s3("origin_options.opt2"),
                        s3("origin_options.opt3"),
                        s3("origin_options.opt4"),
                        s3("origin_options.opt5"),
                        s3("origin_options.opt6")
                      ]}
                    />
                  </FadeIn>

                  <FadeIn delay={0.5} direction="up">
                    <CustomSelect 
                      label={s3("investment_label")}
                      placeholder={t("choose_option")}
                      value={formData.investment}
                      onChange={(val) => setFormData({...formData, investment: val})}
                      options={[
                        s3("investment_options.opt1"),
                        s3("investment_options.opt2"),
                        s3("investment_options.opt3"),
                        s3("investment_options.opt4")
                      ]}
                    />
                  </FadeIn>
                </div>

                <FadeIn delay={0.6} direction="up">
                  <div className="flex flex-col gap-2 group relative">
                    <label className="text-[15px] text-white font-semibold group-focus-within:text-[#F24B0F] transition-all duration-500">
                      {s3("message_label")}
                    </label>
                    <textarea
                      rows={4}
                      className="bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-[#F24B0F] transition-all duration-500 resize-none font-light placeholder:text-white/20"
                      placeholder={s3("message_placeholder")}
                      name="Desafios_e_Objetivos"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F24B0F] group-focus-within:w-full transition-all duration-700 ease-out" />
                  </div>
                </FadeIn>

                <FadeIn delay={0.7}>
                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={`flex items-center gap-3 pl-2 pr-8 h-[55px] rounded-full transition-all duration-500 group relative border border-transparent cursor-none ${
                        status === "success" ? "bg-green-500 text-white" : 
                        status === "error" ? "bg-red-500 text-white" : 
                        "bg-white text-black hover:bg-[#F24B0F] hover:text-white"
                      }`}
                    >
                      <m.div 
                        className="flex items-center gap-3"
                        initial={false}
                      >
                        <span className={`rounded-full p-2.5 transition-all duration-500 flex items-center justify-center ${
                          status === "success" || status === "error" ? "bg-white/20 text-white" : "bg-[#F24B0F] text-white group-hover:bg-white group-hover:text-[#F24B0F]"
                        }`}>
                          {status === "loading" ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )}
                        </span>
                        <span className="text-base md:text-lg font-bold">
                          {status === "loading" ? t("sending") : 
                           status === "success" ? t("sent_success") : 
                           status === "error" ? t("error_send") : 
                           s3("submit")}
                        </span>
                      </m.div>
                    </button>
                  </div>
                </FadeIn>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

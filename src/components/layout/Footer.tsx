"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { FadeIn } from "@/components/animations/FadeIn"
import { useState, useEffect } from "react"

const ArpeggioLink = ({ href, children, noBorder = false, external = false }: { href: string; children: string, noBorder?: boolean, external?: boolean }) => {
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:');
    return (
        <Link
            href={href}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`group flex items-center justify-between py-5 border-white/5 transition-all duration-500 w-full ${noBorder ? '' : 'border-b'}`}
        >
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#F24B0F] transition-all duration-300">
                    {children}
                </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#F24B0F] transition-all duration-500" />
        </Link>
    );
};

export function Footer() {
    const tNav = useTranslations("Navigation")
    const tFooter = useTranslations("Footer")
    const locale = useLocale()
    const [time, setTime] = useState("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            setTime(new Intl.DateTimeFormat(locale, options).format(now));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [locale]);

    return (
        <footer className="relative w-full bg-[#050505] text-white pt-24 border-t border-white/5 overflow-hidden font-sans">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px]">

                {/* Header: Brand & Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
                    <FadeIn direction="up">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[clamp(40px,6vw,80px)] font-bold tracking-[-0.04em] leading-[0.9] text-white">
                                Palaz Strategy<br />
                                Company
                            </h2>
                        </div>
                    </FadeIn>


                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-white/5 mt-0">
                    
                    {/* Column 01: Navigation */}
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-white/5 pr-0 md:pr-12">
                        <nav className="flex flex-col h-full">
                            <ArpeggioLink href="/">{tNav("inicio")}</ArpeggioLink>
                            <ArpeggioLink href="/cases">{tNav("cases")}</ArpeggioLink>
                            <ArpeggioLink href="/sobre">{tNav("sobre")}</ArpeggioLink>
                            <ArpeggioLink href="/produtos/fatuz">{tNav("produtos")}</ArpeggioLink>
                            <ArpeggioLink href="/contato" noBorder>{tNav("contato")}</ArpeggioLink>
                        </nav>
                    </div>

                    {/* Column 02: Social/Technical */}
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-white/5 px-0 md:px-12">
                        <div className="flex flex-col">
                            <div className="py-5 border-b border-white/5 flex flex-col gap-1">
                                <p className="text-sm text-white/60">{tFooter("email_label")}</p>
                                <Link href="mailto:ola@palaz.com.br" className="flex items-center justify-between group pt-1" target="_blank" rel="noopener noreferrer">
                                    <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#F24B0F] transition-colors">ola@palaz.com.br</span>
                                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#F24B0F] transition-all duration-500" />
                                </Link>
                            </div>
                            <ArpeggioLink href="https://wa.me/553196117847">WhatsApp</ArpeggioLink>
                            <ArpeggioLink href="https://www.instagram.com/palazstrategy/">Instagram</ArpeggioLink>
                            <ArpeggioLink href="https://www.behance.net/palazstrategycompany">Behance</ArpeggioLink>
                        </div>
                    </div>

                    {/* Column 03: Availability */}
                    <div className="md:col-span-1 pl-0 md:pl-12">
                        <div className="flex flex-col">
                            <div className="py-5 border-b border-white/5 flex flex-col gap-1">
                                <p className="text-sm text-white/60">{tFooter("location")}</p>
                                <span className="text-lg font-bold tracking-tight text-white pt-1">{tFooter("city")}</span>
                            </div>
                            <div className="py-5 border-b border-white/5 flex flex-col gap-1">
                                <p className="text-sm text-white/60">{tFooter("local_time")}</p>
                                <span className="text-lg font-bold tracking-tight text-white tabular-nums pt-1">{time}</span>
                            </div>
                            <ArpeggioLink href="/politica-de-privacidade">{tFooter("privacy")}</ArpeggioLink>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/40">
                    <p>{tFooter("rights")}</p>
                    <p>{tFooter("cnpj")}</p>
                </div>
            </div>
        </footer>
    )
}

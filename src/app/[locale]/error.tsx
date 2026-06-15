"use client"

import { useEffect } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations("Error")
    useEffect(() => {
        // Opcionalmente, pode-se registrar o erro em um serviço de relatórios de erros
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
            <h2 className="text-4xl md:text-6xl font-medium tracking-arpeggio mb-6 text-center">
                {t("title")}
            </h2>
            <p className="text-muted-color text-lg mb-8 text-center max-w-lg">
                {t("description")}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
                >
                    {t("retry")}
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
                >
                    {t("home")}
                </Link>
            </div>
        </div>
    )
}

"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error(error)
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-center">
            Erro / Error
          </h2>
          <p className="text-lg mb-8 text-center max-w-lg opacity-60">
            Ocorreu um problema grave / A serious problem occurred
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            Tentar Novamente / Try Again
          </button>
        </div>
      </body>
    </html>
  )
}

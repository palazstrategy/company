import { ReactNode } from "react";
import "@/style.css";
import { EditorClientStyles } from "./EditorClientStyles";

export const metadata = { 
    title: "Editor Local - Palaz",
    icons: {
        icon: '/favicon.svg',
        apple: '/favicon.svg',
    },
};

export default function EditorLayout({ children }: { children: ReactNode }) {
    if (process.env.NODE_ENV !== "development") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-white">
                <h1 className="text-4xl text-[#F24B0F] font-bold mb-4">403 Forbidden</h1>
                <p className="text-white/50 text-lg">O Editor de Cases é um recurso interno (Localhost) apenas.</p>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden flex flex-col bg-[#0A0A0A]">
            <EditorClientStyles />
            <main className="flex-1 w-full mx-auto flex flex-col relative h-full overflow-hidden">
                {children}
            </main>
        </div>
    );
}

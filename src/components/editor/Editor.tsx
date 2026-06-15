import React, { useEffect, useState, useRef } from "react";
import { Plus, Save, Settings, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { BLOCK_TYPES, BLOCK_CONFIGS } from "./BlockRegistry";
import { BlockWrapper } from "./EditorBlocks";
import { SettingsModal } from "./SettingsModal";
import { useRouter } from "next/navigation";
import { ModalDialog } from "../ui/ModalDialog";

export default function Editor({ initialProject, isNew }: { initialProject?: any, isNew?: boolean }) {
    const router = useRouter();
    const [isSettingsOpen, setSettingsOpen] = useState(isNew || false);

    const {
        blocks,
        projectData,
        projectTranslations,
        setInitialData,
        addBlock,
        activeLang,
        setActiveLang,
        isSaving,
        setIsSaving,
        saveMessage,
        setSaveMessage,
        dialog,
        setDialog,
        resetEditor
    } = useEditorStore();

    const [saved, setSaved] = useState(false);


    const prevLength = useRef(blocks.length);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (isInitialLoad.current && blocks.length > 0) {
             isInitialLoad.current = false;
             prevLength.current = blocks.length;
             return; // Don't scroll on initial loading of project blocks
        }

        if (blocks.length > prevLength.current) {
            setTimeout(() => {
                const lastBlock = blocks[blocks.length - 1];
                if (lastBlock) {
                    const el = document.getElementById(`block-${lastBlock.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
        prevLength.current = blocks.length;
    }, [blocks.length, blocks]);

    // Inicialização
    useEffect(() => {
        if (isNew) {
            resetEditor();
        } else if (initialProject) {
            setInitialData(initialProject);
        }
    }, [isNew, initialProject, setInitialData, resetEditor]);

    const handleSave = async () => {
        if (!projectTranslations.pt.title && !projectTranslations.en.title && !projectData.slug) {
            setDialog({
                open: true,
                title: "Conteúdo Insuficiente",
                message: "Por favor, adicione pelo menos um título ou slug antes de salvar.",
                type: 'alert',
                variant: 'danger'
            });
            return;
        }

        const finalSlug = projectData.slug ||
            (projectTranslations.pt?.title || projectTranslations.en?.title || "")
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');

        if (!finalSlug) {
            setDialog({
                open: true,
                title: "Título Necessário",
                message: "O projeto precisa de um título para gerar o endereço (URL).",
                type: 'alert',
                variant: 'warning'
            });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/editor/projects", {
                method: isNew ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: finalSlug,
                    originalSlug: isNew ? null : (initialProject?.slug || projectData.slug),
                    projectData: {
                        ...projectData,
                        slug: finalSlug,
                        contentBlocks: blocks,
                        lastUpdated: new Date().toISOString()
                    },
                    translations: projectTranslations,
                    blocks: blocks
                }),
            });

            if (res.ok) {
                const result = await res.json();
                setSaveMessage({ type: 'success', text: "Projeto salvo com sucesso!" });
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                if (isNew && result.slug) {
                    router.push(`/editor/${result.slug}`);
                }
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Erro ao salvar");
            }
        } catch (error: any) {
            setSaveMessage({ type: 'error', text: error.message || "Erro ao salvar o projeto." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 4000);
        }
    };



    return (
        <div className="flex flex-row-reverse bg-[#0A0A0A] text-white selection:bg-[#F24B0F]/30 font-sans antialiased h-screen overflow-hidden">

            {/* --- SIDEBAR LATERAL --- */}
            <aside className="w-[300px] md:w-[320px] bg-[#0F0F0F] border-l border-white/5 flex flex-col h-full shrink-0 relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="p-6 flex flex-col h-full">

                    {/* Botão Salvar Projeto */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || saved}
                        className={`w-full h-12 ${saved ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-[#F24B0F] hover:bg-[#ff5a1f] shadow-[#F24B0F]/20'} disabled:opacity-80 text-white font-medium rounded-2xl text-[15px] transition-all flex items-center justify-center gap-2 mb-8 shadow-lg`}
                    >
                        {isSaving ? "Salvando..." : saved ? "Salvo ✓" : "Salvar Projeto"}
                    </button>

                    <div className="mb-6">
                        <h3 className="text-[15px] text-white/40 font-medium mb-4">Adicionar Conteúdo</h3>

                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(BLOCK_CONFIGS).map(([type, config]) => (
                                <button
                                    key={type}
                                    onClick={() => addBlock(type, config.template)}
                                    className="flex flex-col items-center justify-center gap-3 aspect-square bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl transition-all group"
                                >
                                    <span className="text-white/20 group-hover:text-white/60 transition-colors">
                                        {config.icon}
                                    </span>
                                    <span className="text-[13px] text-white/40 group-hover:text-white/80 transition-colors">
                                        {config.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-full flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-white/50 hover:text-white rounded-2xl h-12 text-[14px] font-medium transition-all group mb-8"
                    >
                        <Settings size={16} className="text-white/40 group-hover:text-white transition-colors" />
                        Configurações do Projeto
                    </button>

                    <hr className="border-white/5 mt-auto" />

                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-3 text-white/40 hover:text-white text-[15px] transition-colors font-medium pt-3 pb-1 cursor-pointer shrink-0"
                    >
                        <ChevronLeft size={16} />
                        Voltar ao Portfólio
                    </button>

                </div>
            </aside>

            {/* --- MAIN CANVAS CONTENT --- */}
            <main className="flex-1 relative flex flex-col h-full bg-[#050505]">
                <div data-lenis-prevent="true" className="flex-1 overflow-y-auto w-full custom-scrollbar pt-20 pb-40 px-8 scroll-smooth">
                    <div className="max-w-[1200px] mx-auto">
                        {blocks.length === 0 ? (
                            <div className="py-60 flex flex-col items-center justify-center text-white/20 w-full min-h-[600px] bg-[#0F0F0F] rounded-[40px] border border-white/5 border-dashed">
                                <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-8">
                                    <Plus size={32} className="text-[#ffffff]/40" />
                                </div>
                                <p className="text-[15px] font-medium text-white/50 lowercase">canvas do editor</p>
                                <p className="text-[14px] mt-2 text-white/30 lowercase">adicione um bloco usando a barra lateral</p>
                            </div>
                        ) : (
                            <div className="w-full bg-[#0F0F0F] rounded-[40px] border border-white/5 overflow-hidden shadow-[0_20px_100px_-20px_rgba(0,0,0,1)] relative min-h-[600px]">
                                {blocks.map((block: any, index: number) => (
                                    <BlockWrapper
                                        key={block.id}
                                        id={block.id}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
            />

            <ModalDialog
                isOpen={dialog.open}
                onClose={() => setDialog({ open: false })}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                variant={dialog.variant}
            />
        </div>
    );
}

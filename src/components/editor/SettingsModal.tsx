import React, { memo } from "react";
import { Trash2, X, Plus, Save } from "lucide-react";
import { useEditorStore, slugify } from "@/store/editorStore";
import { LocalInput } from "./LocalInputs";

export const SettingsModal = memo(({ 
    isOpen, 
    onClose 
}: { 
    isOpen: boolean, 
    onClose: () => void 
}) => {
    const { 
        projectData, 
        projectTranslations, 
        activeLang, 
        setActiveLang,
        updateProjectData,
        updateProjectTranslation,
        setIsSaving,
        ensureSlug
    } = useEditorStore();

    if (!isOpen) return null;

    const hasTitle = !!projectData.slug || !!projectTranslations.pt?.title || !!projectTranslations.en?.title;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const slug = ensureSlug();
        if (!slug) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("files", file);
            formData.append("slug", slug);
            const res = await fetch("/api/editor/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                updateProjectData({ imageSrc: data.urls[0] });
            }
        } catch (error) {
            console.error("Erro no upload da capa:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#1A1A1A]">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F24B0F]"></div>
                        <h2 className="text-[15px] font-medium text-white/90 lowercase">configurações do projeto</h2>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div data-lenis-prevent className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Abas */}
                    <div className="flex gap-8 mb-10 border-b border-white/5">
                        <button onClick={() => setActiveLang("pt")} className={`pb-4 font-medium text-[15px] transition-all border-b-2 ${activeLang === "pt" ? "border-[#F24B0F] text-white" : "border-transparent text-white/40 hover:text-white"} lowercase`}>português</button>
                        <button onClick={() => setActiveLang("en")} className={`pb-4 font-medium text-[15px] transition-all border-b-2 ${activeLang === "en" ? "border-[#F24B0F] text-white" : "border-transparent text-white/40 hover:text-white"} lowercase`}>english</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Textos */}
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">título do case</label>
                                <LocalInput 
                                    value={projectTranslations[activeLang]?.title || ""} 
                                    onChange={(val: string) => updateProjectTranslation(activeLang, "title", val)} 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all placeholder-white/15" 
                                    placeholder="Ex: Projeto Brand" 
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">descrição principal</label>
                                <LocalInput 
                                    type="textarea" 
                                    value={projectTranslations[activeLang]?.description || ""} 
                                    onChange={(val: string) => updateProjectTranslation(activeLang, "description", val)} 
                                    className="w-full min-h-[160px] bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all resize-y custom-scrollbar placeholder-white/15" 
                                    placeholder="Texto de introdução ao case..." 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">cliente</label>
                                    <LocalInput value={projectTranslations[activeLang]?.client || ""} onChange={(val: string) => updateProjectTranslation(activeLang, "client", val)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">categoria</label>
                                    <LocalInput value={projectTranslations[activeLang]?.category || ""} onChange={(val: string) => updateProjectTranslation(activeLang, "category", val)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all font-medium" placeholder="Ex: Identity" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">papel / serviço</label>
                                <LocalInput 
                                    value={projectTranslations[activeLang]?.role || ""} 
                                    onChange={(val: string) => updateProjectTranslation(activeLang, "role", val)} 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all font-medium" 
                                    placeholder="Ex: Art Direction" 
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-medium text-white/70 mb-3 lowercase">palavras-chave seo (separadas por vírgula)</label>
                                <LocalInput 
                                    type="textarea" 
                                    value={projectTranslations[activeLang]?.keywords || ""} 
                                    onChange={(val: string) => updateProjectTranslation(activeLang, "keywords", val)} 
                                    className="w-full min-h-[80px] bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white focus:bg-black focus:border-[#F24B0F] outline-none transition-all resize-y custom-scrollbar font-medium placeholder-white/40" 
                                    placeholder="Ex: cosméticos, logo, produtos, branding" 
                                />
                            </div>
                        </div>

                        {/* Mídia e Extras */}
                        <div className="space-y-8">
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <label className="block text-[15px] font-medium text-white/50 mb-4 lowercase">imagem de capa (thumb)</label>
                                {projectData.imageSrc ? (
                                    <div className="relative group/cover aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                                        <img src={projectData.imageSrc} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const oldPath = projectData.imageSrc;
                                                updateProjectData({ imageSrc: "" });
                                                if (oldPath) useEditorStore.getState().deleteMedia(oldPath);
                                            }}
                                            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover/cover:opacity-100 transition-all hover:scale-110 shadow-xl"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : !hasTitle ? (
                                    <div className="w-full aspect-video bg-black/60 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 grayscale opacity-80 cursor-not-allowed">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                                            <Plus size={24} />
                                        </div>
                                        <span className="text-[14px] text-white/40 lowercase">adicione o título do case</span>
                                        <span className="text-[12px] text-white/30 lowercase mt-1">para habilitar upload de imagens</span>
                                    </div>
                                ) : (
                                    <label className="w-full aspect-video bg-black/60 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#F24B0F] hover:bg-[#F24B0F]/5 transition-all group/up">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/up:bg-[#F24B0F]/20 transition-colors text-white/20 group-hover/up:text-[#F24B0F]">
                                            <Plus size={24} />
                                        </div>
                                        <span className="text-[14px] text-white/40 group-hover/up:text-white lowercase">upload capa (808x632)</span>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "cover")} className="hidden" />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">ano</label>
                                    <LocalInput value={projectData.year || ""} onChange={(val: string) => updateProjectData({ year: val })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] text-white/90 focus:bg-black focus:border-[#F24B0F] outline-none transition-all font-medium" />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button 
                                        onClick={() => updateProjectData({ showOnHome: !projectData.showOnHome })}
                                        className={`flex items-center justify-between px-5 p-4 rounded-xl border transition-all ${projectData.showOnHome ? 'bg-black/40 border-white/20 text-white' : 'bg-black/40 border-white/5 text-white/20 hover:bg-black/60'}`}
                                    >
                                        <span className={`text-[14px] lowercase transition-colors ${projectData.showOnHome ? 'text-white/70' : 'text-white/20'}`}>exibir na home</span>
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${projectData.showOnHome ? 'bg-[#F24B0F]' : 'bg-white/10'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${projectData.showOnHome ? 'right-0.5' : 'left-0.5'}`} />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[15px] font-medium text-white/50 mb-3 lowercase">slug da url</label>
                                <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white/40 font-mono text-[14px] flex items-center gap-2 focus-within:border-[#F24B0F]/50 transition-all group">
                                    <span className="opacity-40 shrink-0 select-none">palaz.com.br/cases/</span>
                                    <input 
                                        type="text"
                                        value={projectData.slug || ""}
                                        onChange={(e) => updateProjectData({ slug: slugify(e.target.value) })}
                                        className="bg-transparent border-none outline-none text-[#F24B0F] w-full lowercase placeholder:text-[#F24B0F]/20"
                                        placeholder={slugify(projectTranslations.pt?.title || projectTranslations.en?.title || "gerado-auto")}
                                    />
                                </div>
                                <p className="mt-2 text-[12px] text-white/20 lowercase">o slug é gerado automaticamente do título, mas você pode editá-lo para remover acentos ou personalizar.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-[#1A1A1A] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-[#F24B0F] hover:bg-[#ff5a1f] text-white px-8 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 text-[14px] lowercase"
                    >
                        concluir e voltar
                    </button>
                </div>
            </div>
        </div>
    );
});

SettingsModal.displayName = "SettingsModal";

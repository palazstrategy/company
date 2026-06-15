import React, { memo } from "react";
import { 
    Trash2, 
    ArrowUp, 
    ArrowDown, 
    Plus,
    Save
} from "lucide-react";
import { useEditorStore, EditorState } from "@/store/editorStore";
import { BLOCK_CONFIGS } from "./BlockRegistry";
import { LocalInput } from "./LocalInputs";

// --- UTILS ---
const getBlockValue = (block: any, field: string, lang: string) => {
    const translated = block.translations?.[lang]?.[field];
    if (translated !== undefined && translated !== null) return translated;
    // Legacy migration: if no translations exist at all, show block[field] only for PT
    if (!block.translations && lang === 'pt') return block[field] || '';
    return '';
};

// --- BLOCOS INDIVIDUAIS ---

export const ImageBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const updateBlock = useEditorStore((state: EditorState) => state.updateBlock);
    const projectSlug = useEditorStore((state: EditorState) => state.projectData.slug);
    const ensureSlug = useEditorStore((state: EditorState) => state.ensureSlug);
    const hasTitle = useEditorStore((state: EditorState) => !!state.projectData.slug || !!state.projectTranslations.pt?.title || !!state.projectTranslations.en?.title);

    if (!block) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const slug = ensureSlug();
        if (!slug) return;

        const formData = new FormData();
        Array.from(files).forEach(file => formData.append("files", file));
        formData.append("slug", slug);
        
        const res = await fetch("/api/editor/upload", { method: "POST", body: formData });
        if (res.ok) {
            const data = await res.json();
            const urls = data.urls;
            
            if (urls.length > 0) {
                // Atualiza o bloco atual com a primeira imagem
                if (block.content) {
                    useEditorStore.getState().deleteMedia(block.content);
                }
                updateBlock(id, { content: urls[0] });

                // Se houver mais imagens, adiciona novos blocos após o atual
                if (urls.length > 1) {
                    const currentBlocks = useEditorStore.getState().blocks;
                    const currentIndex = currentBlocks.findIndex(b => b.id === id);
                    
                    const newBlocks = urls.slice(1).map((url: string) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'image',
                        content: url
                    }));

                    const updatedBlocks = [...currentBlocks];
                    updatedBlocks.splice(currentIndex + 1, 0, ...newBlocks);
                    useEditorStore.getState().setBlocks(updatedBlocks);
                }
            }
        }
    };

    return (
        <div className="w-full flex justify-center">
            {block.content ? (
                <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black/20 max-w-6xl w-full flex items-center justify-center border border-white/5 group/img">
                    <img 
                        src={block.content} 
                        className="w-full h-auto object-contain" 
                        alt="Conteúdo do Bloco" 
                    />
                    <label className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full text-[14px] text-white/60 hover:text-white cursor-pointer opacity-0 group-hover/img:opacity-100 transition-all lowercase hover:scale-105 shadow-xl">
                        trocar imagem
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            ) : !hasTitle ? (
                <div className="max-w-6xl w-full aspect-video bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center grayscale opacity-80 cursor-not-allowed">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                        <Plus size={28} />
                    </div>
                    <span className="text-[14px] text-white/40 lowercase">adicione um título primeiro para enviar</span>
                </div>
            ) : (
                <label className="max-w-6xl w-full aspect-video bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#F24B0F] hover:bg-[#F24B0F]/5 transition-all group/up">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/up:bg-[#F24B0F]/20 transition-colors">
                        <Plus size={28} className="text-white/20 group-hover/up:text-[#F24B0F]" />
                    </div>
                    <span className="text-[14px] text-white/40 group-hover/up:text-white lowercase">clique para enviar uma imagem</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                </label>
            )}
        </div>
    );

});

export const VideoBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const updateBlock = useEditorStore((state: EditorState) => state.updateBlock);
    const projectSlug = useEditorStore((state: EditorState) => state.projectData.slug);
    const ensureSlug = useEditorStore((state: EditorState) => state.ensureSlug);
    const hasTitle = useEditorStore((state: EditorState) => !!state.projectData.slug || !!state.projectTranslations.pt?.title || !!state.projectTranslations.en?.title);

    if (!block) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const slug = ensureSlug();
        if (!slug) return;

        const formData = new FormData();
        formData.append("files", file);
        formData.append("slug", slug);
        const res = await fetch("/api/editor/upload", { method: "POST", body: formData });
        if (res.ok) {
            const data = await res.json();
            if (block.content) {
                useEditorStore.getState().deleteMedia(block.content);
            }
            updateBlock(id, { content: data.urls[0] });
        }
    };

    return (
        <div className="w-full flex justify-center">
            {block.content ? (
                <div className="relative max-w-6xl w-full group/vid">
                    <video src={block.content} className="w-full h-auto rounded-lg shadow-2xl border border-white/5" controls muted autoPlay loop playsInline />
                    <label className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full text-[14px] text-white/60 hover:text-white cursor-pointer opacity-0 group-hover/vid:opacity-100 transition-all lowercase hover:scale-105 shadow-xl">
                        trocar vídeo
                        <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            ) : !hasTitle ? (
                <div className="max-w-6xl w-full aspect-video bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center grayscale opacity-80 cursor-not-allowed">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                        <Plus size={28} />
                    </div>
                    <span className="text-[14px] text-white/40 lowercase">adicione um título primeiro para enviar</span>
                </div>
            ) : (
                <label className="max-w-6xl w-full aspect-video bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#F24B0F] hover:bg-[#F24B0F]/5 transition-all group/up">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/up:bg-[#F24B0F]/20 transition-colors">
                        <Plus size={28} className="text-white/20 group-hover/up:text-[#F24B0F]" />
                    </div>
                    <span className="text-[14px] text-white/40 group-hover/up:text-white lowercase">clique para enviar um vídeo</span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
                </label>
            )}

        </div>
    );
});

export const TextBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const activeLang = useEditorStore((state: EditorState) => state.activeLang);
    const updateBlockTranslation = useEditorStore((state: EditorState) => state.updateBlockTranslation);

    if (!block) return null;

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 items-start max-w-5xl mx-auto">
            <div className="w-full md:w-1/3">
                <div className="text-[15px] font-medium text-white/40 mb-3 lowercase">título do bloco ({activeLang})</div>
                <LocalInput 
                    value={getBlockValue(block, 'title', activeLang)} 
                    onChange={(val: string) => updateBlockTranslation(id, activeLang, 'title', val)}
                    className="w-full bg-black/40 text-white text-xl md:text-2xl font-medium outline-none border border-transparent hover:border-white/10 focus:border-[#F24B0F] p-4 rounded-xl transition-all placeholder-white/5"
                    placeholder="Título opcional..."
                />
            </div>
            <div className="w-full md:w-2/3 relative">
                <div className="text-[15px] font-medium text-white/40 mb-3 lowercase">conteúdo ({activeLang})</div>
                <LocalInput 
                    type="textarea"
                    value={getBlockValue(block, 'content', activeLang)} 
                    onChange={(val: string) => updateBlockTranslation(id, activeLang, 'content', val)}
                    className="w-full min-h-[180px] bg-black/40 text-white/80 text-[14px] leading-relaxed outline-none border border-transparent hover:border-white/10 focus:border-[#F24B0F] resize-y focus:bg-black p-4 rounded-xl transition-all placeholder-white/15 custom-scrollbar"
                    placeholder="Comece a digitar o conteúdo livremente..."
                />
            </div>
        </div>
    );

});

// Layout options moved outside to avoid recreation on every render
const GRID_LAYOUT_OPTIONS = [
    { id: 'cols-2', label: '2 Colunas', icon: <div className="grid grid-cols-2 gap-[2px] w-full h-full"><div className="bg-current rounded-[2px] h-full"></div><div className="bg-current rounded-[2px] h-full"></div></div> },
    { id: 'cols-3', label: '3 Colunas', icon: <div className="grid grid-cols-3 gap-[2px] w-full h-full"><div className="bg-current rounded-[1px] h-full"></div><div className="bg-current rounded-[1px] h-full"></div><div className="bg-current rounded-[1px] h-full"></div></div> },
    { id: 'mosaic-1-2', label: 'Destaque Esq.', icon: <div className="grid grid-cols-2 grid-rows-2 gap-[2px] w-full h-full"><div className="bg-current rounded-[1px] col-span-1 row-span-2"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div></div> },
    { id: 'mosaic-2-1', label: 'Destaque Dir.', icon: <div className="grid grid-cols-2 grid-rows-2 gap-[2px] w-full h-full"><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px] col-start-2 row-start-1 row-span-2"></div><div className="bg-current rounded-[1px]"></div></div> },
];

const getMaxImages = (layout: string) => {
    if (layout === 'cols-2') return 2;
    if (layout === 'cols-3') return 3;
    if (layout === 'mosaic-1-2' || layout === 'mosaic-2-1') return 3;
    return 99;
};

export const PhotoGridBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const updateBlock = useEditorStore((state: EditorState) => state.updateBlock);
    const projectSlug = useEditorStore((state: EditorState) => state.projectData.slug);
    const isSaved = !!useEditorStore((state: EditorState) => state.projectData.lastUpdated);
    const hasTitle = useEditorStore((state: EditorState) => !!state.projectData.slug || !!state.projectTranslations.pt?.title || !!state.projectTranslations.en?.title);
    const ensureSlug = useEditorStore((state: EditorState) => state.ensureSlug);

    if (!block) return null;

    const updatePhotoGrid = (newImages: string[], layoutId?: string) => {
        updateBlock(id, { images: newImages, ...(layoutId ? { layout: layoutId } : {}) });
    };

    const currentLayout = block.layout || (block.columns ? `cols-${block.columns}` : 'cols-2');

    return (
        <div className="w-full space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-3">
                <div className="text-[15px] font-medium text-white/40 lowercase">configuração da grade</div>

                <div className="flex flex-wrap items-center gap-2">
                    {GRID_LAYOUT_OPTIONS.map(opt => {
                        const active = currentLayout === opt.id;
                        return (
                            <button 
                                key={opt.id}
                                onClick={() => updatePhotoGrid(block.images || [], opt.id)}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all ${
                                    active ? 'bg-[#F24B0F]/10 border-[#F24B0F] text-[#F24B0F]' : 'bg-black/40 border-white/10 hover:border-white/20 text-white/40 hover:text-white/80'
                                }`}
                            >
                                <div className="w-5 h-5 flex shrink-0 opacity-80">{opt.icon}</div>
                                <span className="text-[14px] font-medium">{opt.label}</span>
                            </button>

                        );
                    })}
                </div>
            </div>

            {(() => {

                const maxAllowed = getMaxImages(currentLayout);
                const currentCount = block.images?.length || 0;
                const canAddMore = currentCount < maxAllowed;

                let gridClass = "grid gap-4 md:gap-6 w-full";
                if (currentLayout === 'cols-2') gridClass += " grid-cols-1 md:grid-cols-2";
                else if (currentLayout === 'cols-3') gridClass += " grid-cols-1 md:grid-cols-3";
                else if (currentLayout === 'mosaic-1-2' || currentLayout === 'mosaic-2-1') {
                    gridClass += " grid-cols-1 md:grid-cols-2 md:grid-rows-2 h-auto md:h-[600px]";
                }

                return (
                    <div className="flex flex-col gap-6 w-full">
                        {block.images && block.images.length > 0 && (
                            <div className={gridClass}>
                                {(block.images || []).map((img: string, j: number) => {
                                    let itemClass = "relative group/photo bg-white/5 rounded-2xl border border-white/5 overflow-hidden shadow-lg";
                                    
                                    if (currentLayout === 'cols-2' || currentLayout === 'cols-3') {
                                        itemClass += " aspect-square";
                                    } else if (currentLayout === 'mosaic-1-2') {
                                        if (j === 0) itemClass += " md:col-start-1 md:row-start-1 md:row-span-2 h-[400px] md:h-full";
                                        else if (j === 1) itemClass += " md:col-start-2 md:row-start-1 aspect-square md:aspect-auto md:h-full";
                                        else if (j === 2) itemClass += " md:col-start-2 md:row-start-2 aspect-square md:aspect-auto md:h-full";
                                        else itemClass += " aspect-square"; 
                                    } else if (currentLayout === 'mosaic-2-1') {
                                        if (j === 0) itemClass += " md:col-start-1 md:row-start-1 aspect-square md:aspect-auto md:h-full";
                                        else if (j === 1) itemClass += " md:col-start-1 md:row-start-2 aspect-square md:aspect-auto md:h-full";
                                        else if (j === 2) itemClass += " md:col-start-2 md:row-start-1 md:row-span-2 h-[400px] md:h-full";
                                        else itemClass += " aspect-square";
                                    }

                                    return (
                                        <div key={j} className={itemClass}>
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                onClick={async () => {
                                                    const imgPath = img;
                                                    const newImages = [...(block.images || [])];
                                                    newImages.splice(j, 1);
                                                    updatePhotoGrid(newImages, currentLayout);
                                                    if (imgPath) useEditorStore.getState().deleteMedia(imgPath);
                                                }}
                                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover/photo:opacity-100 transition-all z-10 hover:scale-110 shadow-xl"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {canAddMore && (
                            !hasTitle ? (
                                <div className="w-full h-32 md:h-40 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center grayscale opacity-80 cursor-not-allowed">
                                    <Plus size={32} className="text-white/10 mb-3" />
                                    <span className="text-[14px] text-white/40 lowercase text-center px-4">adicione um título primeiro</span>
                                </div>
                            ) : (
                                <label className="w-full h-32 md:h-40 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#F24B0F] hover:bg-[#F24B0F]/5 transition-all group/add">
                                    <Plus size={32} className="text-white/10 group-hover/add:text-[#F24B0F] transition-transform group-hover/add:scale-110 duration-300 mb-2" />
                                    <span className="text-[14px] text-white/40 lowercase group-hover/add:text-white">
                                        {block.images && block.images.length > 0 ? "adicionar mais fotos" : "adicionar fotos"}
                                    </span>

                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={async (e) => {
                                            const files = e.target.files;
                                            if (!files) return;

                                            const availableSlots = maxAllowed - currentCount;
                                            if (availableSlots <= 0) return;

                                            const slug = ensureSlug();
                                            if (!slug) return;

                                            const arrayFiles = Array.from(files).slice(0, availableSlots);
                                            const formData = new FormData();
                                            arrayFiles.forEach(f => formData.append("files", f));
                                            formData.append("slug", slug);

                                            const res = await fetch("/api/editor/upload", { method: "POST", body: formData });
                                            if (res.ok) {
                                                const data = await res.json();
                                                updatePhotoGrid([...(block.images || []), ...data.urls]);
                                            }
                                        }} 
                                    />
                                </label>
                            )
                        )}
                    </div>
                );
            })()}
        </div>
    );
});

export const CompareBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const updateBlock = useEditorStore((state: EditorState) => state.updateBlock);
    const projectSlug = useEditorStore((state: EditorState) => state.projectData.slug);
    const ensureSlug = useEditorStore((state: EditorState) => state.ensureSlug);
    const hasTitle = useEditorStore((state: EditorState) => !!state.projectData.slug || !!state.projectTranslations.pt?.title || !!state.projectTranslations.en?.title);

    if (!block) return null;

    return (
        <div className="w-full space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <select 
                    value={block.layout || 'horizontal'} 
                    onChange={(e) => updateBlock(id, { layout: e.target.value })}
                    className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#F24B0F]"
                >
                    <option value="horizontal">Lado a Lado</option>
                    <option value="vertical">Acima/Abaixo</option>
                </select>
                <div className="text-[15px] font-medium text-white/40 lowercase">modo de comparação</div>
            </div>


            <div className={`grid ${block.layout === 'vertical' ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-6'}`}>
                {[0, 1].map(idx => (
                    <div key={idx} className="relative aspect-video bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group/comp shadow-xl">
                        {block.images?.[idx] ? (
                            <>
                                <img src={block.images[idx]} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded text-[10px] border border-white/5 text-white opacity-40 group-hover/comp:opacity-100 transition-opacity lowercase">
                                    {idx === 0 ? "antes" : "depois"}
                                </div>
                                <button 
                                    onClick={async () => {
                                        const imgPath = block.images?.[idx];
                                        const next = [...(block.images || [])];
                                        next[idx] = '';
                                        updateBlock(id, { images: next });
                                        if (imgPath) useEditorStore.getState().deleteMedia(imgPath);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover/comp:opacity-100 transition-all hover:scale-110 shadow-lg"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </>
                        ) : !hasTitle ? (
                            <div className="w-full h-full flex flex-col items-center justify-center grayscale opacity-80 cursor-not-allowed">
                                <Plus size={24} className="text-white/10 mb-3" />
                                <span className="text-[14px] text-white/40 lowercase text-center px-4">adicione um título primeiro</span>
                            </div>
                        ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group/plus">
                                <Plus size={24} className="text-white/10 group-hover/plus:text-[#F24B0F] transition-colors" />
                                <span className="text-[14px] text-white/40 mt-3 lowercase">upload {idx === 0 ? "antes" : "depois"}</span>

                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const slug = ensureSlug();
                                        if (!slug) return;

                                        const formData = new FormData();
                                        formData.append("files", file);
                                        formData.append("slug", slug);
                                        const res = await fetch("/api/editor/upload", { method: "POST", body: formData });
                                        if (res.ok) {
                                            const data = await res.json();
                                            const next = [...(block.images || [])];
                                            next[idx] = data.urls[0];
                                            updateBlock(id, { images: next });
                                        }
                                    }}
                                />
                            </label>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

export const EmbedBlock = memo(({ id }: { id: string }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const updateBlock = useEditorStore((state: EditorState) => state.updateBlock);

    if (!block) return null;

    const getEmbedContent = (code: string) => {
        if (!code) return '';
        if (code.includes('<iframe')) return code;

        let url = code.trim();
        if (url.includes('youtube.com/watch?v=')) {
            const id = url.split('v=')[1]?.split('&')[0];
            url = `https://www.youtube.com/embed/${id}`;
        } else if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            url = `https://www.youtube.com/embed/${id}`;
        } else if (url.includes('vimeo.com/')) {
            const id = url.split('vimeo.com/')[1]?.split('?')[0];
            url = `https://player.vimeo.com/video/${id}`;
        }
        return `<iframe src="${url}" allowfullscreen></iframe>`;
    };

    return (
        <div className="w-full space-y-6 max-w-5xl mx-auto">
            <div className="text-[15px] font-medium text-white/40 mb-2 lowercase">conteúdo externo integra / url</div>

            <LocalInput 
                type="textarea"
                value={block.embedCode || ''} 
                onChange={(val: string) => updateBlock(id, { embedCode: val })}
                className="w-full min-h-[120px] bg-black/60 text-emerald-400 font-mono text-sm p-5 rounded-2xl border border-white/5 focus:border-emerald-500/30 outline-none transition-all custom-scrollbar shadow-inner"
                placeholder='Cole o <iframe> aqui ou apenas a URL do vídeo/spline...'
            />
            {block.embedCode && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 pointer-events-none relative group/embed shadow-2xl">
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover/embed:opacity-100 transition-opacity">
                        <span className="bg-emerald-500 text-black text-[10px] px-4 py-1.5 rounded-full lowercase shadow-lg">visualização ativa</span>
                    </div>
                    <div 
                        className="w-full h-full relative [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                        dangerouslySetInnerHTML={{ __html: getEmbedContent(block.embedCode) }}
                    />
                </div>
            )}
        </div>
    );
});

// --- WRAPPER INTELIGENTE ---

export const BlockWrapper = memo(({ id, index }: { id: string, index: number }) => {
    const block = useEditorStore((state: EditorState) => state.blocks.find(b => b.id === id));
    const activeLang = useEditorStore((state: EditorState) => state.activeLang);
    const { setActiveLang, removeBlock, moveBlock } = useEditorStore();

    if (!block) return null;

    const config = BLOCK_CONFIGS[block.type] || { label: block.type, icon: null };

    const renderContent = () => {
        switch (block.type) {
            case 'text': return <TextBlock id={id} />;
            case 'image': return <ImageBlock id={id} />;
            case 'video': return <VideoBlock id={id} />;
            case 'grid': return <PhotoGridBlock id={id} />;
            case 'compare': return <CompareBlock id={id} />;
            case 'embed': return <EmbedBlock id={id} />;
            default: return <div className="text-white/20 text-center">Bloco do tipo "{block.type}" não implementado</div>;
        }
    };

    return (
        <div id={`block-${id}`} className="relative group w-full flex flex-col bg-[#0F0F0F] border-b border-white/5 last:border-0 hover:bg-[#111111] transition-colors pt-6 pb-12 px-6 md:px-12 min-h-[150px]">
            {/* Header do Bloco */}
            <div className="flex items-center justify-between mb-8">
                {/* Badge de Tipo */}
                <div className="flex bg-white/5 px-3 py-1.5 rounded-full border border-white/10 items-center gap-2 text-[13px] font-medium text-white/40 lowercase">
                    <span className="opacity-40">{config.icon}</span>
                    {config.label}
                </div>

                {/* Controles */}
                <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-all duration-300">
                    {block.type === 'text' && (
                        <div className="flex bg-[#0F0F0F] rounded-full p-1 shadow-2xl items-center border border-white/5">
                            <button 
                                onClick={() => setActiveLang("pt")} 
                                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${activeLang === 'pt' ? 'bg-[#2A2A2A] text-white' : 'text-[#7A7A7A] hover:text-[#A0A0A0]'}`}
                            >
                                BR
                            </button>
                            <button 
                                onClick={() => setActiveLang("en")} 
                                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${activeLang === 'en' ? 'bg-[#2A2A2A] text-white' : 'text-[#7A7A7A] hover:text-[#A0A0A0]'}`}
                            >
                                EN
                            </button>
                        </div>
                    )}

                    <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10 shadow-2xl backdrop-blur-xl">
                        <button onClick={() => moveBlock(id, 'up')} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <ArrowUp size={14} />
                        </button>
                        <button onClick={() => moveBlock(id, 'down')} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <ArrowDown size={14} />
                        </button>
                    </div>

                    <button 
                        onClick={() => {
                            useEditorStore.getState().setDialog({
                                open: true,
                                title: "Remover Bloco?",
                                message: `Deseja realmente excluir este bloco de ${config.label}? Esta ação não pode ser desfeita.`,
                                type: 'confirm',
                                variant: 'danger',
                                onConfirm: async () => {
                                    if (block.type === 'image' && block.content) {
                                        useEditorStore.getState().deleteMedia(block.content);
                                    } else if (block.type === 'video' && block.content) {
                                        useEditorStore.getState().deleteMedia(block.content);
                                    } else if (block.type === 'grid' && block.images) {
                                        block.images.forEach((img: any) => useEditorStore.getState().deleteMedia(img));
                                    } else if (block.type === 'compare' && block.images) {
                                        block.images.forEach((img: any) => img && useEditorStore.getState().deleteMedia(img));
                                    }
                                    removeBlock(id);
                                }
                            });
                        }}
                        className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Conteúdo do Bloco */}
            <div className="relative">
                {renderContent()}
            </div>
        </div>
    );
});

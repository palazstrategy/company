import { create } from 'zustand';

export interface Block {
    id: string;
    type: string;
    [key: string]: any;
    translations?: {
        pt?: Record<string, any>;
        en?: Record<string, any>;
    };
}

export interface EditorState {
    blocks: Block[];
    projectData: {
        id?: string;
        slug?: string;
        imageSrc?: string;
        year?: string;
        showOnHome?: boolean;
        role?: string;
        keywords?: string;
        lastUpdated?: string;
    };
    projectTranslations: {
        pt: Record<string, any>;
        en: Record<string, any>;
    };
    activeLang: 'pt' | 'en';
    isSaving: boolean;
    saveMessage: { type: 'success' | 'error', text: string } | null;
    dialog: { 
        open: boolean; 
        title: string; 
        message: string; 
        type: 'confirm' | 'alert'; 
        variant: 'danger' | 'warning' | 'info';
        onConfirm?: () => void;
    };
    
    // Actions
    resetEditor: () => void;
    setInitialData: (project: any) => void;
    setBlocks: (blocks: Block[]) => void;
    setActiveLang: (lang: 'pt' | 'en') => void;
    updateProjectData: (updates: Partial<EditorState['projectData']>) => void;
    updateProjectTranslation: (lang: 'pt' | 'en', field: string, value: any) => void;
    ensureSlug: () => string | null;
    updateBlock: (id: string, updates: Partial<Block> | ((prev: Block) => Block)) => void;
    addBlock: (type: string, template: Partial<Block>) => void;
    removeBlock: (id: string) => void;
    moveBlock: (id: string, direction: 'up' | 'down') => void;
    updateBlockTranslation: (id: string, lang: 'pt' | 'en', field: string, value: any) => void;
    deleteMedia: (path: string) => Promise<void>;
    setIsSaving: (isSaving: boolean) => void;
    setSaveMessage: (message: { type: 'success' | 'error', text: string } | null) => void;
    setDialog: (dialog: Partial<EditorState['dialog']>) => void;
}

export const slugify = (text: string) => {
    return text
        .toString()
        .normalize('NFD') // separa acentos das letras
        .replace(/[\u0300-\u036f]/g, '') // remove os acentos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // substitui espaços por -
        .replace(/[^\w-]+/g, '') // remove caracteres não-word
        .replace(/--+/g, '-'); // remove hifens duplos
};

export const useEditorStore = create<EditorState>()((set) => ({
    blocks: [],
    projectData: {
        showOnHome: false,
        year: new Date().getFullYear().toString(),
    },
    projectTranslations: {
        pt: {},
        en: {}
    },
    activeLang: 'pt',
    isSaving: false,
    saveMessage: null,
    dialog: {
        open: false,
        title: '',
        message: '',
        type: 'alert',
        variant: 'info'
    },

    resetEditor: () => set({
        blocks: [],
        projectData: {
            showOnHome: false,
            year: new Date().getFullYear().toString(),
        },
        projectTranslations: {
            pt: { title: '', description: '', client: '', category: '', role: '', keywords: '' },
            en: { title: '', description: '', client: '', category: '', role: '', keywords: '' }
        },
        activeLang: 'pt'
    }),

    setInitialData: (data) => {
        // A API retorna { projectData: {...}, translations: {...} }
        const project = data.projectData || data;
        const blocks = (project.blocks || project.contentBlocks || []).map((b: any) => ({
            id: b.id || Math.random().toString(36).substr(2, 9),
            ...b
        }));
        
        const defaultTrans = { title: '', description: '', client: '', category: '', role: '', keywords: '' };
        const ptTrans = { ...defaultTrans, ...(data.translations?.pt || {}) };
        const enTrans = { ...defaultTrans, ...(data.translations?.en || {}) };

        set({
            blocks,
            projectData: {
                id: project.id, // Keep existing ID
                slug: project.slug || '',
                imageSrc: project.imageSrc || '',
                year: project.year || new Date().getFullYear().toString(),
                showOnHome: !!project.showOnHome,
                role: project.role, // Keep existing role
                keywords: project.keywords, // Keep existing keywords
                lastUpdated: project.lastUpdated // Keep existing lastUpdated
            },
            projectTranslations: {
                pt: ptTrans,
                en: enTrans
            }
        });
    },

    setBlocks: (blocks) => set({ blocks }),
    
    setActiveLang: (activeLang) => set({ activeLang }),
    
    updateProjectData: (updates) => set((state) => ({
        projectData: { ...state.projectData, ...updates }
    })),

    updateProjectTranslation: (lang, field, value) => set((state) => {
        const newTranslations = {
            ...state.projectTranslations,
            [lang]: {
                ...state.projectTranslations[lang],
                [field]: value
            }
        };
        
        // Sincroniza com a raiz do projeto se for PT (comportamento herdado da V1)
        const projectUpdates: any = {};
        if (lang === 'pt') {
            projectUpdates[field] = value;
        }

        return {
            projectTranslations: newTranslations,
            projectData: { ...state.projectData, ...projectUpdates }
        };
    }),

    ensureSlug: (): string | null => {
        const state = useEditorStore.getState();
        if (state.projectData.slug) return state.projectData.slug;
        const title = state.projectTranslations.pt?.title || state.projectTranslations.en?.title || "";
        if (!title) return null;
        const generated = slugify(title);
        set((s) => ({ projectData: { ...s.projectData, slug: generated } }));
        return generated;
    },

    deleteMedia: async (fileUrl) => {
        try {
            await fetch("/api/editor/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileUrl }),
            });
        } catch (error) {
            console.error("Erro ao deletar mídia:", error);
        }
    },

    setIsSaving: (isSaving) => set({ isSaving }),

    setSaveMessage: (saveMessage) => set({ saveMessage }),

    setDialog: (dialogUpdates) => set((state) => ({
        dialog: { ...state.dialog, ...dialogUpdates }
    })),

    updateBlock: (id, updates) => set((state) => ({
        blocks: state.blocks.map((block) => {
            if (block.id !== id) return block;
            if (typeof updates === 'function') return updates(block);
            return { ...block, ...updates };
        })
    })),

    addBlock: (type, template) => set((state) => ({
        blocks: [...state.blocks, { 
            id: Math.random().toString(36).substr(2, 9), 
            type, 
            ...JSON.parse(JSON.stringify(template))
        } as Block]
    })),

    removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id)
    })),

    moveBlock: (id, direction) => set((state) => {
        const index = state.blocks.findIndex(b => b.id === id);
        if (index === -1) return state;
        
        const newBlocks = [...state.blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        
        return { blocks: newBlocks };
    }),

    updateBlockTranslation: (id, lang, field, value) => set((state) => ({
        blocks: state.blocks.map((block) => {
            if (block.id !== id) return block;
            return {
                ...block,
                translations: {
                    ...(block.translations || {}),
                    [lang]: {
                        ...(block.translations?.[lang] || {}),
                        [field]: value
                    }
                },
                // Se for PT, atualiza também a raiz para compatibilidade legada
                ...(lang === 'pt' ? { [field]: value } : {})
            };
        })
    })),
}));

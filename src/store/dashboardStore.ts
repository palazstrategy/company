import { create } from 'zustand';

interface DashboardProject {
    slug: string;
    title?: string;
    imageSrc?: string;
    year?: string;
    category?: string;
    showOnHome?: boolean;
    casesPageOrder?: number;
    lastUpdated?: string;
    contentBlocks?: unknown[];
    role?: string;
    keywords?: string;
}

interface DashboardState {
    projects: DashboardProject[];
    loading: boolean;
    isSaving: boolean;
    tempHomeList: DashboardProject[];
    tempCasesList: DashboardProject[];
    
    // Actions
    fetchProjects: () => Promise<void>;
    deleteProject: (slug: string) => Promise<boolean>;
    setTempLists: (projects: DashboardProject[]) => void;
    moveItem: (tab: 'home' | 'cases', index: number, direction: 'up' | 'down') => void;
    saveOrder: (tab: 'home' | 'cases') => Promise<boolean>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    projects: [],
    loading: true,
    isSaving: false,
    tempHomeList: [],
    tempCasesList: [],

    fetchProjects: async () => {
        set({ loading: true });
        try {
            const res = await fetch("/api/editor/projects");
            if (res.ok) {
                const data = await res.json();
                set({ projects: data, loading: false });
            }
        } catch (error) {
            console.error("Erro ao buscar projetos:", error);
            set({ loading: false });
        }
    },

    deleteProject: async (slug: string) => {
        try {
            const res = await fetch(`/api/editor/projects?slug=${slug}`, { method: 'DELETE' });
            if (res.ok) {
                // Atualização otimista: remove da lista local imediatamente
                set((state) => ({
                    projects: state.projects.filter(p => p.slug !== slug)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao excluir projeto:", error);
            return false;
        }
    },

    setTempLists: (projects) => {
        const homeList = projects.filter(p => p.showOnHome);
        const casesList = [...projects].sort((a, b) => {
            return (a.casesPageOrder ?? 999) - (b.casesPageOrder ?? 999);
        });
        set({ tempHomeList: homeList, tempCasesList: casesList });
    },

    moveItem: (tab, index, direction) => {
        set((state) => {
            const listKey = tab === 'home' ? 'tempHomeList' : 'tempCasesList';
            const newList = [...state[listKey]];
            
            if (direction === 'up' && index > 0) {
                [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
            } else if (direction === 'down' && index < newList.length - 1) {
                [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
            }
            
            return { [listKey]: newList };
        });
    },

    saveOrder: async (tab) => {
        const { tempHomeList, tempCasesList } = get();
        const list = tab === 'home' ? tempHomeList : tempCasesList;
        const slugs = list.map(p => p.slug);

        set({ isSaving: true });
        try {
            const res = await fetch("/api/editor/projects", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: tab, projects: slugs })
            });
            
            if (res.ok) {
                // Após salvar a ordem, recarrega a lista oficial
                await get().fetchProjects();
                set({ isSaving: false });
                return true;
            }
            set({ isSaving: false });
            return false;
        } catch (error) {
            console.error("Erro ao salvar ordem:", error);
            set({ isSaving: false });
            return false;
        }
    }
}));

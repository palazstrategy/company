"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Trash2 } from "lucide-react";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { ReorderModal } from "@/components/ui/ReorderModal";
import React, { memo } from "react";
import { useDashboardStore } from "@/store/dashboardStore";

const ProjectCardMemo = memo(({ p, onDelete }: { p: any; onDelete: (slug: string, title: string) => void }) => (
    <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col">
        <div className="aspect-[4/3] relative bg-white/5 overflow-hidden">
            {p.imageSrc ? (
                <img src={p.imageSrc} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/10 text-[14px] font-medium tracking-tight">
                    <svg className="w-6 h-6 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Sem capa
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-1">
            <h2 className="text-[15px] font-medium text-white/90 mb-1 truncate leading-tight">{p.title}</h2>
            <p className="text-[14px] text-white/30 mb-6 truncate">{p.category || "Sem categoria"}</p>
            
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <Link href={`/editor/${p.slug}`} className="text-[#F24B0F] text-[14px] hover:text-[#ff5a1f] transition-colors">
                        Editar projeto
                    </Link>
                    <button 
                        onClick={() => onDelete(p.slug, p.title)} 
                        className="text-white/10 hover:text-red-500 transition-colors"
                        title="Excluir projeto"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                <span className="text-[14px] text-white/20 font-medium">{p.year || "2024"}</span>
            </div>
        </div>
    </div>
));
ProjectCardMemo.displayName = "ProjectCardMemo";

export default function EditorDashboard() {
    const { 
        projects, 
        loading, 
        fetchProjects, 
        deleteProject,
        isSaving 
    } = useDashboardStore();

    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [dialog, setDialog] = useState<{ open: boolean; title: string; message: string; type: 'confirm' | 'alert'; variant: 'danger' | 'warning' | 'info'; onConfirm?: () => void }>({ open: false, title: '', message: '', type: 'alert', variant: 'info' });

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (slug: string, title: string) => {
        setDialog({
            open: true,
            title: 'Excluir Projeto',
            message: `Tem certeza que deseja apagar permanentemente o case "${title}"?\n\nIsso apagará todas as traduções e imagens associadas e NÃO pode ser desfeito.`,
            type: 'confirm',
            variant: 'danger',
            onConfirm: async () => {
                const success = await deleteProject(slug);
                if (!success) {
                    setDialog({ open: true, title: 'Erro', message: `Erro ao excluir o projeto.`, type: 'alert', variant: 'danger' });
                }
            }
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/5 border-t-[#F24B0F] rounded-full animate-spin"></div>
                <p className="text-[14px] font-medium text-white/40">Carregando cases...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full text-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10 gap-4">
                <div>
                    <h1 className="text-2xl font-medium mb-1">Seu portfólio</h1>
                    <p className="text-[14px] text-white/40">Gerencie e publique os projetos do site público.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsReorderModalOpen(true)}
                        className="bg-white/5 text-white px-6 py-2.5 rounded-full text-[14px] hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10"
                    >
                        <LayoutGrid size={14} /> Reordenar cases
                    </button>
                    <Link href="/editor/new" className="bg-[#F24B0F] text-white px-7 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#ff5a1f] transition-all flex items-center gap-2 shadow-lg shadow-[#F24B0F]/10">
                        <span>+</span> Criar novo trabalho
                    </Link>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-40 border border-dashed border-white/10 rounded-[32px] text-white/20 bg-white/[0.02]">
                    <p className="font-medium text-[14px] mb-4">Portfólio vazio</p>
                    <p className="text-[14px] opacity-40">Clique em "Criar Novo Trabalho" para começar seu primeiro case.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {projects.map(p => (
                        <ProjectCardMemo key={p.slug} p={p} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            <ReorderModal 
                isOpen={isReorderModalOpen} 
                onClose={() => setIsReorderModalOpen(false)} 
            />

            <ModalDialog
                isOpen={dialog.open}
                onClose={() => setDialog(prev => ({ ...prev, open: false }))}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                variant={dialog.variant}
            />
        </div>
    );
}


"use client";
import React, { memo, useEffect, useState } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";

interface ReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReorderItem = memo(({ p, i, listLength, onMove }: { p: any, i: number, listLength: number, onMove: (idx: number, dir: 'up' | 'down') => void }) => {
    return (
        <div 
            className="flex items-center gap-4 bg-white/[0.04] p-3 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all group"
        >
            <div className="flex flex-col gap-1 flex-shrink-0">
                <button 
                    onClick={() => onMove(i, 'up')}
                    disabled={i === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/30 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                >
                    <ArrowUp size={14} />
                </button>
                <button 
                    onClick={() => onMove(i, 'down')}
                    disabled={i === listLength - 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/30 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                >
                    <ArrowDown size={14} />
                </button>
            </div>
            
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 select-none pointer-events-none">
                {p.imageSrc && <img src={p.imageSrc} className="w-full h-full object-cover" alt="" loading="lazy" />}
            </div>

            <div className="flex-1 min-w-0 select-none lowercase">
                <div className="text-[15px] font-medium truncate">{p.title?.toLowerCase() || "sem título"}</div>
                <div className="text-[14px] text-white/20 mt-0.5">{p.category || "projeto"}</div>
            </div>

            <div className="text-white/10 text-[14px] font-mono select-none tabular-nums pr-2">
                {p.year}
            </div>
        </div>
    );
});

ReorderItem.displayName = "ReorderItem";

export function ReorderModal({ isOpen, onClose }: ReorderModalProps) {
    const { 
        projects, 
        setTempLists, 
        tempHomeList, 
        tempCasesList, 
        moveItem, 
        saveOrder, 
        isSaving 
    } = useDashboardStore();

    const [reorderTab, setReorderTab] = useState<'home' | 'cases'>('home');

    useEffect(() => {
        if (isOpen) {
            setTempLists(projects);
            setReorderTab('home');
        }
    }, [isOpen, projects, setTempLists]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const success = await saveOrder(reorderTab);
        if (success) {
            onClose();
        }
    };

    const currentList = reorderTab === 'home' ? tempHomeList : tempCasesList;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isSaving && onClose()}></div>
            <div className="relative bg-[#111111] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#161616]">
                    <div>
                        <h2 className="text-[15px] font-medium text-white lowercase">reordenar cases</h2>
                        <p className="text-white/20 text-[14px] mt-1 lowercase">
                            {reorderTab === 'home' ? 'ordem de exibição na home page.' : 'ordem de exibição na página cases.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex bg-[#111111] px-8 py-2">
                    {(['home', 'cases'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setReorderTab(tab)}
                            className={`flex-1 py-4 text-[14px] transition-all relative lowercase ${
                                reorderTab === tab
                                    ? 'text-white font-medium'
                                    : 'text-white/20 hover:text-white/40'
                            }`}
                        >
                            {tab === 'home' ? 'home' : 'página cases'}
                            {reorderTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F24B0F] shadow-[0_0_10px_rgba(242,75,15,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#111111]">
                    <div className="flex flex-col gap-3">
                        {currentList.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-[14px] font-medium text-white/10 lowercase">nenhum item nesta lista</p>
                            </div>
                        ) : (
                            currentList.map((p, i) => (
                                <ReorderItem 
                                    key={p.slug} 
                                    p={p} 
                                    i={i} 
                                    listLength={currentList.length} 
                                    onMove={(idx, dir) => moveItem(reorderTab, idx, dir)} 
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 flex items-center justify-end gap-2 bg-[#161616]">
                    <button 
                        onClick={onClose} 
                        disabled={isSaving}
                        className="px-8 py-3 text-[14px] font-medium text-white/20 hover:text-white transition-colors disabled:opacity-50 lowercase"
                    >
                        cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#F24B0F] text-white px-10 py-3 rounded-full text-[14px] font-medium hover:bg-[#ff5a1f] transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-[#F24B0F]/10 hover:scale-105 active:scale-95 lowercase"
                    >
                        {isSaving ? "salvando..." : `salvar ordem (${reorderTab === 'home' ? 'home' : 'página'})`}
                    </button>
                </div>
            </div>
        </div>
    );
}

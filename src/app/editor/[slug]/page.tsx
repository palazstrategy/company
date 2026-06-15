"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@/components/editor/Editor";

export default function ProjectEditorPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const isNew = slug === "new";

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(!isNew);

    useEffect(() => {
        if (!isNew && slug) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`/api/editor/projects?slug=${slug}`);
                    if (res.ok) {
                        const data = await res.json();
                        setProject(data);
                    }
                } catch (error) {
                    console.error("Erro ao carregar projeto:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [slug, isNew]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-2 border-white/5 border-t-[#F24B0F] rounded-full animate-spin"></div>
                <p className="text-[11px] font-medium text-white/20 animate-pulse lowercase">carregando editor hyper-light...</p>
            </div>
        );
    }

    return <Editor initialProject={project} isNew={isNew} />;
}

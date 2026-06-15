import React from 'react';
import { 
    Image as ImageIcon, 
    Type, 
    Columns, 
    LayoutGrid, 
    Code, 
    Video as VideoIcon 
} from "lucide-react";

// Definição dos tipos de blocos
export const BLOCK_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    GRID: 'grid',
    COMPARE: 'compare',
    EMBED: 'embed'
} as const;

export const BLOCK_CONFIGS: Record<string, { label: string, icon: any, template: any }> = {
    [BLOCK_TYPES.TEXT]: {
        label: "Texto",
        icon: <Type size={12} />,
        template: { content: '', title: '' }
    },
    [BLOCK_TYPES.IMAGE]: {
        label: "Imagem",
        icon: <ImageIcon size={12} />,
        template: { content: '' }
    },
    [BLOCK_TYPES.VIDEO]: {
        label: "Vídeo",
        icon: <VideoIcon size={12} />,
        template: { content: '' }
    },
    [BLOCK_TYPES.GRID]: {
        label: "Grade",
        icon: <LayoutGrid size={12} />,
        template: { images: [], columns: 2 }
    },
    [BLOCK_TYPES.COMPARE]: {
        label: "Comparação",
        icon: <Columns size={12} />,
        template: { images: [], layout: 'horizontal' }
    },
    [BLOCK_TYPES.EMBED]: {
        label: "Incorporado",
        icon: <Code size={12} />,
        template: { embedCode: '' }
    }
};

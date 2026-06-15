export interface Project {
    slug: string;
    title: string;
    client: string;
    category: string;
    role: string;
    year: string;
    imageSrc: string;
    showOnHome?: boolean;
    keywords?: string;
    galleryImages?: string[];
    contentBlocks?: { 
        id: string; 
        type: string; 
        title?: string | { pt: string; en: string }; 
        content?: string | { pt: string; en: string };
        before?: string;
        after?: string;
        embedCode?: string;
        images?: string[]; // Grade de Fotos
        columns?: number;  // Layout da grade
        fonts?: { name: string; style: string; category: string }[];
    }[];
    description: string;
    naming_title?: string;
    naming_text?: string;
    colors_title?: string;
    colors_text?: string;
    icon_title?: string;
    icon_text?: string;
    compareImages?: {
        before: string;
        after: string;
    };
}

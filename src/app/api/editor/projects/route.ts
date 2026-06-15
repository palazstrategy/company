import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function checkEnv() {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("Editor API is only available in development mode.");
    }
}

const getFilePath = (relPath: string) => path.join(process.cwd(), relPath);

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function readJsonFile(relPath: string) {
    const filePath = getFilePath(relPath);
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (e: unknown) {
        const err = e as Error;
        console.error(`Error reading ${relPath}:`, err.message);
        throw err;
    }
}

async function writeJsonFile(relPath: string, data: unknown) {
    const filePath = getFilePath(relPath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");
}

export async function GET(req: Request) {
    try {
        checkEnv();
        const url = new URL(req.url);
        const requestSlug = url.searchParams.get("slug");

        const data = await readJsonFile("src/data/projects.json");
        
        if (requestSlug) {
            const project = data.find((p: Record<string, unknown>) => p.slug === requestSlug);
            if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

            let ptTrans = {};
            let enTrans = {};
            try {
                const ptData = await readJsonFile("src/messages/pt.json");
                ptTrans = ptData.ProjectsData?.[requestSlug] || {};
                const enData = await readJsonFile("src/messages/en.json");
                enTrans = enData.ProjectsData?.[requestSlug] || {};
            } catch {
                // Ignore missing translation files silently
            }

            return NextResponse.json({
                projectData: project,
                translations: { pt: ptTrans, en: enTrans }
            });
        }
        
        // Para a listagem, vamos carregar as categorias do pt.json para exibir no dashboard
        const ptData = await readJsonFile("src/messages/pt.json").catch(() => ({}));
        const projectsWithCategory = data.map((p: Record<string, any>) => ({
            ...p,
            category: ptData.ProjectsData?.[p.slug]?.category || ""
        }));

        return NextResponse.json(projectsWithCategory);
    } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 403 });
    }
}

export async function POST(req: Request) {
    try {
        checkEnv();
        const body = await req.json();
        const { projectData, translations } = body;

        const generatedTitle = projectData.title || translations?.pt?.title || translations?.en?.title || "";
        const slug = projectData.slug || slugify(generatedTitle);
        
        if (!slug) {
            return NextResponse.json({ error: "Slug inválido. O projeto precisa ter um título para ser salvo." }, { status: 400 });
        }
        
        projectData.slug = slug;

        // 1. Update projects.json
        const projects = await readJsonFile("src/data/projects.json");
        
        // Check if slug already exists
        if (projects.find((p: Record<string, unknown>) => p.slug === slug)) {
            return NextResponse.json({ error: "Slug already exists. Choose a different title or slug." }, { status: 400 });
        }
        
        projects.push(projectData);
        await writeJsonFile("src/data/projects.json", projects);

        // 2. Update Translations
        if (translations && translations.pt) {
            const ptData = await readJsonFile("src/messages/pt.json");
            if (!ptData.ProjectsData) ptData.ProjectsData = {};
            ptData.ProjectsData[slug] = translations.pt;
            await writeJsonFile("src/messages/pt.json", ptData);
        }

        if (translations && translations.en) {
            const enData = await readJsonFile("src/messages/en.json");
            if (!enData.ProjectsData) enData.ProjectsData = {};
            enData.ProjectsData[slug] = translations.en;
            await writeJsonFile("src/messages/en.json", enData);
        }

        return NextResponse.json({ success: true, slug, project: projectData });
    } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        checkEnv();
        const body = await req.json();
        const { projectData, translations, originalSlug } = body;
        
        const slug = projectData.slug;
        if (!slug || !originalSlug) {
            return NextResponse.json({ error: "Missing slug or originalSlug" }, { status: 400 });
        }

        // 1. Update projects.json
        const projects = await readJsonFile("src/data/projects.json");
        const index = projects.findIndex((p: Record<string, unknown>) => p.slug === originalSlug);
        
        if (index === -1) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        
        projects[index] = projectData;
        await writeJsonFile("src/data/projects.json", projects);

        // 2. Update Translations
        const updateLocale = async (locale: string, transData: Record<string, unknown>) => {
            if (!transData) return;
            const fileData = await readJsonFile(`src/messages/${locale}.json`);
            if (!fileData.ProjectsData) fileData.ProjectsData = {};
            
            // If slug changed, delete old key
            if (slug !== originalSlug) {
                delete fileData.ProjectsData[originalSlug];
            }
            fileData.ProjectsData[slug] = transData;
            await writeJsonFile(`src/messages/${locale}.json`, fileData);
        };

        if (translations?.pt) await updateLocale("pt", translations.pt);
        if (translations?.en) await updateLocale("en", translations.en);

        // If slug changed, we might need to rename the public/imagens/cases folder
        if (slug !== originalSlug) {
            const oldPath = getFilePath(`public/imagens/cases/${originalSlug}`);
            const newPath = getFilePath(`public/imagens/cases/${slug}`);
            try {
                // Check if old folder exists
                const stat = await fs.stat(oldPath).catch(() => null);
                if (stat?.isDirectory()) {
                    await fs.rename(oldPath, newPath);
                }
            } catch (err) {
                console.error("Failed to rename public media folder", err);
            }
        }

        return NextResponse.json({ success: true, slug, project: projectData });
    } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        checkEnv();
        const body = await req.json();
        
        // Suporte legado: array direto = reorder home
        if (Array.isArray(body)) {
            await writeJsonFile("src/data/projects.json", body);
            return NextResponse.json({ success: true });
        }

        const { type, projects: orderedSlugs } = body;
        
        if (!type || !Array.isArray(orderedSlugs)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const currentProjects = await readJsonFile("src/data/projects.json");

        if (type === 'home') {
            // Reordena o array principal pela ordem dos slugs recebidos
            const reordered = orderedSlugs
                .map((slug: string) => currentProjects.find((p: any) => p.slug === slug))
                .filter(Boolean);
            // Adiciona projetos que não estavam na lista (segurança)
            const remaining = currentProjects.filter((p: any) => !orderedSlugs.includes(p.slug));
            await writeJsonFile("src/data/projects.json", [...reordered, ...remaining]);
        } else if (type === 'cases') {
            // Atribui casesPageOrder baseado na posição recebida
            const updated = currentProjects.map((p: any) => {
                const idx = orderedSlugs.indexOf(p.slug);
                return { ...p, casesPageOrder: idx >= 0 ? idx : 999 };
            });
            await writeJsonFile("src/data/projects.json", updated);
        }

        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        checkEnv();
        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required for deletion" }, { status: 400 });
        }

        // 1. Apagar do projects.json
        const projects = await readJsonFile("src/data/projects.json");
        const filteredProjects = projects.filter((p: Record<string, unknown>) => p.slug !== slug);
        
        if (projects.length === filteredProjects.length) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        
        await writeJsonFile("src/data/projects.json", filteredProjects);

        // 2. Apagar Traduções
        const removeTranslation = async (locale: string) => {
            try {
                const fileData = await readJsonFile(`src/messages/${locale}.json`);
                if (fileData.ProjectsData && fileData.ProjectsData[slug]) {
                    delete fileData.ProjectsData[slug];
                    await writeJsonFile(`src/messages/${locale}.json`, fileData);
                }
            } catch (err) {
                // Ignore silent misses
            }
        };

        await removeTranslation("pt");
        await removeTranslation("en");

        // 3. Deletar pasta de mídia do case
        const folderPath = getFilePath(`public/imagens/cases/${slug}`);
        try {
            await fs.rm(folderPath, { recursive: true, force: true });
        } catch (err) {
            console.error(`Failed to delete folder for project ${slug}`, err);
        }

        return NextResponse.json({ success: true, deletedSlug: slug });
    } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

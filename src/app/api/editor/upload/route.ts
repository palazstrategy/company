import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized. Editor API is only available in development mode." }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        const slug = formData.get("slug") as string | null;
        
        if (files.length === 0 || !slug) {
            return NextResponse.json({ error: "Missing files or slug." }, { status: 400 });
        }

        const urls: string[] = [];
        const dirPath = path.join(process.cwd(), `public/imagens/cases/${slug}`);
        await fs.mkdir(dirPath, { recursive: true });

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            
            // Pega a extensão e o nome base separadamente
            const ext = path.extname(file.name).toLowerCase();
            const baseName = path.basename(file.name, ext)
                .replace(/\s+/g, '-')
                .toLowerCase()
                .replace(/[^\w-]/g, ''); // Remove caracteres especiais
            
            // Gera um nome descritivo para SEO: {slug}-palaz-strategy-company-{nome-original}
            // Se o nome original já começar com o slug, não repete
            let finalName = baseName;
            if (!baseName.includes(slug)) {
                finalName = `${slug}-palaz-strategy-company-${baseName}`;
            } else if (!baseName.includes('palaz-strategy-company')) {
                // Se tinha apenas 'palaz', substitui pelo nome completo
                if (baseName.includes(`${slug}-palaz-`)) {
                    finalName = baseName.replace(`${slug}-palaz-`, `${slug}-palaz-strategy-company-`);
                } else {
                    finalName = baseName.replace(slug, `${slug}-palaz-strategy-company`);
                }
            }
            
            const filename = `${finalName}${ext}`;
            const filePath = path.join(dirPath, filename);
            await fs.writeFile(filePath, new Uint8Array(buffer));
            urls.push(`/imagens/cases/${slug}/${filename}`);
        }

        return NextResponse.json({ success: true, urls });
    } catch (e: unknown) {
        const err = e as Error;
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { fileUrl } = await req.json();
        
        if (!fileUrl || !fileUrl.startsWith('/imagens/cases/')) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const absolutePath = path.join(process.cwd(), "public", fileUrl);
        
        try {
            await fs.unlink(absolutePath);
            return NextResponse.json({ success: true, message: "File deleted" });
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return NextResponse.json({ success: true, message: "File already deleted" });
            }
            throw err;
        }
    } catch (e: unknown) {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}

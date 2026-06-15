import { getProjectBySlug, getProjects, getNextProject } from "@/data/projects"
import { FadeIn } from "@/components/animations/FadeIn"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CaseGallery } from "@/components/page-specific/CaseGallery"
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd"
import { CTA } from "@/components/sections/CTA"

export async function generateStaticParams() {
    const projects = await getProjects()
    return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { slug, locale } = await params;
    const project = getProjectBySlug(slug);
    
    if (!project) return { title: 'Case Not Found | Palaz' };
    
    try {
        const tMetadata = await getTranslations({ locale, namespace: "Metadata" });
        const tData = await getTranslations({ locale, namespace: "ProjectsData" });
        
        const translatedTitle = tData.has(`${slug}.title`) ? tData(`${slug}.title`) : project.title;
        const translatedDesc = tData.has(`${slug}.description`) ? tData(`${slug}.description`) : (project.description || "");
        const translatedCategory = tData.has(`${slug}.category`) ? tData(`${slug}.category`) : (project.category || "");
        
        // Automatic SEO logic: 
        // 1. Try to get keywords from i18n (optional override)
        // 2. Fallback to Project Title + Category
        let projectKeywords = '';
        if (tData.has(`${slug}.keywords`)) {
            projectKeywords = tData(`${slug}.keywords`);
        }
        
        // If not provided in i18n, generate automatically
        if (!projectKeywords || projectKeywords === `ProjectsData.${slug}.keywords`) {
            projectKeywords = `${translatedTitle}${translatedCategory ? `, ${translatedCategory}` : ''}`;
        }
        
        const caseKeywords = projectKeywords ? `, ${projectKeywords}` : '';
        const globalKeywords = tMetadata('keywords');
        
        return {
            title: `${translatedTitle} | Palaz`,
            description: translatedDesc.substring(0, 160),
            keywords: `${globalKeywords}${caseKeywords}`,
            openGraph: {
                title: `${translatedTitle} | Palaz Strategy & Design`,
                description: translatedDesc.substring(0, 160),
                type: 'article',
                url: `https://palaz.com.br/${locale}/cases/${slug}`,
                images: [
                    {
                        url: project.imageSrc,
                        width: 1200,
                        height: 630,
                        alt: translatedTitle,
                    },
                ],
            },
            alternates: {
                canonical: locale === 'pt' ? `/cases/${slug}` : `/${locale}/cases/${slug}`,
                languages: {
                    'pt-BR': `/cases/${slug}`,
                    'en-US': `/en/cases/${slug}`,
                    'x-default': `/cases/${slug}`
                }
            },
            twitter: {
                card: 'summary_large_image',
                title: translatedTitle,
                description: translatedDesc.substring(0, 160),
                images: [project.imageSrc],
            },
        };
    } catch(e) {
         return {
             title: `${project.title || 'Case'} | Palaz`,
             description: (project.description || "").substring(0, 160)
         };
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params
    setRequestLocale(locale);
    const project = getProjectBySlug(slug)
    const tDetails = await getTranslations("ProjectDetails")
    const tData = await getTranslations("ProjectsData")

    if (!project) {
        notFound()
    }

    return (
        <>
            <BreadcrumbJsonLd 
                items={[
                    { name: 'Palaz', item: 'https://palaz.com.br' },
                    { name: 'Cases', item: 'https://palaz.com.br/cases' },
                    { name: tData.has(`${slug}.title`) ? tData(`${slug}.title`) : project.title, item: `https://palaz.com.br/${locale}/cases/${slug}` }
                ]}
            />
            <div className="w-full min-h-screen bg-black">
                {/* Hero image */}
                <div className="relative w-full h-[70vh] overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <FadeIn direction="none" scale={1.1} duration={1.2} className="absolute inset-0 h-full w-full">
                            <Image
                                src={project.imageSrc}
                                alt={tData(`${slug}.title`) || project.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                                quality={90}
                            />
                        </FadeIn>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Project Info */}
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[60px] py-16 md:py-20 relative z-20">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16">
                        {/* Left: Title + Description */}
                        <div className="xl:col-span-7 order-2 xl:order-1">
                            <FadeIn scale={0.98}>

                                  <h1 className="text-5xl md:text-6xl xl:text-7xl font-medium tracking-[-0.04em] text-white mb-6 md:mb-8">
                                    {tData.has(`${slug}.title`) ? tData(`${slug}.title`) : project.title}
                                 </h1>

                                 <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line max-w-3xl">
                                    {tData.has(`${slug}.description`) ? tData(`${slug}.description`) : project.description}
                                 </p>
                            </FadeIn>

                        </div>

                        {/* Right: Sidebar info */}
                        <div className="xl:col-span-5 order-1 xl:order-2">
                            <FadeIn scale={0.98} delay={0.2}>
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                                    {[
                                        { label: tDetails("client"), value: (tData.has(`${slug}.client`) ? tData(`${slug}.client`) : project.client) },
                                        { label: tDetails("year"), value: project.year },
                                        { label: tDetails("category"), value: (tData.has(`${slug}.category`) ? tData(`${slug}.category`) : project.category) },
                                        { label: tDetails("role"), value: (tData.has(`${slug}.role`) ? tData(`${slug}.role`) : project.role) },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-start py-4 border-b border-white/5 last:border-b-0">
                                            <span className="text-white/40 text-sm uppercase tracking-widest pt-1">{item.label}</span>
                                            <span className="text-white text-sm font-medium whitespace-pre-line text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                <CaseGallery 
                    project={project} 
                    slug={slug} 
                />

                {/* CTA Section */}
                <CTA />

                {/* Navigation and Back link */}
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[60px] pb-16 md:pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-12 border-t border-white/10 pt-10 md:pt-12">
                        <FadeIn delay={0.2}>
                            <Link href="/cases" className="inline-flex items-center gap-2 text-white/40 text-sm uppercase tracking-widest font-semibold hover:text-white transition-colors">
                                ← {tDetails("back_button")}
                            </Link>
                        </FadeIn>

                        {(() => {
                            const nextProject = getNextProject(slug);
                            return (
                                <FadeIn delay={0.3}>
                                    <Link href={`/cases/${nextProject.slug}`} className="group flex flex-col items-end text-right">
                                        <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2">{tDetails("next_project") || "Próximo Projeto"}</span>
                                        <span className="text-2xl md:text-3xl lg:text-4xl text-white font-medium group-hover:text-[#F24B0F] transition-colors">
                                            {tData.has(`${nextProject.slug}.title`) ? tData(`${nextProject.slug}.title`) : nextProject.title} →
                                        </span>
                                    </Link>
                                </FadeIn>
                            );
                        })()}
                    </div>
                </div>

            </div>
        </>
    )
}

import { Project } from "@/types";
import projectsData from "./projects.json";

export const projects: Project[] = projectsData as unknown as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
    const sortedProjects = [...projects].sort((a, b) => ((a as Project & { casesPageOrder?: number }).casesPageOrder || 0) - ((b as Project & { casesPageOrder?: number }).casesPageOrder || 0));
    const currentIndex = sortedProjects.findIndex(p => p.slug === currentSlug);
    const nextIndex = (currentIndex + 1) % sortedProjects.length;
    return sortedProjects[nextIndex];
}

export async function getProjects(): Promise<Project[]> {
    return projects;
}

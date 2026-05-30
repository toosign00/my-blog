import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import { cache } from 'react';
import { PATHS } from '@/constants/paths.constants';
import type { Project, ProjectMetadata } from '@/types/project.types';
import { createBlur } from '@/utils/blur-util';

interface ProjectModule {
  default: ComponentType;
  metadata?: ProjectMetadata;
}

interface ProjectPageData {
  project: Project;
  content: ProjectModule['default'];
}

const PROJECT_FILE = 'project.mdx';
const RECOMMEND_COUNT = 6;

const hasProjectFile = async (slug: string): Promise<boolean> => {
  try {
    await access(path.join(PATHS.PROJECTS_DIR, slug, PROJECT_FILE));
    return true;
  } catch {
    return false;
  }
};

const resolveProjectAsset = (slug: string, asset: string): string => {
  if (asset.startsWith('https://')) {
    return asset;
  }

  return `/covers/projects/${slug}/${asset.replace(/^\.\//, '')}`;
};

const buildProject = async (slug: string, metadata: ProjectMetadata): Promise<Project> => {
  const coverImage = resolveProjectAsset(slug, metadata.coverImage);
  let coverImageBlur: string | undefined;

  try {
    const systemPath = path.join(PATHS.PROJECTS_DIR, slug, metadata.coverImage);
    coverImageBlur = await createBlur(systemPath);
  } catch {
    // blur 생성 실패 시 무시
  }

  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage,
    coverImageBlur,
  };
};

const compareProjects = (a: Project, b: Project): number => {
  if (a.order !== undefined && b.order !== undefined) {
    return a.order - b.order;
  }

  if (a.order !== undefined) return -1;
  if (b.order !== undefined) return 1;

  return a.createdAt > b.createdAt ? -1 : 1;
};

export const getAllProjects = cache(async (): Promise<Project[]> => {
  const entries = await readdir(PATHS.PROJECTS_DIR, {
    withFileTypes: true,
  });

  const items: Project[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !(await hasProjectFile(entry.name))) {
      continue;
    }

    const slug = entry.name;
    const projectModule = (await import(
      `@/app/projects/_projects/${slug}/project.mdx`
    )) as ProjectModule;

    if (!projectModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}/project.mdx`);
    }

    items.push(await buildProject(slug, projectModule.metadata));
  }

  items.sort(compareProjects);
  return items;
});

export const getProjectBySlug = async (slug: string): Promise<Project> => {
  const { project } = await getProjectPageDataBySlug(slug);
  return project;
};

export const getProjectPageDataBySlug = async (slug: string): Promise<ProjectPageData> => {
  try {
    const projectModule = (await import(
      `@/app/projects/_projects/${slug}/project.mdx`
    )) as ProjectModule;

    if (!projectModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}/project.mdx`);
    }

    return {
      project: await buildProject(slug, projectModule.metadata),
      content: projectModule.default,
    };
  } catch {
    throw new Error(`Project not found: ${slug}`);
  }
};

export const getRecommendedProjects = (projects: Project[], slug: string): Project[] => {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return projects.slice(0, RECOMMEND_COUNT);
  }

  const sliceClamped = (start: number, end: number) =>
    projects.slice(Math.max(0, start), Math.min(projects.length, end));

  const prev = sliceClamped(currentIndex - 3, currentIndex);
  const next = sliceClamped(currentIndex + 1, currentIndex + 4);

  let recommended = [...prev, ...next];

  if (recommended.length < RECOMMEND_COUNT) {
    const need = RECOMMEND_COUNT - recommended.length;
    const isFront = currentIndex < projects.length / 2;
    const isIncluded = (project: Project) => recommended.some((item) => item.slug === project.slug);

    if (isFront) {
      const more = sliceClamped(currentIndex + 4, currentIndex + 4 + need * 2)
        .filter((project) => !isIncluded(project))
        .slice(0, need);
      recommended = [...recommended, ...more];
    } else {
      const prevWindowStart = Math.max(0, currentIndex - 3);
      const more = sliceClamped(prevWindowStart - need * 2, prevWindowStart)
        .filter((project) => !isIncluded(project))
        .slice(0, need);
      recommended = [...more, ...recommended];
    }
  }

  return recommended;
};

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

export class ProjectNotFoundError extends Error {
  constructor(slug: string) {
    super(`Project not found: ${slug}`);
    this.name = 'ProjectNotFoundError';
  }
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

const hasProjectAsset = async (slug: string, asset: string): Promise<boolean> => {
  try {
    await access(path.join(PATHS.PROJECTS_DIR, slug, asset));
    return true;
  } catch {
    return false;
  }
};

const resolveProjectAsset = (slug: string, asset: string): string => {
  if (isRemoteImage(asset)) {
    return asset;
  }

  return `/covers/projects/${slug}/${asset.replace(/^\.\//, '')}`;
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(isNonEmptyString);
};

const isValidDateString = (value: string) => {
  return Number.isFinite(Date.parse(value));
};

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isRemoteImage = (value: string) => {
  return value.startsWith('https://');
};

const validateProjectMetadata = (slug: string, metadata: ProjectMetadata) => {
  const errors: string[] = [];

  if (!isNonEmptyString(metadata.title)) errors.push('title is required');
  if (!isNonEmptyString(metadata.description)) errors.push('description is required');
  if (!isNonEmptyString(metadata.createdAt)) errors.push('createdAt is required');
  if (!isNonEmptyString(metadata.coverImage)) errors.push('coverImage is required');
  if (isNonEmptyString(metadata.coverImage) && metadata.coverImage.includes('://')) {
    if (!isValidUrl(metadata.coverImage)) {
      errors.push('coverImage must be a valid URL or local file name');
    }
  }
  if (!isStringArray(metadata.tags) || metadata.tags.length === 0) {
    errors.push('tags must contain at least one value');
  }
  if (metadata.capabilities !== undefined && !isStringArray(metadata.capabilities)) {
    errors.push('capabilities must be a string array');
  }
  if (metadata.createdAt && !isValidDateString(metadata.createdAt)) {
    errors.push('createdAt must be a valid date');
  }
  if (metadata.projectDue && !isValidDateString(metadata.projectDue)) {
    errors.push('projectDue must be a valid date');
  }
  if (metadata.order !== undefined && !Number.isFinite(metadata.order)) {
    errors.push('order must be a finite number');
  }

  for (const key of ['repository', 'docs', 'url'] as const) {
    const value = metadata[key];
    if (value !== undefined && (!isNonEmptyString(value) || !isValidUrl(value))) {
      errors.push(`${key} must be a valid URL`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid project metadata in ${slug}: ${errors.join(', ')}`);
  }
};

const buildProject = async (slug: string, metadata: ProjectMetadata): Promise<Project> => {
  validateProjectMetadata(slug, metadata);

  const coverImage = resolveProjectAsset(slug, metadata.coverImage);
  const heroImageSource =
    metadata.heroImage ?? ((await hasProjectAsset(slug, 'hero.webp')) ? 'hero.webp' : undefined);
  const heroImage = heroImageSource ? resolveProjectAsset(slug, heroImageSource) : coverImage;
  let coverImageBlur: string | undefined;
  let heroImageBlur: string | undefined;

  try {
    const systemPath = isRemoteImage(metadata.coverImage)
      ? metadata.coverImage
      : path.join(PATHS.PROJECTS_DIR, slug, metadata.coverImage);
    coverImageBlur = await createBlur(systemPath);
  } catch {
    // blur 생성 실패 시 무시
  }

  if (heroImageSource) {
    try {
      const systemPath = isRemoteImage(heroImageSource)
        ? heroImageSource
        : path.join(PATHS.PROJECTS_DIR, slug, heroImageSource);
      heroImageBlur = await createBlur(systemPath);
    } catch {
      // blur 생성 실패 시 무시
    }
  }

  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage,
    coverImageBlur,
    heroImage,
    heroImageBlur,
  };
};

const compareProjects = (a: Project, b: Project): number => {
  if (a.order !== undefined && b.order !== undefined) {
    const orderDiff = a.order - b.order;
    if (orderDiff !== 0) return orderDiff;
  }

  if (a.order !== undefined) return -1;
  if (b.order !== undefined) return 1;

  const createdAtDiff = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  if (createdAtDiff !== 0) return createdAtDiff;

  const titleDiff = a.title.localeCompare(b.title);
  if (titleDiff !== 0) return titleDiff;

  return a.slug.localeCompare(b.slug);
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
  if (!(await hasProjectFile(slug))) {
    throw new ProjectNotFoundError(slug);
  }

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

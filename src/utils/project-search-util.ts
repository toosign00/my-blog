import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Project } from '@/types/project.types';

const PROJECT_SEARCH_OPTIONS = {
  keys: ['title', 'description', 'tags', 'capabilities'],
  threshold: 0.35,
  ignoreLocation: true,
} satisfies IFuseOptions<Project>;

export const searchProjects = (projects: Project[], query: string): Project[] => {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return projects;
  }

  return new Fuse(projects, PROJECT_SEARCH_OPTIONS)
    .search(normalizedQuery)
    .map((result) => result.item);
};

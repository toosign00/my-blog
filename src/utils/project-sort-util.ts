import type { Project } from '@/types/project.types';

export const compareProjectsByAlphabetical = (a: Project, b: Project) => {
  const titleDiff = a.title.localeCompare(b.title);
  if (titleDiff !== 0) return titleDiff;

  return a.slug.localeCompare(b.slug);
};

export const compareProjectsByNewest = (a: Project, b: Project) => {
  const createdAtDiff = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  if (createdAtDiff !== 0) return createdAtDiff;

  return compareProjectsByAlphabetical(a, b);
};

export const compareProjectsByRecommended = (a: Project, b: Project) => {
  if (a.recommendedOrder !== undefined && b.recommendedOrder !== undefined) {
    const orderDiff = a.recommendedOrder - b.recommendedOrder;
    if (orderDiff !== 0) return orderDiff;
  }

  if (a.recommendedOrder !== undefined) return -1;
  if (b.recommendedOrder !== undefined) return 1;

  return compareProjectsByNewest(a, b);
};

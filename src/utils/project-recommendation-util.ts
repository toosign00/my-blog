import type { Project } from '@/types/project.types';

const RECOMMEND_COUNT = 6;

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

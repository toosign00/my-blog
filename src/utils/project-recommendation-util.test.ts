import type { Project } from '@/types/project.types';
import { getRecommendedProjects } from './project-recommendation-util';

const projects: Project[] = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;

  return {
    _id: `project-${number}`,
    slug: `project-${number}`,
    title: `Project ${number}`,
    description: `Description ${number}`,
    createdAt: '2026-01-01',
    modifiedAt: '2026-01-01',
    coverImage: `/project-${number}.webp`,
    tags: [],
  };
});

const getSlugs = (items: Project[]) => items.map((project) => project.slug);

describe('getRecommendedProjects', () => {
  it('returns the first six projects when the current slug is missing', () => {
    expect(getSlugs(getRecommendedProjects(projects, 'missing'))).toEqual([
      'project-1',
      'project-2',
      'project-3',
      'project-4',
      'project-5',
      'project-6',
    ]);
  });

  it('returns the three projects on each side of a middle project', () => {
    expect(getSlugs(getRecommendedProjects(projects, 'project-5'))).toEqual([
      'project-2',
      'project-3',
      'project-4',
      'project-6',
      'project-7',
      'project-8',
    ]);
  });

  it('fills recommendations from later projects at the front of the list', () => {
    expect(getSlugs(getRecommendedProjects(projects, 'project-1'))).toEqual([
      'project-2',
      'project-3',
      'project-4',
      'project-5',
      'project-6',
      'project-7',
    ]);
  });

  it('fills recommendations from earlier projects at the end of a seven-item list', () => {
    expect(getSlugs(getRecommendedProjects(projects.slice(0, 7), 'project-7'))).toEqual([
      'project-1',
      'project-2',
      'project-3',
      'project-4',
      'project-5',
      'project-6',
    ]);
  });

  it('returns every other project when fewer than six recommendations exist', () => {
    expect(getSlugs(getRecommendedProjects(projects.slice(0, 3), 'project-2'))).toEqual([
      'project-1',
      'project-3',
    ]);
  });
});

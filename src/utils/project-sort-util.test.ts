import type { Project } from '@/types/project.types';
import {
  compareProjectsByAlphabetical,
  compareProjectsByNewest,
  compareProjectsByRecommended,
} from './project-sort-util';

const createProject = (overrides: Partial<Project>): Project => ({
  _id: 'project',
  slug: 'project',
  title: 'Project',
  description: 'Project description',
  createdAt: '2026-01-01',
  modifiedAt: '2026-01-01',
  coverImage: '/project.webp',
  tags: [],
  ...overrides,
});

describe('project sort comparators', () => {
  it('sorts alphabetically and uses the slug when titles match', () => {
    const projects = [
      createProject({ _id: 'zulu', slug: 'zulu', title: 'Bravo' }),
      createProject({ _id: 'beta', slug: 'beta', title: 'Alpha' }),
      createProject({ _id: 'alpha', slug: 'alpha', title: 'Alpha' }),
    ];

    expect(projects.sort(compareProjectsByAlphabetical).map((project) => project.slug)).toEqual([
      'alpha',
      'beta',
      'zulu',
    ]);
  });

  it('sorts newest first and falls back to alphabetical order for equal dates', () => {
    const projects = [
      createProject({ _id: 'older', slug: 'older', title: 'Older', createdAt: '2025-01-01' }),
      createProject({ _id: 'beta', slug: 'beta', title: 'Beta', createdAt: '2026-01-01' }),
      createProject({ _id: 'alpha', slug: 'alpha', title: 'Alpha', createdAt: '2026-01-01' }),
    ];

    expect(projects.sort(compareProjectsByNewest).map((project) => project.slug)).toEqual([
      'alpha',
      'beta',
      'older',
    ]);
  });

  it('puts explicitly recommended projects first and orders the rest by newest', () => {
    const projects = [
      createProject({ _id: 'newest', slug: 'newest', createdAt: '2026-03-01' }),
      createProject({
        _id: 'second',
        slug: 'second',
        createdAt: '2024-01-01',
        recommendedOrder: 2,
      }),
      createProject({
        _id: 'first',
        slug: 'first',
        createdAt: '2023-01-01',
        recommendedOrder: 1,
      }),
      createProject({ _id: 'older', slug: 'older', createdAt: '2025-03-01' }),
    ];

    expect(projects.sort(compareProjectsByRecommended).map((project) => project.slug)).toEqual([
      'first',
      'second',
      'newest',
      'older',
    ]);
  });
});

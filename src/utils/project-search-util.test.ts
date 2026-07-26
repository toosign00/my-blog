import type { Project } from '@/types/project.types';
import { searchProjects } from './project-search-util';

const projects: Project[] = [
  {
    _id: 'atlas',
    slug: 'project-atlas',
    title: 'Project Atlas',
    description: 'A delivery planning workspace',
    createdAt: '2026-01-10',
    modifiedAt: '2026-01-10',
    coverImage: '/atlas.webp',
    tags: ['Web'],
    capabilities: ['Collaboration'],
  },
  {
    _id: 'runway',
    slug: 'community-runway',
    title: 'Community Runway',
    description: 'A mentoring platform',
    createdAt: '2025-06-15',
    modifiedAt: '2025-06-15',
    coverImage: '/runway.webp',
    tags: ['Mobile'],
    capabilities: ['Observability'],
  },
];

describe('searchProjects', () => {
  it('returns every project when the query is blank', () => {
    expect(searchProjects(projects, '   ')).toEqual(projects);
  });

  it.each([
    ['title', 'Atlas', 'project-atlas'],
    ['description', 'mentoring', 'community-runway'],
    ['tag', 'Mobile', 'community-runway'],
    ['capability', 'Observability', 'community-runway'],
  ])('finds a project by its %s', (_field, query, expectedSlug) => {
    expect(searchProjects(projects, query).map((project) => project.slug)).toEqual([expectedSlug]);
  });

  it('ignores whitespace around the query', () => {
    expect(searchProjects(projects, '  Atlas  ').map((project) => project.slug)).toEqual([
      'project-atlas',
    ]);
  });
});

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Project } from '@/types/project.types';
import { ProjectSection } from './ProjectSection';

const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

const projects: Project[] = [
  {
    _id: 'atlas',
    slug: 'project-atlas',
    title: 'Project Atlas',
    description: 'A collaborative planning workspace',
    createdAt: '2026-02-01',
    modifiedAt: '2026-02-01',
    coverImage: '/atlas.webp',
    tags: ['Web', 'React'],
    capabilities: ['Collaboration'],
    recommendedOrder: 2,
  },
  {
    _id: 'runway',
    slug: 'community-runway',
    title: 'Community Runway',
    description: 'A mobile mentoring platform',
    createdAt: '2025-06-01',
    modifiedAt: '2025-06-01',
    coverImage: '/runway.webp',
    tags: ['Mobile'],
    capabilities: ['Mentoring'],
    recommendedOrder: 1,
  },
  {
    _id: 'dashboard',
    slug: 'ops-dashboard',
    title: 'Ops Dashboard',
    description: 'An operations monitoring dashboard',
    createdAt: '2026-03-01',
    modifiedAt: '2026-03-01',
    coverImage: '/dashboard.webp',
    tags: ['Web', 'React'],
    capabilities: ['Observability'],
  },
];

const getProjectNames = () =>
  screen
    .queryAllByRole('link', { name: /^Read project:/ })
    .map((link) => link.getAttribute('aria-label'));

describe('ProjectSection', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/projects');
    mockUsePathname.mockReturnValue('/projects');
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows projects in recommended order by default', () => {
    render(<ProjectSection projects={projects} />);

    expect(getProjectNames()).toEqual([
      'Read project: Community Runway',
      'Read project: Project Atlas',
      'Read project: Ops Dashboard',
    ]);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('filters projects by the selected tag', async () => {
    const user = userEvent.setup();
    render(<ProjectSection projects={projects} />);

    await user.click(screen.getByRole('button', { name: 'React' }));

    expect(getProjectNames()).toEqual([
      'Read project: Project Atlas',
      'Read project: Ops Dashboard',
    ]);
    expect(window.location.search).toBe('?tag=React');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Project tag' }), 'Mobile');

    expect(getProjectNames()).toEqual(['Read project: Community Runway']);
    expect(window.location.search).toBe('?tag=Mobile');
  });

  it('sorts projects and synchronizes the selection to the URL', async () => {
    const user = userEvent.setup();
    render(<ProjectSection projects={projects} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Project sort' }), 'newest');

    expect(getProjectNames()).toEqual([
      'Read project: Ops Dashboard',
      'Read project: Project Atlas',
      'Read project: Community Runway',
    ]);
    expect(window.location.search).toBe('?sort=newest');
  });

  it('applies tag, sort, and search state from the URL', async () => {
    window.history.replaceState(null, '', '/projects?tag=React&sort=alphabetical&q=Web');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=React&sort=alphabetical&q=Web'));

    render(<ProjectSection projects={projects} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Project tag' })).toHaveValue('React');
      expect(screen.getByRole('combobox', { name: 'Project sort' })).toHaveValue('alphabetical');
      expect(screen.getByRole('searchbox', { name: 'Project search' })).toHaveValue('Web');
    });
    expect(getProjectNames()).toEqual([
      'Read project: Ops Dashboard',
      'Read project: Project Atlas',
    ]);
  });

  it('falls back to the default filters for unsupported initial values', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=All'));

    render(<ProjectSection initialSort='unsupported' initialTag='Missing' projects={projects} />);

    expect(screen.getByRole('combobox', { name: 'Project tag' })).toHaveValue('All');
    expect(screen.getByRole('combobox', { name: 'Project sort' })).toHaveValue('recommended');
  });

  it('applies the search after the debounce and synchronizes it to the URL', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ProjectSection projects={projects} />);

    await user.type(screen.getByRole('searchbox', { name: 'Project search' }), 'Observability');

    expect(getProjectNames()).toHaveLength(3);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(getProjectNames()).toEqual(['Read project: Ops Dashboard']);
    expect(window.location.search).toBe('?q=Observability');
  });

  it('removes filter parameters from the URL when filters are reset', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const searchParams = new URLSearchParams('tag=React&sort=alphabetical&q=Web');
    window.history.replaceState(null, '', `/projects?${searchParams.toString()}`);
    mockUseSearchParams.mockReturnValue(searchParams);

    render(
      <ProjectSection
        initialQuery='Web'
        initialSort='alphabetical'
        initialTag='React'
        projects={projects}
      />
    );

    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project sort' }), 'recommended');
    await user.clear(screen.getByRole('searchbox', { name: 'Project search' }));
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(window.location.pathname).toBe('/projects');
    expect(window.location.search).toBe('');
  });

  it('shows an empty state when no project matches the search', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ProjectSection projects={projects} />);

    await user.type(screen.getByRole('searchbox', { name: 'Project search' }), 'no-match');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('표시할 프로젝트가 없습니다.')).toBeInTheDocument();
    expect(getProjectNames()).toHaveLength(0);
  });
});

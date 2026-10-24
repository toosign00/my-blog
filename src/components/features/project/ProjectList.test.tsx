import { render, screen, within } from '@testing-library/react';
import type { Project } from '@/types/project.types';
import { ProjectList } from './ProjectList';

const createProject = (slug: string, title: string, awards?: string): Project => ({
  _id: slug,
  slug,
  title,
  description: `${title} description`,
  createdAt: '2026-01-01',
  modifiedAt: '2026-01-01',
  coverImage: `/${slug}.webp`,
  tags: ['Web'],
  awards,
});

const projects = [
  createProject('first-project', 'First Project', 'First Award'),
  createProject('second-project', 'Second Project', 'Second Award'),
];

describe('ProjectList', () => {
  it('shows projects as an ordered list of cards', () => {
    render(<ProjectList projects={projects} />);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(
      within(list)
        .getAllByRole('link', { name: /^Read project:/ })
        .map((link) => link.getAttribute('aria-label'))
    ).toEqual(['Read project: First Project', 'Read project: Second Project']);
  });

  it('hides awards for every project when requested', () => {
    render(<ProjectList hideAward projects={projects} />);

    expect(screen.queryByText('First Award')).not.toBeInTheDocument();
    expect(screen.queryByText('Second Award')).not.toBeInTheDocument();
  });

  it('shows an empty list when no projects are provided', () => {
    render(<ProjectList projects={[]} />);

    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
});

import { render, screen } from '@testing-library/react';
import type { Project } from '@/types/project.types';
import { ProjectCard } from './ProjectCard';

const project: Project = {
  _id: 'atlas',
  slug: 'project-atlas',
  title: 'Project Atlas',
  description: 'A collaborative planning workspace',
  createdAt: '2026-01-10',
  modifiedAt: '2026-03-20',
  projectDue: '2026-03-20',
  coverImage: '/atlas.webp',
  coverImageBlur: 'data:image/webp;base64,AAAA',
  tags: ['Web', 'React'],
  awards: 'Featured Project',
};

describe('ProjectCard', () => {
  it('shows a navigable project summary', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read project: Project Atlas' })).toHaveAttribute(
      'href',
      '/projects/project-atlas'
    );
    expect(screen.getByRole('img', { name: 'Project Atlas Cover Image' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Atlas' })).toBeInTheDocument();
    expect(screen.getByText('A collaborative planning workspace')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('shows the completed period and award', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText('2026. 01 - 2026. 03')).toBeInTheDocument();
    expect(screen.getByText('Featured Project')).toBeInTheDocument();
  });

  it('shows an ongoing period and hides the award when requested', () => {
    render(<ProjectCard hideAward project={{ ...project, projectDue: undefined }} />);

    expect(screen.getByText('2026. 01 - Present')).toBeInTheDocument();
    expect(screen.queryByText('Featured Project')).not.toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Project } from '@/types/project.types';
import { Footer } from './footer';

const mockReplace = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const project: Project = {
  _id: 'project-atlas',
  slug: 'project-atlas',
  title: 'Project Atlas',
  description: 'A collaborative planning workspace',
  createdAt: '2026-01-01',
  modifiedAt: '2026-01-01',
  coverImage: '/project-atlas.webp',
  tags: ['Web'],
};

describe('Project Footer', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/projects/project-atlas');
    Reflect.deleteProperty(navigator, 'share');
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
    Reflect.deleteProperty(navigator, 'share');
  });

  it('shares the absolute project URL', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<Footer {...project} />);

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Share this project' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('https://toosign.me/projects/project-atlas');
    });
  });
});

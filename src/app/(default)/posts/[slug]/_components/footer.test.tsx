import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Post } from '@/types/post.types';
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

const post: Post = {
  _id: 'testing-jest',
  slug: 'testing-jest',
  title: 'Testing Jest',
  subtitle: 'A Jest testing guide',
  createdAt: '2026-07-01',
  modifiedAt: '2026-07-01',
  coverImage: '/testing-jest.webp',
  category: 'Testing',
  tags: ['Jest'],
};

describe('Post Footer', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/posts/testing-jest');
    Reflect.deleteProperty(navigator, 'share');
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
    Reflect.deleteProperty(navigator, 'share');
  });

  it('shares the absolute post URL', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<Footer {...post} />);

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('https://toosign.me/posts/testing-jest');
    });
  });
});

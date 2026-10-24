import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from './backButton';

const mockReplace = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
}));

describe('BackButton', () => {
  it('navigates to the parent of a nested path', async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue('/posts/testing-jest');
    render(<BackButton />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(mockReplace).toHaveBeenCalledWith('/posts');
  });

  it('navigates to the home page from a top-level path', async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue('/about');
    render(<BackButton />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('shows a custom label', () => {
    mockUsePathname.mockReturnValue('/posts');

    render(<BackButton label='목록으로' />);

    expect(screen.getByRole('button', { name: 'Go back' })).toHaveTextContent('목록으로');
  });
});

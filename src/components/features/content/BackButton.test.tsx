import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from './BackButton';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

describe('BackButton', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'navigation');
  });

  it('returns to the previous page when it is on this site', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'navigation', { configurable: true, value: { canGoBack: true } });
    mockUsePathname.mockReturnValue('/projects/commerce-flow');
    render(<BackButton />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('navigates to the parent when there is no previous page on this site', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'navigation', {
      configurable: true,
      value: { canGoBack: false },
    });
    mockUsePathname.mockReturnValue('/projects/commerce-flow');
    render(<BackButton />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/projects');
  });

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

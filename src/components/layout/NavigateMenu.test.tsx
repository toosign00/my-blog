import { render, screen, within } from '@testing-library/react';
import { NavigateMenu } from './NavigateMenu';

const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({ usePathname: () => mockUsePathname() }));

it.each([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/posts', 'Posts'],
  ['/projects', 'Projects'],
  ['/posts/article', 'Posts'],
  ['/projects/example', 'Projects'],
  [null, 'Home'],
  ['/posts-extra', null],
  ['/unknown', null],
])('marks only the current menu for %s', (pathname, active) => {
  mockUsePathname.mockReturnValue(pathname);
  render(<NavigateMenu />);
  const nav = within(screen.getByRole('navigation', { name: 'Main navigation' }));

  for (const [name, href] of [
    ['Home', '/'],
    ['About', '/about'],
    ['Posts', '/posts'],
    ['Projects', '/projects'],
  ]) {
    const link = nav.getByRole('link', { name });
    expect(link).toHaveAttribute('href', href);
    if (name === active) expect(link).toHaveAttribute('aria-current', 'page');
    else expect(link).not.toHaveAttribute('aria-current');
  }
});

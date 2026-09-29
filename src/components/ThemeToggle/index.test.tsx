import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '.';

const mockSetTheme = jest.fn();
const mockUseTheme = jest.fn();
jest.mock('next-themes', () => ({ useTheme: () => mockUseTheme() }));

it.each([
  ['light', 'Dark mode', 'Light mode', 'dark'],
  ['dark', 'Light mode', 'Dark mode', 'light'],
])('switches from %s to the opposite theme', async (theme, before, after, next) => {
  mockUseTheme.mockReturnValue({ resolvedTheme: theme, setTheme: mockSetTheme });
  const user = userEvent.setup();
  const { rerender } = render(<ThemeToggle />);
  const button = screen.getByRole('button', { name: 'Toggle dark or light mode' });
  expect(button).toHaveTextContent(before);

  await user.click(button);

  expect(mockSetTheme).toHaveBeenCalledWith(next);
  mockUseTheme.mockReturnValue({ resolvedTheme: next, setTheme: mockSetTheme });
  rerender(<ThemeToggle />);
  expect(button).toHaveTextContent(after);
});

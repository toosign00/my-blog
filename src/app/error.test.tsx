import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from './error';
import GlobalErrorPage from './global-error';

it('offers retry and home navigation without exposing the exception', async () => {
  const reset = jest.fn();
  const user = userEvent.setup();
  render(<ErrorPage error={new Error('private server detail')} reset={reset} />);
  expect(screen.getByRole('heading', { name: '문제가 발생했어요' })).toBeInTheDocument();
  expect(screen.queryByText('private server detail')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(reset).toHaveBeenCalledTimes(1);
});

it('provides retry and a home link when the root layout fails', async () => {
  const reset = jest.fn();
  const user = userEvent.setup();
  const { unmount } = render(
    <GlobalErrorPage error={new Error('private detail')} reset={reset} />,
    { container: document.documentElement }
  );
  expect(screen.getByRole('heading', { name: '문제가 발생했어요' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  expect(screen.queryByText('private detail')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(reset).toHaveBeenCalledTimes(1);
  unmount();
});

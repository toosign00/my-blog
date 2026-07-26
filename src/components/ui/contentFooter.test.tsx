import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentFooter } from './contentFooter';

const mockToastError = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

const url = 'https://toosign.me/posts/testing-jest';

const setNavigatorProperty = (name: string, value: unknown) => {
  Object.defineProperty(navigator, name, {
    configurable: true,
    value,
  });
};

const renderFooter = () =>
  render(
    <ContentFooter
      backButton={<a href='/posts'>Back to posts</a>}
      shareButtonAriaLabel='Share this post'
      shareButtonLabel='Share this post'
      url={url}
    />
  );

describe('ContentFooter', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'canShare');
    Reflect.deleteProperty(navigator, 'clipboard');
    Reflect.deleteProperty(navigator, 'share');
    Reflect.deleteProperty(document, 'execCommand');
  });

  it('shows the supplied back control and share button', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: 'Back to posts' })).toHaveAttribute('href', '/posts');
    expect(screen.getByRole('button', { name: 'Share this post' })).toBeInTheDocument();
  });

  it('shares the URL through the Web Share API when available', async () => {
    const user = userEvent.setup();
    const share = jest.fn().mockResolvedValue(undefined);
    const writeText = jest.fn().mockResolvedValue(undefined);
    setNavigatorProperty('share', share);
    setNavigatorProperty('canShare', jest.fn().mockReturnValue(true));
    setNavigatorProperty('clipboard', { writeText });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => expect(share).toHaveBeenCalledWith({ url }));
    expect(writeText).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('stops without copying when the user cancels sharing', async () => {
    const user = userEvent.setup();
    const share = jest.fn().mockRejectedValue(new DOMException('Canceled', 'AbortError'));
    const writeText = jest.fn().mockResolvedValue(undefined);
    setNavigatorProperty('share', share);
    setNavigatorProperty('clipboard', { writeText });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => expect(share).toHaveBeenCalled());
    expect(writeText).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('copies the URL when sharing fails', async () => {
    const user = userEvent.setup();
    const share = jest.fn().mockRejectedValue(new Error('Share failed'));
    const writeText = jest.fn().mockResolvedValue(undefined);
    setNavigatorProperty('share', share);
    setNavigatorProperty('clipboard', { writeText });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(url));
    expect(mockToastSuccess).toHaveBeenCalledWith('링크가 클립보드에 복사되었어요');
  });

  it('copies the URL when the browser rejects the share data', async () => {
    const user = userEvent.setup();
    const share = jest.fn().mockResolvedValue(undefined);
    const writeText = jest.fn().mockResolvedValue(undefined);
    setNavigatorProperty('share', share);
    setNavigatorProperty('canShare', jest.fn().mockReturnValue(false));
    setNavigatorProperty('clipboard', { writeText });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(url));
    expect(share).not.toHaveBeenCalled();
  });

  it('uses the legacy copy command when the Clipboard API is unavailable', async () => {
    const user = userEvent.setup();
    const execCommand = jest.fn().mockReturnValue(true);
    Reflect.deleteProperty(navigator, 'clipboard');
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'));
    expect(mockToastSuccess).toHaveBeenCalledWith('링크가 클립보드에 복사되었어요');
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('shows an error when copying fails', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockRejectedValue(new Error('Permission denied'));
    setNavigatorProperty('clipboard', { writeText });
    renderFooter();

    await user.click(screen.getByRole('button', { name: 'Share this post' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('링크를 복사하지 못했어요');
    });
  });
});

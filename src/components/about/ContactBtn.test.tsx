import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactButtons } from './ContactBtn';

const mockToastError = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

const setClipboard = (writeText: jest.Mock) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
};

describe('ContactButtons', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('opens external contacts in a new tab without leaking the referrer', () => {
    render(<ContactButtons />);

    const linkedIn = screen.getByRole('link', { name: 'Hyunsoo Ro' });
    expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/hyunsooro');
    expect(linkedIn).toHaveAttribute('target', '_blank');
    expect(linkedIn).toHaveAttribute('rel', 'noreferrer');
  });

  it('copies the phone number and confirms it to the user', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(<ContactButtons />);

    await user.click(screen.getByRole('button', { name: 'Copy phone number' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('+8210-8514-8477'));
    expect(mockToastSuccess).toHaveBeenCalledWith('전화번호를 클립보드에 복사했어요');
  });

  it('copies the email address and confirms it to the user', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(<ContactButtons />);

    await user.click(screen.getByRole('button', { name: 'Copy email address' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('hello@toosign.me'));
    expect(mockToastSuccess).toHaveBeenCalledWith('메일 주소를 클립보드에 복사했어요');
  });

  it('tells the user to check clipboard permissions when copying fails', async () => {
    const user = userEvent.setup();
    setClipboard(jest.fn().mockRejectedValue(new Error('denied')));
    render(<ContactButtons />);

    await user.click(screen.getByRole('button', { name: 'Copy email address' }));

    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        '복사에 실패했어요. 브라우저에서 클립보드 권한을 확인해 주세요.'
      )
    );
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });
});

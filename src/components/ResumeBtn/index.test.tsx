import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ResumeDownloadButton } from '.';

jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));
const fileUrl = 'https://example.com/resume.pdf';

it('opens the resume in a new window and remains available afterwards', async () => {
  const open = jest.spyOn(window, 'open').mockReturnValue(window);
  const user = userEvent.setup();
  render(<ResumeDownloadButton fileUrl={fileUrl}>이력서</ResumeDownloadButton>);
  const button = screen.getByRole('button', { name: '이력서' });

  await user.click(button);
  await user.click(button);

  expect(open).toHaveBeenCalledTimes(2);
  expect(open).toHaveBeenCalledWith(fileUrl, '_blank');
  expect(toast.error).not.toHaveBeenCalled();
  expect(button).toBeEnabled();
  expect(button).toHaveAccessibleName('이력서');
});

it.each(['blocked', 'throws'])('reports a popup that %s and allows retry', async (failure) => {
  const open = jest.spyOn(window, 'open').mockImplementation(() => {
    if (failure === 'throws') throw new Error('Popup unavailable');
    return null;
  });
  const user = userEvent.setup();
  render(<ResumeDownloadButton fileUrl={fileUrl}>이력서</ResumeDownloadButton>);
  const button = screen.getByRole('button', { name: '이력서' });

  await user.click(button);

  expect(toast.error).toHaveBeenCalledWith('다운로드에 실패했습니다. 다시 시도해 주세요.');
  expect(button).toBeEnabled();
  open.mockReturnValue(window);
  await user.click(button);
  expect(open).toHaveBeenCalledTimes(2);
  expect(toast.error).toHaveBeenCalledTimes(1);
});

it('does not open a window when disabled', async () => {
  const open = jest.spyOn(window, 'open').mockReturnValue(window);
  const user = userEvent.setup();
  render(
    <ResumeDownloadButton fileUrl={fileUrl} disabled>
      이력서
    </ResumeDownloadButton>
  );
  await user.click(screen.getByRole('button', { name: '이력서' }));
  expect(open).not.toHaveBeenCalled();
});

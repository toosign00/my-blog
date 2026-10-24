import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ABOUT } from '@/constants/about.constants';
import { ContactButtons } from './ContactBtn';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

it.each([
  ['phone', 'Copy phone number', '전화번호를 클립보드에 복사했어요'],
  ['email', 'Copy email address', '메일 주소를 클립보드에 복사했어요'],
])('copies the %s contact and reports success', async (type, name, message) => {
  const user = userEvent.setup();
  const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  render(<ContactButtons />);
  await user.click(screen.getByRole('button', { name }));
  const contact = ABOUT.contacts.find((item) => item.type === 'copy' && item.copyType === type);
  expect(write).toHaveBeenCalledWith(contact?.type === 'copy' ? contact.value : undefined);
  expect(toast.success).toHaveBeenCalledWith(message);
  expect(toast.error).not.toHaveBeenCalled();
});

it('reports clipboard permission failure', async () => {
  const user = userEvent.setup();
  jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
  render(<ContactButtons />);
  await user.click(screen.getByRole('button', { name: 'Copy email address' }));
  expect(toast.error).toHaveBeenCalledWith(
    '복사에 실패했어요. 브라우저에서 클립보드 권한을 확인해 주세요.'
  );
  expect(toast.success).not.toHaveBeenCalled();
});

it('renders external contact destinations in a new tab', () => {
  render(<ContactButtons />);
  for (const contact of ABOUT.contacts) {
    if (contact.type !== 'link') continue;
    const link = screen.getByRole('link', { name: contact.label });
    expect(link).toHaveAttribute('href', contact.href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  }
});

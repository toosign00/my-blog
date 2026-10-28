import { expect, test } from './fixtures';

test('persists the selected document theme across navigation and reload', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/about');
  const theme = page.getByRole('button', { name: 'Toggle dark or light mode' });
  await expect(theme).toBeVisible();
  const wasDark = await page
    .locator('html')
    .evaluate((element) => element.classList.contains('dark'));
  await theme.click();
  await expect
    .poll(() => page.locator('html').evaluate((element) => element.classList.contains('dark')))
    .toBe(!wasDark);
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Posts' })
    .click();
  await expect(page).toHaveURL(/\/posts$/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Toggle dark or light mode' })).toBeVisible();
  await expect
    .poll(() => page.locator('html').evaluate((element) => element.classList.contains('dark')))
    .toBe(!wasDark);
});

test('copies a share link with keyboard activation when the Clipboard API is absent', async ({
  page,
  next,
}) => {
  void next;
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined });
    Object.defineProperty(navigator, 'clipboard', { value: undefined });
  });
  await page.goto('/posts/filmlog-01');
  await page.getByRole('button', { name: 'Share this post' }).press('Enter');
  await expect(page.getByText('링크가 클립보드에 복사되었어요')).toBeVisible();
  await expect(page.getByText('링크를 복사하지 못했어요')).toHaveCount(0);
});

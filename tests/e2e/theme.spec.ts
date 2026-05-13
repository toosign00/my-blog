import { expect, test } from '@playwright/test';
import { openMobileMenu } from '../helpers/mobile';
import { ROUTES } from '../helpers/routes';

test.describe('Theme Toggle', () => {
  test('ThemeToggle 버튼이 렌더링된다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);
    const toggleBtn = page.getByRole('button', { name: /toggle dark or light mode/i }).first();
    await expect(toggleBtn).toBeVisible();
  });

  test('토글 클릭 시 테마가 전환된다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);
    const toggleBtn = page.getByRole('button', { name: /toggle dark or light mode/i }).first();

    const htmlEl = page.locator('html');
    const before = await htmlEl.getAttribute('class');

    await toggleBtn.click();

    const after = await htmlEl.getAttribute('class');
    expect(before).not.toEqual(after);
  });

  test('테마 전환 후 페이지 이동해도 테마가 유지된다', async ({ page, isMobile }) => {
    await page.goto(ROUTES.HOME);
    await openMobileMenu(page, isMobile);
    const toggleBtn = page.getByRole('button', { name: /toggle dark or light mode/i }).first();

    await toggleBtn.click();
    const themeAfterToggle = await page.locator('html').getAttribute('class');

    await page.goto(ROUTES.POSTS);
    const themeAfterNav = await page.locator('html').getAttribute('class');

    expect(themeAfterToggle).toEqual(themeAfterNav);
  });
});

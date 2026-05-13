import { expect, test } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.ABOUT);
  });

  test('페이지가 성공적으로 로드된다 (HTTP 200)', async ({ page }) => {
    const response = await page.goto(ROUTES.ABOUT);
    expect(response?.status()).toBe(200);
  });

  test('"Work Experience" 섹션이 렌더링된다', async ({ page }) => {
    await expect(page.getByText('Work Experience')).toBeVisible();
  });

  test('"Achievements & Activities" 섹션이 렌더링된다', async ({ page }) => {
    await expect(page.getByText(/achievements/i)).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

test.describe('404 Not Found Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/this-route-definitely-does-not-exist');
  });

  test('"404" 텍스트가 표시된다', async ({ page }) => {
    await expect(page.getByText('404')).toBeVisible();
  });

  test('"Not Found Page" 헤딩이 표시된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
  });

  test('"Home" 버튼이 홈으로 연결된다', async ({ page }) => {
    // nav의 Home 링크와 구분하기 위해 ui-button 클래스를 가진 Home 링크를 선택
    const homeLink = page.locator('a.ui-button', { hasText: 'Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL(ROUTES.HOME);
  });
});

import { expect, test } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.HOME);
  });

  test('"Update" 섹션이 렌더링된다', async ({ page }) => {
    const section = page.getByRole('region', { name: /update/i });
    await expect(section).toBeVisible();
  });

  test('"Expand" 링크가 /posts로 연결된다', async ({ page }) => {
    const expandLink = page.getByRole('link', { name: /expand/i });
    await expect(expandLink).toHaveAttribute('href', ROUTES.POSTS);
  });

  test('포스트 카드가 최소 1개 이상 렌더링된다', async ({ page }) => {
    const section = page.getByRole('region', { name: /update/i });
    const cards = section.getByRole('link', { name: /read post/i });
    await expect(cards.first()).toBeVisible();
  });

  test('포스트 카드 클릭 시 해당 포스트 상세 페이지로 이동한다', async ({ page }) => {
    const section = page.getByRole('region', { name: /update/i });
    const firstCard = section.getByRole('link', { name: /read post/i }).first();
    const href = await firstCard.getAttribute('href');

    await firstCard.click();
    await expect(page).toHaveURL(href ?? '');
    await expect(page.url()).toContain('/posts/');
  });
});

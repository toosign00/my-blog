import { expect, test } from '@playwright/test';
import { CATEGORY_SLUGS, ROUTES } from '../helpers/routes';

test.describe('Categories List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.CATEGORIES);
  });

  test('"Categories" 헤딩이 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
  });

  test('카테고리 목록 nav가 렌더링된다', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /category list/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('listitem').first()).toBeVisible();
  });

  test('카테고리 항목 클릭 시 해당 카테고리 페이지로 이동한다', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /category list/i });
    const firstLink = nav.getByRole('link').first();
    const href = await firstLink.getAttribute('href');

    await firstLink.click();
    await expect(page).toHaveURL(href ?? '');
    await expect(page.url()).toContain('/categories/');
  });
});

test.describe('Category Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.CATEGORY(CATEGORY_SLUGS.FILM));
  });

  test('카테고리 이름이 포함된 헤딩이 렌더링된다', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Film');
  });

  test('해당 카테고리의 포스트 목록이 렌더링된다', async ({ page }) => {
    const list = page.getByRole('list');
    await expect(list.getByRole('listitem').first()).toBeVisible();
  });
});

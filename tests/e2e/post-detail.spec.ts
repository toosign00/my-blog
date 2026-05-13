import { expect, test } from '@playwright/test';
import { ROUTES, SLUGS } from '../helpers/routes';

test.describe('Post Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.POST(SLUGS.FILM_01));
  });

  test('article 요소가 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('뒤로가기 버튼이 존재한다', async ({ page }) => {
    const backBtn = page.getByRole('button', { name: /go back/i }).first();
    await expect(backBtn).toBeVisible();
  });

  test('뒤로가기 버튼 클릭 시 포스트 목록으로 이동한다', async ({ page }) => {
    await page
      .getByRole('button', { name: /go back/i })
      .first()
      .click();
    await expect(page).toHaveURL(ROUTES.POSTS);
  });

  test('포스트 제목이 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('추천 포스트 섹션이 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /check them out/i })).toBeVisible();
  });

  test('존재하지 않는 슬러그에서 404가 반환된다', async ({ page }) => {
    await page.goto(ROUTES.POST('this-post-does-not-exist'));
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
  });
});

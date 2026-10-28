import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function tabTo(page: Page, target: Locator, backwards = false) {
  const key =
    process.platform === 'darwin' && test.info().project.use.browserName === 'webkit'
      ? 'Alt+Tab'
      : 'Tab';
  await expect(target).toBeVisible();
  await expect(target).toBeEnabled();
  for (let index = 0; index < 40; index++) {
    await page.keyboard.press(backwards ? `Shift+${key}` : key);
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  await expect(target).toBeFocused();
}

test('reaches project controls and searches and filters using the keyboard', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await tabTo(page, navigation.getByRole('link', { name: 'Projects' }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects$/);
  const search = page.getByRole('searchbox', { name: 'Project search' });
  await tabTo(page, search);
  await page.keyboard.type('Flow');
  await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText([
    'Commerce Flow',
  ]);
  const sort = page.getByRole('combobox', { name: 'Project sort' });
  await tabTo(page, sort, true);
  await expect(sort).toBeFocused();
  const tag = page.getByRole('button', { name: 'QA', exact: true });
  await tabTo(page, tag, true);
  await page.keyboard.press('Space');
  await expect(tag).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/projects\?tag=QA&q=Flow$/);
});

test.describe('mobile accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('keeps a long article title and code blocks inside the mobile page width', async ({
    page,
    next,
  }) => {
    void next;
    await page.goto('/posts/cloudflare-d1-blog-views');
    const article = page.getByRole('article');
    await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
    const code = article.locator('pre').first();
    await code.scrollIntoViewIfNeeded();
    await expect(code).toBeInViewport();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  });

  test('closes the menu with keyboard focus retained and navigates using Enter', async ({
    page,
    next,
  }) => {
    void next;
    await page.goto('/');
    const toggle = page.locator('button[aria-controls="menu-accordion-content"]');
    await tabTo(page, toggle);
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await tabTo(
      page,
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Projects' })
    );
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await tabTo(page, toggle);
    await expect(toggle).toBeFocused();
  });

  test('preserves a mobile menu theme change after reloading', async ({ page, next }) => {
    void next;
    await page.goto('/about');
    const toggle = page.locator('button[aria-controls="menu-accordion-content"]');
    await toggle.click();
    const theme = page.getByRole('button', { name: 'Toggle dark or light mode' });
    await expect(theme).toBeVisible();
    const wasDark = await page
      .locator('html')
      .evaluate((element) => element.classList.contains('dark'));
    await theme.click();
    await expect
      .poll(() => page.locator('html').evaluate((element) => element.classList.contains('dark')))
      .toBe(!wasDark);
    await page.reload();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(theme).toBeVisible();
    await expect
      .poll(() => page.locator('html').evaluate((element) => element.classList.contains('dark')))
      .toBe(!wasDark);
  });
});
